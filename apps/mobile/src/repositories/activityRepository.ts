import { getDbConnection } from '../database/db';

export interface ActivityLogEntity {
  id: number;
  raffle_id: number;
  description: string;
  created_at: string;
}

export const activityRepository = {
  async insert(raffleId: number, description: string): Promise<void> {
    const db = await getDbConnection();
    await db.runAsync(
      `INSERT INTO activity_logs (raffle_id, description) VALUES (?, ?)`,
      [raffleId, description]
    );
  },

  async getByRaffleId(raffleId: number, limit: number = 5): Promise<ActivityLogEntity[]> {
    const db = await getDbConnection();
    return (await db.getAllAsync(
      `SELECT * FROM activity_logs WHERE raffle_id = ? ORDER BY id DESC LIMIT ?`,
      [raffleId, limit]
    )) as ActivityLogEntity[] || [];
  }
};
