import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';

import FilterChips from '@/components/raffle/FilterChips';
import NumbersGrid from '@/components/raffle/NumbersGrid';
import ReleaseConfirmModal from '@/components/raffle/ReleaseConfirmModal';
import TicketActionModal from '@/components/raffle/TicketActionModal';
import { Ticket } from '@/components/raffle/types';

// Deterministic mock data generation matching the raffle details summary
const getNumbersData = (raffleId: string) => {
  const total = raffleId === '2' ? 100 : raffleId === '3' ? 30 : 50;
  const list: Ticket[] = [];

  for (let i = 1; i <= total; i++) {
    let status: 'DISPONIBLE' | 'RESERVADO' | 'PAGADO' = 'DISPONIBLE';
    let participant = '';
    let phone = '';

    if (raffleId === '2') {
      if (i % 10 === 0) {
        status = 'RESERVADO';
        participant = 'María Gómez';
        phone = '+51 987 000 111';
      } else {
        status = 'PAGADO';
        participant = 'Juan Pérez';
        phone = '+51 987 654 321';
      }
    } else if (raffleId === '3') {
      if (i === 7 || i === 14 || i === 21) {
        status = 'RESERVADO';
        participant = 'María Gómez';
        phone = '+51 987 000 111';
      } else if (i === 5 || i === 10 || i === 15 || i === 20 || i === 25) {
        status = 'PAGADO';
        participant = 'Juan Pérez';
        phone = '+51 987 654 321';
      }
    } else {
      // Default (ID 1, total 50)
      const paidIndices = [3, 6, 9, 12, 18, 21, 24, 27, 33, 36, 39, 42, 48, 1, 2];
      const reservedIndices = [5, 10, 20, 25, 35, 40, 50, 15];

      if (paidIndices.includes(i)) {
        status = 'PAGADO';
        participant = 'Juan Pérez';
        phone = '+51 987 654 321';
      } else if (reservedIndices.includes(i)) {
        status = 'RESERVADO';
        participant = 'María Gómez';
        phone = '+51 987 000 111';
      }
    }

    list.push({ num: i, status, participant, phone });
  }

  return { total, list };
};

export default function NumbersGridScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [tickets, setTickets] = useState<Ticket[]>(() => getNumbersData(id as string).list);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'DISPONIBLE' | 'RESERVADO' | 'PAGADO'>('ALL');

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [showReleaseConfirm, setShowReleaseConfirm] = useState(false);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/raffle/${id}`);
    }
  };

  const filteredTickets = useMemo(() => {
    if (selectedFilter === 'ALL') return tickets;
    return tickets.filter((t) => t.status === selectedFilter);
  }, [tickets, selectedFilter]);

  const handlePressTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleSaveTicket = (isPaid: boolean, participantName: string, participantPhone: string) => {
    if (!selectedTicket) return;

    setTickets((prev) =>
      prev.map((t) => {
        if (t.num === selectedTicket.num) {
          return {
            ...t,
            status: isPaid ? 'PAGADO' : 'RESERVADO',
            participant: participantName,
            phone: participantPhone,
          };
        }
        return t;
      }),
    );

    setSelectedTicket(null);
  };

  const handleConfirmRelease = () => {
    if (!selectedTicket) return;

    setTickets((prev) =>
      prev.map((t) => {
        if (t.num === selectedTicket.num) {
          return {
            ...t,
            status: 'DISPONIBLE',
            participant: '',
            phone: '',
          };
        }
        return t;
      }),
    );

    setShowReleaseConfirm(false);
    setSelectedTicket(null);
  };

  return (
    <View className="flex-1 bg-white">
      {/* HEADER CONTAINER */}
      <View className="bg-white px-4 pt-12 pb-3 border-b border-gray-100 shadow-sm">
        <View className="flex-row items-center mb-4">
          <Pressable
            onPress={goBack}
            className="p-2 -ml-2 rounded-full active:bg-gray-100 transition"
            style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </Pressable>
          <Text className="text-xl font-bold text-app-dark mx-auto pr-8">Números ({tickets.length})</Text>
        </View>

        {/* Horizontal Scrollable Filter Chips Component */}
        <FilterChips selectedFilter={selectedFilter} onSelectFilter={setSelectedFilter} />
      </View>

      {/* NUMBERS GRID CONTAINER */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <NumbersGrid tickets={filteredTickets} onPressTicket={handlePressTicket} />
      </ScrollView>

      {/* TICKET DETAILS & ACTION FORM BOTTOM SHEET MODAL */}
      <TicketActionModal
        visible={selectedTicket !== null && !showReleaseConfirm}
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onSave={handleSaveTicket}
        onReleasePress={() => setShowReleaseConfirm(true)}
      />

      {/* ACCIDENTAL RELEASE WARNING CONFIRMATION MODAL */}
      <ReleaseConfirmModal
        visible={showReleaseConfirm}
        ticket={selectedTicket}
        onClose={() => setShowReleaseConfirm(false)}
        onConfirm={handleConfirmRelease}
      />
    </View>
  );
}
