import { RaffleDbRow } from '@/components/home/types';
import { getDbConnection } from '../database/db';

export const raffleRepository = {
  async insert(
    title: string,
    product: string | null,
    ticketCount: number,
    ticketPrice: number,
    drawDate: string,
    image: string | null,
  ): Promise<number> {
    const db = await getDbConnection();
    const result = await db.runAsync(
      `INSERT INTO raffles (title, product, ticket_count, ticket_price, draw_date, status, image)
       VALUES (?, ?, ?, ?, ?, 'EN_CURSO', ?)`,
      [title, product, ticketCount, ticketPrice, drawDate, image],
    );
    return result.lastInsertRowId;
  },

  async getAllWithAssignedCount(): Promise<RaffleDbRow[]> {
    const db = await getDbConnection();
    return (await db.getAllAsync(
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
    )) as RaffleDbRow[];
  },
};
