export interface Raffle {
  id: string;
  title: string;
  description: string;
  price: number;
  totalNumbers: number;
  assignedNumbers: number;
  status: 'En curso' | 'Completa' | 'Cerrada';
  date: string;
  image: string | null;
}

export interface RaffleDbRow {
  id: number;
  title: string;
  product: string | null;
  ticket_count: number;
  ticket_price: number;
  draw_date: string;
  status: string;
  image: string | null;
  assigned_count: number;
}
