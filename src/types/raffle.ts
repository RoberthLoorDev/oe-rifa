export interface RaffleEntity {
  id: number;
  title: string;
  product: string | null;
  description: string | null;
  ticket_count: number;
  ticket_price: number;
  draw_date: string;
  status: 'EN_CURSO' | 'COMPLETA' | 'CERRADA';
  winner_ticket_num: number | null;
  winner_name: string | null;
  image: string | null;
  created_at: string;
}

export interface CreateRaffleInput {
  title: string;
  product?: string;
  description?: string;
  ticket_count: number;
  ticket_price: number;
  draw_date: Date;
  image?: string;
}

export interface RaffleModel {
  id: string;
  title: string;
  product: string | null;
  description: string;
  price: number;
  totalNumbers: number;
  assignedNumbers: number;
  status: 'En curso' | 'Completa' | 'Cerrada';
  date: string;
  image: string | null;
}

export interface RaffleDetailModel extends RaffleModel {
  paidNumbers: number;
  reservedNumbers: number;
  availableNumbers: number;
  totalCollected: number;
  totalExpected: number;
  progressPercent: number;
  daysRemaining: number;
  winnerTicketNum: number | null;
  winnerName: string | null;
}
