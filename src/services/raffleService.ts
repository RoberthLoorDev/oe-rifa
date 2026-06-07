import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { getDbConnection } from '../database/db';
import { CreateRaffleInput, RaffleModel } from '../types/raffle';
import { activityService } from './activityService';

const formatDrawDateStr = (dateStr: string): string => {
  try {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));

    const formatted = date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch (error) {
    return dateStr;
  }
};

export const raffleService = {
  async createRaffle(input: CreateRaffleInput): Promise<number> {
    const db = await getDbConnection();
    const dateStr = input.draw_date.toISOString().split('T')[0];

    let finalImageVal: string | null = null;

    if (input.image) {
      if (Platform.OS === 'web') {
        finalImageVal = input.image;
      } else {
        try {
          const raffleImagesDir = `${FileSystem.documentDirectory}raffle_images/`;
          const dirInfo = await FileSystem.getInfoAsync(raffleImagesDir);
          if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(raffleImagesDir, { intermediates: true });
          }
          const fileName = `raffle_img_${Date.now()}.jpg`;
          const destPath = `${raffleImagesDir}${fileName}`;
          await FileSystem.copyAsync({
            from: input.image,
            to: destPath,
          });
          finalImageVal = fileName;
        } catch (fsError) {
          console.error(fsError);
          finalImageVal = input.image;
        }
      }
    }

    const result = await db.runAsync(
      `INSERT INTO raffles (title, product, ticket_count, ticket_price, draw_date, status, image)
       VALUES (?, ?, ?, ?, ?, 'EN_CURSO', ?)`,
      [input.title, input.product || null, input.ticket_count, input.ticket_price, dateStr, finalImageVal],
    );

    const raffleId = result.lastInsertRowId;

    await activityService.logActivity(raffleId, `Se creó la nueva rifa: "${input.title}" con ${input.ticket_count} números.`);

    return raffleId;
  },

  async getRaffles(): Promise<RaffleModel[]> {
    const db = await getDbConnection();

    const rows = (await db.getAllAsync(
      `SELECT 
        r.id,
        r.title,
        r.product,
        r.ticket_count,
        r.ticket_price,
        r.draw_date,
        r.status,
        r.image,
        COUNT(t.id) AS assigned_count
       FROM raffles r
       LEFT JOIN tickets t ON r.id = t.raffle_id
       GROUP BY r.id
       ORDER BY r.id DESC`,
    )) as {
      id: number;
      title: string;
      product: string | null;
      ticket_count: number;
      ticket_price: number;
      draw_date: string;
      status: string;
      image: string | null;
      assigned_count: number;
    }[];

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
        description: row.product ? `Gran sorteo de: ${row.product}` : 'Organización y gestión de boletos del sorteo.',
        price: row.ticket_price,
        totalNumbers: row.ticket_count,
        assignedNumbers: row.assigned_count,
        status: visualStatus,
        date: formatDrawDateStr(row.draw_date),
        image: imageUri,
      };
    });
  },
};
