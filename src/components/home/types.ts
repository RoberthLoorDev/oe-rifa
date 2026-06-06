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
