import * as FileSystem from 'expo-file-system/legacy';
import { CreateRaffleInput, RaffleModel, RaffleDetailModel } from '../types/raffle';
import { activityService } from './activityService';
import { raffleRepository } from '../repositories/raffleRepository';
import { saveProductImage } from '../utils/image';
import { formatDrawDateStr } from '../utils/date';

export const raffleService = {
  async createRaffle(input: CreateRaffleInput): Promise<number> {
    const dateStr = input.draw_date.toISOString().split('T')[0];
    
    let finalImageVal: string | null = null;
    if (input.image) {
      finalImageVal = await saveProductImage(input.image);
    }

    const raffleId = await raffleRepository.insert(
      input.title,
      input.product || null,
      input.ticket_count,
      input.ticket_price,
      dateStr,
      finalImageVal
    );

    await activityService.logActivity(
      raffleId, 
      `Se creó la nueva rifa: "${input.title}" con ${input.ticket_count} números.`
    );

    return raffleId;
  },

  async getRaffles(): Promise<RaffleModel[]> {
    const rows = await raffleRepository.getAllWithAssignedCount();

    return rows.map((row) => {
      let visualStatus: 'En curso' | 'Completa' | 'Cerrada' = 'En curso';
      if (row.status === 'COMPLETA') {
        visualStatus = 'Completa';
      } else if (row.status === 'CERRADA') {
        visualStatus = 'Cerrada';
      }

      if (row.assigned_count >= row.ticket_count && row.status === 'EN_CURSO') {
        visualStatus = 'Completa';
      }

      let imageUri: string | null = null;
      if (row.image) {
        if (
          row.image.startsWith('file://') ||
          row.image.startsWith('data:') ||
          row.image.startsWith('http://') ||
          row.image.startsWith('https://')
        ) {
          imageUri = row.image;
        } else {
          imageUri = `${FileSystem.documentDirectory}raffle_images/${row.image}`;
        }
      }

      return {
        id: String(row.id),
        title: row.title,
        product: row.product,
        description: row.product 
          ? `Gran sorteo de: ${row.product}` 
          : 'Organización y gestión de boletos del sorteo.',
        price: row.ticket_price,
        totalNumbers: row.ticket_count,
        assignedNumbers: row.assigned_count,
        status: visualStatus,
        date: formatDrawDateStr(row.draw_date),
        image: imageUri,
      };
    });
  },

  async getRaffleDetail(id: string): Promise<RaffleDetailModel | null> {
    const raffleId = parseInt(id, 10);
    if (isNaN(raffleId)) return null;

    const row = await raffleRepository.getById(raffleId);
    if (!row) return null;

    const stats = await raffleRepository.getTicketStats(raffleId);

    let visualStatus: 'En curso' | 'Completa' | 'Cerrada' = 'En curso';
    if (row.status === 'COMPLETA') {
      visualStatus = 'Completa';
    } else if (row.status === 'CERRADA') {
      visualStatus = 'Cerrada';
    }

    if (stats.assigned_count >= row.ticket_count && row.status === 'EN_CURSO') {
      visualStatus = 'Completa';
    }

    let imageUri: string | null = null;
    if (row.image) {
      if (
        row.image.startsWith('file://') ||
        row.image.startsWith('data:') ||
        row.image.startsWith('http://') ||
        row.image.startsWith('https://')
      ) {
        imageUri = row.image;
      } else {
        imageUri = `${FileSystem.documentDirectory}raffle_images/${row.image}`;
      }
    }

    const totalExpected = row.ticket_count * row.ticket_price;
    const totalCollected = stats.paid_count * row.ticket_price;
    const progressPercent = row.ticket_count > 0 
      ? Math.round((stats.assigned_count / row.ticket_count) * 100) 
      : 0;

    const [year, month, day] = row.draw_date.split('-').map(Number);
    const drawDateObj = new Date(year, month - 1, day);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    drawDateObj.setHours(0, 0, 0, 0);
    const diffMs = drawDateObj.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return {
      id: String(row.id),
      title: row.title,
      product: row.product,
      description: row.product 
        ? `Gran sorteo de: ${row.product}` 
        : 'Organización y gestión de boletos del sorteo.',
      price: row.ticket_price,
      totalNumbers: row.ticket_count,
      assignedNumbers: stats.assigned_count,
      status: visualStatus,
      date: formatDrawDateStr(row.draw_date),
      image: imageUri,
      paidNumbers: stats.paid_count,
      reservedNumbers: stats.reserved_count,
      availableNumbers: row.ticket_count - stats.assigned_count,
      totalCollected,
      totalExpected,
      progressPercent,
      daysRemaining
    };
  }
};
