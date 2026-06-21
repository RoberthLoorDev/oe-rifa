import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import DrawRoulette from '../../../components/draw/DrawRoulette';
import OverwriteConfirmModal from '../../../components/draw/OverwriteConfirmModal';
import ManualWinnerModal from '../../../components/draw/ManualWinnerModal';
import WinnerShareModal from '../../../components/draw/WinnerShareModal';
import { Ticket } from '../../../components/raffle/types';
import { useRaffleDetail } from '../../../hooks/useRaffleDetail';
import { useRaffleTickets } from '../../../hooks/useRaffleTickets';
import { raffleService } from '../../../services/raffleService';

export default function DrawScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const raffleId = Array.isArray(id) ? id[0] : id || '';

  const { raffle, loading: loadingDetail, error: errorDetail } = useRaffleDetail(raffleId);
  const { tickets, loading: loadingTickets, error: errorTickets } = useRaffleTickets(raffleId);

  const loading = loadingDetail || loadingTickets;
  const error = errorDetail || errorTickets;

  const [includeReserved, setIncludeReserved] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [winner, setWinner] = useState<Ticket | null>(null);
  const [currentNumber, setCurrentNumber] = useState<string | number>('?');

  const [showManualModal, setShowManualModal] = useState(false);
  const [showMobileShareModal, setShowMobileShareModal] = useState(false);

  // Warning Confirmation States
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const [pendingDrawAction, setPendingDrawAction] = useState<'AUTO' | 'MANUAL' | null>(null);

  useEffect(() => {
    if (raffle && raffle.winnerTicketNum !== null && raffle.winnerTicketNum !== undefined && !winner && !drawing) {
      const existingWinner = tickets.find((t) => t.num === raffle.winnerTicketNum);
      if (existingWinner) {
        setWinner(existingWinner);
        setCurrentNumber(raffle.winnerTicketNum);
      } else if (raffle.winnerName) {
        setWinner({
          num: raffle.winnerTicketNum,
          status: 'PAGADO',
          participant: raffle.winnerName,
          phone: '',
        });
        setCurrentNumber(raffle.winnerTicketNum);
      }
    }
  }, [raffle, tickets]);

  const eligibleTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (includeReserved) {
        return t.status === 'PAGADO' || t.status === 'RESERVADO';
      }
      return t.status === 'PAGADO';
    });
  }, [tickets, includeReserved]);

  const handleStartDrawPress = () => {
    if (winner) {
      setPendingDrawAction('AUTO');
      setShowOverwriteConfirm(true);
    } else {
      executeStartDraw();
    }
  };

  const handleManualDrawPress = () => {
    if (winner) {
      setPendingDrawAction('MANUAL');
      setShowOverwriteConfirm(true);
    } else {
      setShowManualModal(true);
    }
  };

  const persistWinner = async (ticket: Ticket) => {
    try {
      await raffleService.setRaffleWinner(raffleId, ticket.num, ticket.participant);
    } catch (err) {
      console.error('Error al guardar ganador:', err);
    }
  };

  const executeStartDraw = () => {
    if (drawing || eligibleTickets.length === 0) return;

    // Select winner at the beginning to feed the scroll roulette
    const finalWinner = eligibleTickets[Math.floor(Math.random() * eligibleTickets.length)];
    setWinner(finalWinner);
    setCurrentNumber(finalWinner.num);
    setDrawing(true);
  };

  const handleAnimationComplete = () => {
    setDrawing(false);
    if (winner) {
      persistWinner(winner);
    }
  };

  const handleSelectManualWinner = (ticket: Ticket) => {
    setWinner(ticket);
    setCurrentNumber(ticket.num);
    setShowManualModal(false);
    persistWinner(ticket);
  };

  const handleExportImage = () => {
    if (!winner || !raffle) return;

    if (Platform.OS === 'web') {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Premium gradient light background
      const grad = ctx.createLinearGradient(0, 0, 1200, 1200);
      grad.addColorStop(0, '#F8FAFC');
      grad.addColorStop(1, '#EFF6FF');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 1200);

      // Decorative glowing circles
      ctx.fillStyle = 'rgba(59, 111, 255, 0.04)';
      ctx.beginPath();
      ctx.arc(150, 150, 450, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(139, 92, 246, 0.03)';
      ctx.beginPath();
      ctx.arc(1050, 1050, 500, 0, Math.PI * 2);
      ctx.fill();

      // Outer border frame (Clean light border)
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.04)';
      ctx.lineWidth = 20;
      ctx.strokeRect(40, 40, 1120, 1120);

      // Accent inner frame
      ctx.strokeStyle = '#3B6FFF';
      ctx.lineWidth = 4;
      ctx.strokeRect(60, 60, 1080, 1080);

      // Celebration Emojis scattered around the Canvas
      ctx.font = '64px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🏆', 600, 430); // Trophy above the winner ring
      ctx.fillText('🎉', 250, 600); // Left side
      ctx.fillText('✨', 950, 620); // Right side
      ctx.fillText('🥳', 220, 900); // Bottom-left side
      ctx.fillText('✨', 980, 920); // Bottom-right side

      // Brand Title
      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('OeRifa • RESULTADO OFICIAL DEL SORTEO', 600, 160);

      // Raffle Title
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 64px Arial';
      ctx.fillText(raffle.title, 600, 260);

      // Product/Prize Banner
      if (raffle.product) {
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 36px Arial';
        ctx.fillText(`Premio: ${raffle.product}`, 600, 330);
      }

      // Drawing Winner Medallion (Clean white inner, blue border)
      ctx.strokeStyle = '#3B6FFF';
      ctx.lineWidth = 10;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(600, 600, 175, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 150px Arial';
      ctx.textBaseline = 'middle';
      ctx.fillText(winner.num < 10 ? `0${winner.num}` : `${winner.num}`, 600, 600);
      ctx.textBaseline = 'alphabetic';

      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 26px Arial';
      ctx.fillText('BOLETO GANADOR', 600, 840);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 68px Arial';
      ctx.fillText(winner.participant, 600, 940);

      ctx.fillStyle = '#3B6FFF';
      ctx.font = 'bold 32px Arial';
      ctx.fillText('¡Muchas Felicidades! 🎉', 600, 1010);

      const dateStr = new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.font = 'italic 22px Arial';
      ctx.fillText(`Sorteo certificado el ${dateStr}`, 600, 1080);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Ganador_${raffle.title.replace(/\s+/g, '_')}_Boleto_${winner.num}.png`;
      link.href = dataUrl;
      link.click();
    } else {
      setShowMobileShareModal(true);
    }
  };



  const goBack = () => {
    router.back();
  };

  /* ── Estado: cargando ── */
  if (loading || !raffle) {
    return (
      <View className="flex-1 bg-app-bg items-center justify-center">
        <ActivityIndicator size="large" color="#3B6FFF" />
      </View>
    );
  }

  /* ── Estado: error ── */
  if (error) {
    return (
      <View className="flex-1 bg-app-bg items-center justify-center p-6">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="text-lg font-bold text-app-dark mt-4 text-center">{error}</Text>
        <Pressable onPress={goBack} className="mt-6 bg-app-dark px-6 py-3 rounded-2xl active:scale-95 transition-all">
          <Text className="text-white font-bold">Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-app-bg">
      {/* ── Header ── */}
      <View className="bg-white px-4 pt-12 pb-4 flex-row items-center border-b border-gray-100 shadow-sm">
        <Pressable
          onPress={goBack}
          className="p-2 -ml-2 rounded-full active:bg-gray-100 transition"
          style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text className="text-xl font-bold text-app-dark mx-auto pr-8">Gran Sorteo</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Badge de participantes ── */}
        <View className="bg-white px-5 py-2.5 rounded-full mb-8 border border-gray-200/50 shadow-sm">
          <Text className="text-sm font-bold text-app-gray">
            Participan <Text className="text-app-accent font-black">{eligibleTickets.length}</Text> números{' '}
            {includeReserved ? 'pagados y reservados' : 'pagados'}
          </Text>
        </View>

        {/* ── Contexto del premio ── */}
        {raffle.product && (
          <View className="mb-4 flex-row items-center gap-x-1.5 bg-app-greenLight px-3.5 py-1.5 rounded-2xl border border-app-greenBorder">
            <Ionicons name="gift" size={14} color="#059669" />
            <Text className="text-sm font-bold text-app-green">Premio: {raffle.product}</Text>
          </View>
        )}

        {/* ── Ruleta del sorteo ── */}
        <DrawRoulette
          eligibleNumbers={eligibleTickets.map((t) => t.num)}
          targetNumber={winner?.num}
          targetName={winner?.participant}
          animating={drawing}
          onAnimationComplete={handleAnimationComplete}
        />

        {/* ── Toggle incluir reservados ── */}
        <View className="flex-row items-center justify-between bg-white border border-gray-100 px-5 py-4 rounded-3xl w-full max-w-sm mb-8 shadow-sm">
          <View className="flex-1 pr-4">
            <Text className="text-base font-bold text-app-dark">Incluir boletos reservados</Text>
            <Text className="text-xs text-app-gray mt-0.5">Sortea también boletos apartados que no han sido liquidados.</Text>
          </View>
          <Switch
            value={includeReserved}
            disabled={drawing}
            onValueChange={setIncludeReserved}
            trackColor={{ false: '#E5E7EB', true: '#3B6FFF' }}
            thumbColor={includeReserved ? '#ffffff' : '#F3F4F6'}
          />
        </View>

        {/* ── Controles ── */}
        <View className="w-full max-w-sm gap-y-3.5">
          <Pressable
            onPress={handleStartDrawPress}
            disabled={drawing || eligibleTickets.length === 0}
            className={`w-full py-4 rounded-2xl items-center justify-center flex-row gap-x-2 active:scale-[0.98] transition-all shadow-md ${
              eligibleTickets.length === 0 ? 'bg-gray-200' : 'bg-app-accent active:bg-blue-700'
            }`}
            style={
              Platform.OS === 'web' ? ({ cursor: eligibleTickets.length === 0 ? 'not-allowed' : 'pointer' } as any) : undefined
            }
          >
            <Text className={`text-lg font-black ${eligibleTickets.length === 0 ? 'text-gray-400' : 'text-white'}`}>
              🎲 {drawing ? 'Realizando Sorteo...' : 'Realizar Sorteo'}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleManualDrawPress}
            disabled={drawing}
            className="w-full bg-white border border-gray-200 py-3.5 rounded-2xl items-center justify-center flex-row gap-x-2 active:bg-gray-50 transition-all shadow-sm"
            style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
          >
            <Text className="text-base font-extrabold text-app-dark">✍️ Asignar ganador manual</Text>
          </Pressable>

          {/* Exportar imagen cuando hay ganador */}
          {winner && (
            <Pressable
              onPress={handleExportImage}
              className="w-full bg-app-greenLight border border-app-greenBorder py-3.5 rounded-2xl items-center justify-center flex-row gap-x-2 active:opacity-90 transition-all shadow-md shadow-app-green/10"
              style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
            >
              <Ionicons name="download" size={18} color="#059669" />
              <Text className="text-base font-extrabold text-app-green">Exportar Imagen Oficial</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* ── Modal: confirmar sobrescribir ganador ── */}
      <OverwriteConfirmModal
        visible={showOverwriteConfirm}
        winner={winner}
        onClose={() => setShowOverwriteConfirm(false)}
        onConfirm={() => {
          setShowOverwriteConfirm(false);
          if (pendingDrawAction === 'AUTO') {
            executeStartDraw();
          } else if (pendingDrawAction === 'MANUAL') {
            setShowManualModal(true);
          }
          setPendingDrawAction(null);
        }}
      />

      {/* ── Modal: selección manual de ganador ── */}
      <ManualWinnerModal
        visible={showManualModal}
        eligibleTickets={eligibleTickets}
        onClose={() => setShowManualModal(false)}
        onSelect={handleSelectManualWinner}
      />

      {/* ── Modal: captura de pantalla / compartir ganador ── */}
      <WinnerShareModal
        visible={showMobileShareModal}
        raffleTitle={raffle.title}
        raffleProduct={raffle.product}
        winnerNumber={winner?.num ?? null}
        winnerName={winner?.participant ?? null}
        onClose={() => setShowMobileShareModal(false)}
      />
    </View>
  );
}
