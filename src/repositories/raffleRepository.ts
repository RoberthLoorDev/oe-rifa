import { getDbConnection } from '../database/db';
import { RaffleEntity } from '../types/raffle';

export interface RaffleDbRow {
  id: number;
  title: string;
  product: string | null;
  description: string | null;
  ticket_count: number;
  ticket_price: number;
  draw_date: string;
  status: string;
  image: string | null;
  assigned_count: number;
}

export const raffleRepository = {
  async insert(
    title: string,
    product: string | null,
    ticketCount: number,
    ticketPrice: number,
    drawDate: string,
    image: string | null,
    description: string | null = null
  ): Promise<number> {
    const db = await getDbConnection();
    const result = await db.runAsync(
      `INSERT INTO raffles (title, product, ticket_count, ticket_price, draw_date, status, image, description)
       VALUES (?, ?, ?, ?, ?, 'EN_CURSO', ?, ?)`,
      [title, product, ticketCount, ticketPrice, drawDate, image, description]
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
        r.description,
        r.ticket_count,
        r.ticket_price,
        r.draw_date,
        r.status,
        r.image,
        COUNT(t.id) AS assigned_count
       FROM raffles r
       LEFT JOIN tickets t ON r.id = t.raffle_id
       GROUP BY r.id
       ORDER BY r.id DESC`
    )) as RaffleDbRow[];
  },

  async getById(id: number): Promise<RaffleEntity | null> {
    const db = await getDbConnection();
    return (await db.getFirstAsync(
      `SELECT * FROM raffles WHERE id = ?`,
      [id]
    )) as RaffleEntity | null;
  },

  async getTicketStats(raffleId: number): Promise<{ paid_count: number; reserved_count: number; assigned_count: number }> {
    const db = await getDbConnection();
    const stats = (await db.getFirstAsync(
      `SELECT 
        COUNT(CASE WHEN status = 'PAGADO' THEN 1 END) AS paid_count,
        COUNT(CASE WHEN status = 'RESERVADO' THEN 1 END) AS reserved_count,
        COUNT(id) AS assigned_count
       FROM tickets 
       WHERE raffle_id = ?`,
      [raffleId]
    )) as { paid_count: number; reserved_count: number; assigned_count: number } | null;
    return stats || { paid_count: 0, reserved_count: 0, assigned_count: 0 };
  }
};
