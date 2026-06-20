import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { ticketService } from '../services/ticketService';
import { raffleService } from '../services/raffleService';
import { Ticket } from '../components/raffle/types';

export function useRaffleTickets(id: string) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [raffleTitle, setRaffleTitle] = useState('');
  const [product, setProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
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

      const list = await ticketService.getTicketsForGrid(id, detail.totalNumbers);
      setTickets(list);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al obtener los boletos de la rifa.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const assignTicket = async (
    num: number,
    participantName: string,
    participantPhone: string,
    isPaid: boolean
  ) => {
    if (!id) return;
    try {
      await ticketService.assignTicket(id, num, participantName, participantPhone, isPaid);
      await fetchTickets();
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const assignTicketsBulk = async (
    nums: number[],
    participantName: string,
    participantPhone: string,
    isPaid: boolean
  ) => {
    if (!id) return;
    try {
      await ticketService.assignTicketsBulk(id, nums, participantName, participantPhone, isPaid);
      await fetchTickets();
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const releaseTicket = async (num: number) => {
    if (!id) return;
    try {
      await ticketService.releaseTicket(id, num);
      await fetchTickets();
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, [fetchTickets])
  );

  return {
    tickets,
    raffleTitle,
    product,
    loading,
    error,
    assignTicket,
    assignTicketsBulk,
    releaseTicket,
    refresh: fetchTickets
  };
}
