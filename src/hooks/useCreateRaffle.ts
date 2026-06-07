import { useState } from 'react';
import { useRouter } from 'expo-router';
import { raffleService } from '../services/raffleService';

export function useCreateRaffle() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [product, setProduct] = useState('');
  const [description, setDescription] = useState('');
  const [ticketCount, setTicketCount] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [drawDate, setDrawDate] = useState<Date>(new Date());
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitCreateRaffle = async (): Promise<boolean> => {
    if (!title.trim()) {
      setError('El título de la rifa es obligatorio.');
      return false;
    }
    
    if (!ticketCount.trim()) {
      setError('La cantidad de números es obligatoria.');
      return false;
    }
    const count = parseInt(ticketCount, 10);
    if (isNaN(count) || ![30, 50, 100, 1000].includes(count)) {
      setError('La cantidad de números debe ser exactamente 30, 50, 100 o 1000.');
      return false;
    }

    if (!ticketPrice.trim()) {
      setError('El precio por boleto es obligatorio.');
      return false;
    }
    const price = parseFloat(ticketPrice);
    if (isNaN(price) || price < 0) {
      setError('El precio unitario debe ser un número válido mayor o igual a 0.');
      return false;
    }

    if (!drawDate) {
      setError('La fecha del sorteo es obligatoria.');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await raffleService.createRaffle({
        title: title.trim(),
        product: product.trim() || undefined,
        description: description.trim() || undefined,
        ticket_count: count,
        ticket_price: price,
        draw_date: drawDate,
      });

      router.back();
      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al guardar la rifa en la base de datos.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    title,
    setTitle,
    product,
    setProduct,
    description,
    setDescription,
    ticketCount,
    setTicketCount,
    ticketPrice,
    setTicketPrice,
    drawDate,
    setDrawDate,
    loading,
    error,
    setError,
    submitCreateRaffle,
  };
}
