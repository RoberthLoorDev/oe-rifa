import { activityRepository } from '../repositories/activityRepository';
import { formatRelativeTime } from '../utils/date';

export interface ActivityLogModel {
  id: string;
  description: string;
  timeRelative: string;
}

export const activityService = {
  async logActivity(raffleId: number, description: string): Promise<void> {
    await activityRepository.insert(raffleId, description);
  },

  async getRaffleActivities(raffleId: string, limit: number = 5): Promise<ActivityLogModel[]> {
    const id = parseInt(raffleId, 10);
    if (isNaN(id)) return [];

    const rows = await activityRepository.getByRaffleId(id, limit);
    return rows.map((row) => ({
      id: String(row.id),
      description: row.description,
      timeRelative: formatRelativeTime(row.created_at)
    }));
  }
};
