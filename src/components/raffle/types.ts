export interface Ticket {
  num: number;
  status: 'DISPONIBLE' | 'RESERVADO' | 'PAGADO';
  participant: string;
  phone: string;
}
