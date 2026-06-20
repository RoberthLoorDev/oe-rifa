import React, { useCallback, useMemo, useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, Text, View, ActivityIndicator, Animated } from 'react-native';

import FilterChips from '@/components/raffle/FilterChips';
import NumbersGrid from '@/components/raffle/NumbersGrid';
import ReleaseConfirmModal from '@/components/raffle/ReleaseConfirmModal';
import TicketActionModal from '@/components/raffle/TicketActionModal';
import { Ticket } from '@/components/raffle/types';
import { useRaffleTickets } from '../../../hooks/useRaffleTickets';

export default function NumbersGridScreen() {
  const { id, filter } = useLocalSearchParams();
  const router = useRouter();
  const raffleId = Array.isArray(id) ? id[0] : id;
  const filterQuery = Array.isArray(filter) ? filter[0] : filter;

  const {
    tickets,
    raffleTitle,
    product,
    loading,
    error,
    assignTicket,
    assignTicketsBulk,
    releaseTicket
  } = useRaffleTickets(raffleId || '');

  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'DISPONIBLE' | 'RESERVADO' | 'PAGADO'>(
    (filterQuery as 'ALL' | 'DISPONIBLE' | 'RESERVADO' | 'PAGADO') || 'ALL'
  );

  React.useEffect(() => {
    if (filterQuery) {
      setSelectedFilter(filterQuery as 'ALL' | 'DISPONIBLE' | 'RESERVADO' | 'PAGADO');
    }
  }, [filterQuery]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showReleaseConfirm, setShowReleaseConfirm] = useState(false);
  const [selectedNums, setSelectedNums] = useState<number[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastVisible, setToastVisible] = useState(false);
  const toastY = useRef(new Animated.Value(-100)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    
    Animated.parallel([
      Animated.timing(toastY, {
        toValue: 20,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start();

    const timer = setTimeout(() => {
      hideToast();
    }, 3000);

    return () => clearTimeout(timer);
  };

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(toastY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setToastVisible(false);
      setToastMessage(null);
    });
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/raffle/${raffleId}`);
    }
  };

  const filteredTickets = useMemo(() => {
    if (selectedFilter === 'ALL') return tickets;
    return tickets.filter((t) => t.status === selectedFilter);
  }, [tickets, selectedFilter]);

  const handlePressTicket = useCallback((ticket: Ticket) => {
    if (ticket.status === 'DISPONIBLE') {
      setSelectedNums((prev) =>
        prev.includes(ticket.num)
          ? prev.filter((n) => n !== ticket.num)
          : [...prev, ticket.num]
      );
    } else {
      setSelectedTicket(ticket);
    }
  }, []);

  const handleSaveTicket = async (isPaid: boolean, participantName: string, participantPhone: string) => {
    if (selectedTicket) {
      try {
        await assignTicket(selectedTicket.num, participantName, participantPhone, isPaid);
        showToast(
          `Boleto #${selectedTicket.num < 10 ? '0' + selectedTicket.num : selectedTicket.num} registrado como ${
            isPaid ? 'pagado' : 'reservado'
          }`, 
          'success'
        );
      } catch (err) {
        showToast('Ha ocurrido un error al registrar el boleto', 'error');
      }
      setSelectedTicket(null);
    } else if (selectedNums.length > 0) {
      try {
        await assignTicketsBulk(selectedNums, participantName, participantPhone, isPaid);
        const count = selectedNums.length;
        showToast(
          `${count} ${count === 1 ? 'boleto registrado' : 'boletos registrados'} como ${
            isPaid ? 'pagado' : 'reservado'
          }`, 
          'success'
        );
        setSelectedNums([]);
      } catch (err) {
        showToast('Ha ocurrido un error al registrar los boletos', 'error');
      }
      setShowBulkModal(false);
    }
  };

  const handleConfirmRelease = async () => {
    if (!selectedTicket) return;
    try {
      await releaseTicket(selectedTicket.num);
      showToast(
        `Boleto #${selectedTicket.num < 10 ? '0' + selectedTicket.num : selectedTicket.num} liberado con éxito`, 
        'success'
      );
    } catch (err) {
      showToast('Ha ocurrido un error al liberar el boleto', 'error');
    }
    setShowReleaseConfirm(false);
    setSelectedTicket(null);
  };

  if (loading && tickets.length === 0) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3B6FFF" />
      </View>
    );
  }

  if (error && tickets.length === 0) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-6">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="text-lg font-bold text-app-dark mt-4 text-center">
          {error}
        </Text>
        <Pressable 
          onPress={goBack}
          className="mt-6 bg-app-dark px-6 py-3 rounded-2xl active:scale-95 transition-all"
        >
          <Text className="text-white font-bold">Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white relative">
      {toastVisible && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 50,
            left: 20,
            right: 20,
            zIndex: 9999,
            elevation: 9999,
            transform: [{ translateY: toastY }],
            opacity: toastOpacity,
          }}
          pointerEvents="none"
        >
          <View className="bg-white px-4 py-3 rounded-full flex-row items-center gap-x-3 shadow-lg border border-gray-100/50">
            <Ionicons 
              name={toastType === 'success' ? 'checkmark-circle' : 'alert-circle'} 
              size={22} 
              color={toastType === 'success' ? '#22C55E' : '#EF4444'} 
            />
            <Text className="text-gray-700 font-bold text-sm flex-1 pr-2">
              {toastMessage}
            </Text>
          </View>
        </Animated.View>
      )}

      <View className="bg-white px-4 pt-12 pb-3 border-b border-gray-100 shadow-sm">
        <View className="flex-row items-center mb-3">
          <Pressable
            onPress={goBack}
            className="p-2 -ml-2 rounded-full active:bg-gray-100 transition"
            style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </Pressable>
          <View className="flex-1 items-center pr-8">
            <Text className="text-xl font-bold text-app-dark">Números ({tickets.length})</Text>
            <Text className="text-xs text-app-gray font-bold mt-0.5" numberOfLines={1}>
              {raffleTitle} {product ? `— ${product}` : ''}
            </Text>
          </View>
        </View>

        <FilterChips selectedFilter={selectedFilter} onSelectFilter={setSelectedFilter} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <NumbersGrid 
          tickets={filteredTickets} 
          onPressTicket={handlePressTicket} 
          selectedNums={selectedNums}
        />
      </ScrollView>

      {selectedNums.length > 0 && (
        <View className="absolute bottom-6 right-6 z-40">
          <Pressable
            onPress={() => setShowBulkModal(true)}
            className="flex-row items-center bg-app-accent px-5 py-4 rounded-full shadow-lg shadow-app-accent/25 active:scale-95 transition-all gap-x-2"
            style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
            <Text className="text-white font-extrabold text-sm uppercase tracking-wider">
              Asignar ({selectedNums.length})
            </Text>
          </Pressable>
        </View>
      )}

      <TicketActionModal
        visible={selectedTicket !== null || showBulkModal}
        ticket={selectedTicket}
        selectedNums={selectedNums}
        onClose={() => {
          setSelectedTicket(null);
          setShowBulkModal(false);
        }}
        onSave={handleSaveTicket}
        onReleasePress={() => setShowReleaseConfirm(true)}
      />

      <ReleaseConfirmModal
        visible={showReleaseConfirm}
        ticket={selectedTicket}
        onClose={() => setShowReleaseConfirm(false)}
        onConfirm={handleConfirmRelease}
      />
    </View>
  );
}
