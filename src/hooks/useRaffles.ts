import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { raffleService } from '../services/raffleService';
import { RaffleModel } from '../types/raffle';

export function useRaffles() {
  const [raffles, setRaffles] = useState<RaffleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRaffles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await raffleService.getRaffles();
      setRaffles(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al obtener las rifas de la base de datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRaffles();
    }, [fetchRaffles])
  );

  return {
    raffles,
    loading,
    error,
    refresh: fetchRaffles,
  };
}
