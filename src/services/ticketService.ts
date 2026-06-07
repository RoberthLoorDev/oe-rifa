import { ticketRepository } from '../repositories/ticketRepository';
import { activityService } from './activityService';
import { Ticket } from '../components/raffle/types';

export const ticketService = {
  async getTicketsForGrid(raffleId: string, totalNumbers: number): Promise<Ticket[]> {
    const id = parseInt(raffleId, 10);
    if (isNaN(id)) return [];

    const assigned = await ticketRepository.getByRaffleId(id);
    const assignedMap = new Map<number, typeof assigned[0]>();
    for (const t of assigned) {
      assignedMap.set(t.ticket_num, t);
    }

    const list: Ticket[] = [];
    for (let i = 1; i <= totalNumbers; i++) {
      const match = assignedMap.get(i);
      if (match) {
        list.push({
          num: i,
          status: match.status,
          participant: match.participant_name,
          phone: match.participant_phone || ''
        });
      } else {
        list.push({
          num: i,
          status: 'DISPONIBLE',
          participant: '',
          phone: ''
        });
      }
    }
    return list;
  },

  async assignTicket(
    raffleId: string,
    num: number,
    participantName: string,
    participantPhone: string,
    isPaid: boolean
  ): Promise<void> {
    const id = parseInt(raffleId, 10);
    if (isNaN(id)) return;

    const status = isPaid ? 'PAGADO' : 'RESERVADO';
    await ticketRepository.upsert(id, num, participantName, participantPhone, status);

    const logMsg = isPaid 
      ? `${participantName} pagó el boleto #${num < 10 ? '0' + num : num}.`
      : `${participantName} reservó el boleto #${num < 10 ? '0' + num : num}.`;

    await activityService.logActivity(id, logMsg);
  },

  async assignTicketsBulk(
    raffleId: string,
    nums: number[],
    participantName: string,
    participantPhone: string,
    isPaid: boolean
  ): Promise<void> {
    const id = parseInt(raffleId, 10);
    if (isNaN(id) || nums.length === 0) return;

    const status = isPaid ? 'PAGADO' : 'RESERVADO';
    for (const num of nums) {
      await ticketRepository.upsert(id, num, participantName, participantPhone, status);
    }

    const numsStr = nums.map(n => `#${n < 10 ? '0' + n : n}`).join(', ');
    const logMsg = isPaid 
      ? `${participantName} pagó los boletos: ${numsStr}.`
      : `${participantName} reservó los boletos: ${numsStr}.`;

    await activityService.logActivity(id, logMsg);
  },

  async releaseTicket(raffleId: string, num: number): Promise<void> {
    const id = parseInt(raffleId, 10);
    if (isNaN(id)) return;

    const ticket = await ticketRepository.getByNum(id, num);
    const name = ticket?.participant_name || 'Participante';

    await ticketRepository.delete(id, num);

    await activityService.logActivity(
      id, 
      `Se liberó el boleto #${num < 10 ? '0' + num : num} que pertenecía a ${name}.`
    );
  }
};
