import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { raffleService } from '../services/raffleService';
import { activityService, ActivityLogModel } from '../services/activityService';
import { RaffleDetailModel } from '../types/raffle';

export function useRaffleDetail(id: string) {
  const [raffle, setRaffle] = useState<RaffleDetailModel | null>(null);
  const [activities, setActivities] = useState<ActivityLogModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const detail = await raffleService.getRaffleDetail(id);
      if (!detail) {
        setError('No se encontró la rifa especificada.');
        return;
      }
      const logs = await activityService.getRaffleActivities(id);
      setRaffle(detail);
      setActivities(logs);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al obtener los detalles de la rifa.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchDetail();
    }, [fetchDetail])
  );

  return {
    raffle,
    activities,
    loading,
    error,
    refresh: fetchDetail,
  };
}
