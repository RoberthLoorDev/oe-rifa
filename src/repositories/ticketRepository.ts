import { getDbConnection } from '../database/db';

export interface TicketEntity {
  id: number;
  raffle_id: number;
  ticket_num: number;
  participant_name: string;
  participant_phone: string;
  status: 'RESERVADO' | 'PAGADO';
  updated_at: string;
}

export const ticketRepository = {
  async getByRaffleId(raffleId: number): Promise<TicketEntity[]> {
    const db = await getDbConnection();
    return (await db.getAllAsync(
      `SELECT * FROM tickets WHERE raffle_id = ?`,
      [raffleId]
    )) as TicketEntity[];
  },

  async getByNum(raffleId: number, num: number): Promise<TicketEntity | null> {
    const db = await getDbConnection();
    return (await db.getFirstAsync(
      `SELECT * FROM tickets WHERE raffle_id = ? AND ticket_num = ?`,
      [raffleId, num]
    )) as TicketEntity | null;
  },

  async upsert(
    raffleId: number,
    num: number,
    participantName: string,
    participantPhone: string,
    status: 'RESERVADO' | 'PAGADO'
  ): Promise<void> {
    const db = await getDbConnection();
    await db.runAsync(
      `INSERT OR REPLACE INTO tickets (raffle_id, ticket_num, participant_name, participant_phone, status, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'))`,
      [raffleId, num, participantName, participantPhone, status]
    );
  },

  async delete(raffleId: number, num: number): Promise<void> {
    const db = await getDbConnection();
    await db.runAsync(
      `DELETE FROM tickets WHERE raffle_id = ? AND ticket_num = ?`,
      [raffleId, num]
    );
  }
};
