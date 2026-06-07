import { getDbConnection } from '../database/db';

export const activityService = {
  async logActivity(raffleId: number, description: string): Promise<void> {
    const db = await getDbConnection();
    await db.runAsync(
      `INSERT INTO activity_logs (raffle_id, description) VALUES (?, ?)`,
      [raffleId, description]
    );
  }
};
