import React, { useState, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, Text, View, Switch, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Ticket {
  num: number;
  name: string;
  status: 'PAGADO' | 'RESERVADO' | 'DISPONIBLE';
}

// Helper to generate dynamic tickets based on active raffle
const getTicketsList = (raffleId: string): Ticket[] => {
  const total = raffleId === '2' ? 100 : raffleId === '3' ? 30 : 50;
  const list: Ticket[] = [];

  for (let i = 1; i <= total; i++) {
    let status: 'DISPONIBLE' | 'RESERVADO' | 'PAGADO' = 'DISPONIBLE';
    let participant = '';

    if (raffleId === '2') {
      if (i % 10 === 0) {
        status = 'RESERVADO';
        participant = 'María Gómez';
      } else {
        status = 'PAGADO';
        participant = 'Juan Pérez';
      }
    } else if (raffleId === '3') {
      if (i === 7 || i === 14 || i === 21) {
        status = 'RESERVADO';
        participant = 'María Gómez';
      } else if (i === 5 || i === 10 || i === 15 || i === 20 || i === 25) {
        status = 'PAGADO';
        participant = 'Juan Pérez';
      }
    } else {
      // Default (ID 1, total 50)
      const paidIndices = [3, 6, 9, 12, 18, 21, 24, 27, 33, 36, 39, 42, 48, 1, 2];
      const reservedIndices = [5, 10, 20, 25, 35, 40, 50, 15];

      if (paidIndices.includes(i)) {
        status = 'PAGADO';
        participant = 'Juan Pérez';
      } else if (reservedIndices.includes(i)) {
        status = 'RESERVADO';
        participant = 'María Gómez';
      }
    }

    if (status !== 'DISPONIBLE') {
      list.push({ num: i, name: participant, status });
    }
  }

  return list;
};

export default function DrawScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Active raffle metadata
  const raffleTitle = id === '2' ? 'iPhone 15 Pro' : 'Rifa Pro-Fondos Viaje';
  const displayTitle = id === '1' ? 'Rifa Solidaria Pro' : raffleTitle;
  const product = id === '1' ? 'iPhone 15 Pro' : id === '2' ? 'iPhone 15 Pro' : 'Viaje a Galápagos';

  const [includeReserved, setIncludeReserved] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [winner, setWinner] = useState<Ticket | null>(null);
  const [currentNumber, setCurrentNumber] = useState<string | number>('?');
  
  const [showManualModal, setShowManualModal] = useState(false);
  const [showMobileShareModal, setShowMobileShareModal] = useState(false);

  // Warning Confirmation States
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const [pendingDrawAction, setPendingDrawAction] = useState<'AUTO' | 'MANUAL' | null>(null);

  // Tickets lists
  const ticketsList = useMemo(() => getTicketsList(id as string), [id]);

  const eligibleTickets = useMemo(() => {
    return ticketsList.filter((t) => {
      if (includeReserved) {
        return t.status === 'PAGADO' || t.status === 'RESERVADO';
      }
      return t.status === 'PAGADO';
    });
  }, [ticketsList, includeReserved]);

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

  const executeStartDraw = () => {
    if (drawing || eligibleTickets.length === 0) return;
    setDrawing(true);
    setWinner(null);

    const duration = 2800; // 2.8 seconds
    const startTime = Date.now();

    const tick = (delay: number) => {
      const elapsed = Date.now() - startTime;
      const tempIndex = Math.floor(Math.random() * eligibleTickets.length);
      setCurrentNumber(eligibleTickets[tempIndex].num);

      if (elapsed < duration) {
        // Exponential deceleration curve
        const progress = elapsed / duration;
        const nextDelay = 40 + Math.pow(progress, 2.5) * 450; 
        setTimeout(() => tick(nextDelay), nextDelay);
      } else {
        // Conclude draw and set final winner
        const finalWinner = eligibleTickets[Math.floor(Math.random() * eligibleTickets.length)];
        setWinner(finalWinner);
        setCurrentNumber(finalWinner.num);
        setDrawing(false);
      }
    };

    tick(40);
  };

  const handleExportImage = () => {
    if (!winner) return;

    if (Platform.OS === 'web') {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Premium gradient background
      const grad = ctx.createLinearGradient(0, 0, 1200, 1200);
      grad.addColorStop(0, '#111827'); 
      grad.addColorStop(1, '#1F1A3A'); 
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 1200);

      // Decorative glowing circles
      ctx.fillStyle = 'rgba(59, 111, 255, 0.08)';
      ctx.beginPath();
      ctx.arc(150, 150, 450, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(139, 92, 246, 0.05)';
      ctx.beginPath();
      ctx.arc(1050, 1050, 500, 0, Math.PI * 2);
      ctx.fill();

      // Outer border frame
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 20;
      ctx.strokeRect(40, 40, 1120, 1120);

      // Accent inner frame
      ctx.strokeStyle = '#3B6FFF';
      ctx.lineWidth = 4;
      ctx.strokeRect(60, 60, 1080, 1080);

      // Brand Title
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('RifaApp • RESULTADO OFICIAL DEL SORTEO', 600, 160);

      // Raffle Title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 64px Arial';
      ctx.fillText(displayTitle, 600, 260);

      // Product/Prize Banner
      if (product) {
        ctx.fillStyle = '#DCFCE7';
        ctx.font = 'bold 36px Arial';
        ctx.fillText(`Premio: ${product}`, 600, 330);
      }

      // Drawing Winner Medallion
      // Gradient ring glow
      const ringGrad = ctx.createLinearGradient(400, 420, 800, 820);
      ringGrad.addColorStop(0, '#3B6FFF');
      ringGrad.addColorStop(1, '#8B5CF6');
      ctx.fillStyle = ringGrad;
      ctx.beginPath();
      ctx.arc(600, 600, 190, 0, Math.PI * 2);
      ctx.fill();

      // Inner medallion background
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.arc(600, 600, 175, 0, Math.PI * 2);
      ctx.fill();

      // Winner number (centered)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 150px Arial';
      ctx.textBaseline = 'middle';
      ctx.fillText(winner.num < 10 ? `0${winner.num}` : `${winner.num}`, 600, 600);
      ctx.textBaseline = 'alphabetic';

      // Label "Número Ganador"
      ctx.fillStyle = '#A7F3D0';
      ctx.font = 'bold 26px Arial';
      ctx.fillText('BOLETO GANADOR', 600, 840);

      // Winner Name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 68px Arial';
      ctx.fillText(winner.name, 600, 940);

      // Subtitle
      ctx.fillStyle = '#3B6FFF';
      ctx.font = 'bold 32px Arial';
      ctx.fillText('¡Muchas Felicidades!', 600, 1010);

      // Date Stamp
      const dateStr = new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.font = 'italic 22px Arial';
      ctx.fillText(`Sorteo certificado el ${dateStr}`, 600, 1080);

      // Trigger Browser Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Ganador_${displayTitle.replace(/\s+/g, '_')}_Boleto_${winner.num}.png`;
      link.href = dataUrl;
      link.click();
    } else {
      setShowMobileShareModal(true);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-[#111827]">
      {/* Header */}
      <View className="px-4 pt-12 pb-4 flex-row items-center border-b border-white/10 bg-transparent">
        <Pressable 
          onPress={goBack} 
          className="p-2 -ml-2 rounded-full active:bg-white/10 transition"
          style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </Pressable>
        <Text className="text-xl font-bold text-white mx-auto pr-8">Gran Sorteo</Text>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Participants count badge */}
        <View className="bg-white/15 px-5 py-2.5 rounded-full mb-8 border border-white/10 shadow-sm">
          <Text className="text-sm font-bold text-blue-200">
            Participan <Text className="text-white font-black">{eligibleTickets.length}</Text> números {includeReserved ? 'pagados y reservados' : 'pagados'}
          </Text>
        </View>

        {/* Product context label */}
        {product && (
          <View className="mb-4 flex-row items-center gap-x-1.5 bg-app-accent/20 px-3.5 py-1.5 rounded-2xl border border-app-accent/30">
            <Ionicons name="gift" size={14} color="#A7F3D0" />
            <Text className="text-sm font-bold text-white">Premio: {product}</Text>
          </View>
        )}

        {/* Roulette Main Circle */}
        <View className="relative mb-10 items-center justify-center">
          {/* Main Ring outer container */}
          <View className="w-52 h-52 rounded-full bg-gradient-to-tr from-app-accent to-purple-600 p-1.5 shadow-2xl shadow-app-accent/40 items-center justify-center">
            <View className="w-full h-full bg-[#111827] rounded-full flex-col items-center justify-center relative overflow-hidden">
              <Text className="text-7xl font-black text-white tracking-tighter">
                {typeof currentNumber === 'number' && currentNumber < 10 ? `0${currentNumber}` : currentNumber}
              </Text>
              {winner && (
                <Text className="text-xs font-extrabold text-app-accent mt-2 text-center px-4 uppercase tracking-wider" numberOfLines={1}>
                  {winner.name}
                </Text>
              )}
            </View>
          </View>

          {/* Decorative glowing dots */}
          <View className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full opacity-40 blur-sm" />
          <View className="absolute -bottom-3 -left-3 w-6 h-6 bg-blue-400 rounded-full opacity-40 blur-sm" />
        </View>

        {/* Custom Toggle Switch for Reserved Tickets */}
        <View className="flex-row items-center justify-between bg-white/5 border border-white/10 px-5 py-4 rounded-3xl w-full max-w-sm mb-8">
          <View className="flex-1 pr-4">
            <Text className="text-base font-bold text-white">Incluir boletos reservados</Text>
            <Text className="text-xs text-white/60 mt-0.5">
              Sortea también boletos apartados que no han sido liquidados.
            </Text>
          </View>
          <Switch
            value={includeReserved}
            disabled={drawing}
            onValueChange={setIncludeReserved}
            trackColor={{ false: '#374151', true: '#3B6FFF' }}
            thumbColor={includeReserved ? '#ffffff' : '#9CA3AF'}
          />
        </View>

        {/* Controls */}
        <View className="w-full max-w-sm gap-y-3.5">
          <Pressable 
            onPress={handleStartDrawPress}
            disabled={drawing || eligibleTickets.length === 0}
            className={`w-full py-4 rounded-2xl items-center justify-center flex-row gap-x-2 active:scale-[0.98] transition-all shadow-xl ${
              eligibleTickets.length === 0 ? 'bg-white/10' : 'bg-white active:bg-gray-100'
            }`}
            style={Platform.OS === 'web' ? { cursor: eligibleTickets.length === 0 ? 'not-allowed' : 'pointer' } as any : undefined}
          >
            <Text className={`text-lg font-black ${
              eligibleTickets.length === 0 ? 'text-white/20' : 'text-[#111827]'
            }`}>
              🎲 {drawing ? 'Realizando Sorteo...' : 'Realizar Sorteo'}
            </Text>
          </Pressable>

          <Pressable 
            onPress={handleManualDrawPress}
            disabled={drawing}
            className="w-full bg-transparent border border-white/30 py-3.5 rounded-2xl items-center justify-center flex-row gap-x-2 active:bg-white/10 transition-all"
            style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
          >
            <Text className="text-base font-extrabold text-white">
              ✍️ Asignar ganador manual
            </Text>
          </Pressable>

          {/* Export button visible once winner exists */}
          {winner && (
            <Pressable 
              onPress={handleExportImage}
              className="w-full bg-app-greenLight border border-app-greenBorder py-3.5 rounded-2xl items-center justify-center flex-row gap-x-2 active:opacity-90 transition-all shadow-lg shadow-app-green/10"
              style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
            >
              <Ionicons name="download" size={18} color="#059669" />
              <Text className="text-base font-extrabold text-app-green">
                Exportar Imagen Oficial
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* Overwrite Winner Warning Modal */}
      <Modal
        visible={showOverwriteConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOverwriteConfirm(false)}
      >
        <View className="flex-1 bg-black/85 items-center justify-center p-6">
          <View className="bg-[#1F2937] border border-red-500/30 rounded-3xl p-6 w-full max-w-sm items-center shadow-2xl">
            <View className="w-16 h-16 bg-red-500/10 rounded-full items-center justify-center mb-4 border border-red-500/20">
              <Ionicons name="warning" size={32} color="#EF4444" />
            </View>
 
            <Text className="text-xl font-black text-white text-center mb-2">¿Realizar nuevo sorteo?</Text>
            <Text className="text-sm text-white/70 text-center mb-6">
              Ya se ha seleccionado a un ganador ({winner ? (winner.num < 10 ? `0${winner.num}` : winner.num) : ''} - {winner?.name}). Si continúas, se descartará este resultado para iniciar un nuevo sorteo.
            </Text>

            <View className="flex-row gap-x-3 w-full">
              <Pressable
                onPress={() => setShowOverwriteConfirm(false)}
                className="flex-1 bg-white/10 py-3 rounded-xl items-center justify-center active:bg-white/15"
              >
                <Text className="text-sm font-bold text-white">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowOverwriteConfirm(false);
                  if (pendingDrawAction === 'AUTO') {
                    executeStartDraw();
                  } else if (pendingDrawAction === 'MANUAL') {
                    setShowManualModal(true);
                  }
                  setPendingDrawAction(null);
                }}
                className="flex-1 bg-red-600 py-3 rounded-xl items-center justify-center active:bg-red-700"
              >
                <Text className="text-sm font-black text-white">Continuar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Manual Winner Selector Modal */}
      <Modal
        visible={showManualModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowManualModal(false)}
      >
        <View className="flex-1 bg-black/85 items-center justify-center p-6">
          <View className="bg-[#1F2937] border border-white/10 rounded-3xl p-6 w-full max-w-sm h-[80%] max-h-[500px]">
            <View className="flex-row justify-between items-center mb-4 pb-2 border-b border-white/10">
              <Text className="text-lg font-black text-white">Asignar Ganador Manual</Text>
              <Pressable
                onPress={() => setShowManualModal(false)}
                className="p-1.5 bg-white/10 rounded-full active:bg-white/20"
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            <Text className="text-sm text-white/80 mb-4">
              Selecciona un participante de la lista de boletos elegibles para asignarlo directamente como ganador del sorteo:
            </Text>

            {eligibleTickets.length === 0 ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-sm font-bold text-white/40 text-center">
                  No hay boletos elegibles disponibles para el sorteo.
                </Text>
              </View>
            ) : (
              <ScrollView className="flex-1 pr-1" showsVerticalScrollIndicator={true}>
                <View className="gap-y-2">
                  {eligibleTickets.map((t) => (
                    <Pressable
                      key={t.num}
                      onPress={() => {
                        setWinner(t);
                        setCurrentNumber(t.num);
                        setShowManualModal(false);
                      }}
                      className="flex-row items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl active:bg-white/10"
                    >
                      <View className="flex-row items-center gap-3">
                        <View className="w-8 h-8 rounded bg-white/10 items-center justify-center border border-white/10">
                          <Text className="text-white font-black text-sm">{t.num < 10 ? `0${t.num}` : t.num}</Text>
                        </View>
                        <Text className="text-base font-bold text-white">{t.name}</Text>
                      </View>
                      <Text className="text-xs font-black uppercase text-app-accent">Seleccionar</Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Mobile Screenshot Helper Modal */}
      <Modal
        visible={showMobileShareModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMobileShareModal(false)}
      >
        <View className="flex-1 bg-black/85 items-center justify-center p-6">
          <View className="bg-[#111827] border-2 border-app-accent rounded-3xl p-6 w-full max-w-sm items-center shadow-2xl relative">
            <Pressable
              onPress={() => setShowMobileShareModal(false)}
              className="absolute top-4 right-4 p-1.5 bg-white/10 rounded-full active:bg-white/20"
            >
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </Pressable>

            <Text className="text-xs font-bold text-white/50 tracking-widest uppercase mb-1">Resultado Oficial</Text>
            <Text className="text-2xl font-black text-white text-center" numberOfLines={1}>{displayTitle}</Text>
            {product && (
              <Text className="text-base text-app-greenLight font-extrabold mt-0.5 mb-6 text-center">Premio: {product}</Text>
            )}

            {/* Glowing Winner Ring */}
            <View className="w-44 h-44 rounded-full bg-gradient-to-tr from-app-accent to-purple-600 p-1.5 mb-2 shadow-xl shadow-app-accent/25 items-center justify-center">
              <View className="w-full h-full bg-[#111827] rounded-full items-center justify-center">
                <Text className="text-7xl font-black text-white">
                  {winner ? (winner.num < 10 ? `0${winner.num}` : winner.num) : ''}
                </Text>
              </View>
            </View>
            
            {/* Label Outside the Circle */}
            <Text className="text-xs font-extrabold text-app-accent tracking-widest uppercase mb-6">Número Ganador</Text>

            <Text className="text-2xl font-black text-white text-center mt-2">{winner?.name}</Text>
            <Text className="text-sm font-extrabold text-app-accent mt-1 mb-8">¡Muchos Éxitos!</Text>

            <View className="bg-white/5 border border-white/10 p-4 rounded-2xl w-full flex-row items-center gap-x-3">
              <Ionicons name="phone-portrait-outline" size={24} color="#3B6FFF" />
              <View className="flex-1">
                <Text className="text-sm font-bold text-white">¡Toma una captura de pantalla!</Text>
                <Text className="text-xs text-white/60 mt-0.5">Esta tarjeta está lista para capturar y compartir en tus estados de WhatsApp.</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
