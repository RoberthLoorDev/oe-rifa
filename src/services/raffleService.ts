import * as FileSystem from 'expo-file-system/legacy';
import { CreateRaffleInput, RaffleModel } from '../types/raffle';
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
  }
};
