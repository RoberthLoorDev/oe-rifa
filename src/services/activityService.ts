import { activityRepository } from '../repositories/activityRepository';

export const activityService = {
  async logActivity(raffleId: number, description: string): Promise<void> {
    await activityRepository.insert(raffleId, description);
  }
};
