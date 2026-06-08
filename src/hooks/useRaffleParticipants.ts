import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { ticketService } from '../services/ticketService';
import { raffleService } from '../services/raffleService';
import { Participant } from '../components/participants/types';

export function useRaffleParticipants(id: string) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [raffleTitle, setRaffleTitle] = useState('');
  const [product, setProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipants = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const detail = await raffleService.getRaffleDetail(id);
      if (!detail) {
        setError('No se encontró la rifa.');
        return;
      }
      setRaffleTitle(detail.title);
      setProduct(detail.product);

      const list = await ticketService.getParticipants(id);
      setParticipants(list);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al obtener los participantes.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchParticipants();
    }, [fetchParticipants])
  );

  return {
    participants,
    raffleTitle,
    product,
    loading,
    error,
    refresh: fetchParticipants
  };
}
