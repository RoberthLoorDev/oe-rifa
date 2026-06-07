import { getDbConnection } from '../database/db';

export const activityRepository = {
  async insert(raffleId: number, description: string): Promise<void> {
    const db = await getDbConnection();
    await db.runAsync(
      `INSERT INTO activity_logs (raffle_id, description) VALUES (?, ?)`,
      [raffleId, description]
    );
  }
};
