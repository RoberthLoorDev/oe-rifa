export interface Participant {
  id: string;
  name: string;
  phone: string;
  numbers: number[];
  status: 'PAGADO' | 'RESERVADO';
}
