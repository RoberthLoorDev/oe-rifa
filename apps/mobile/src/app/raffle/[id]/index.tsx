import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import FinishRaffleModal from '@/components/draw/FinishRaffleModal';
import DetailBanner from '@/components/raffle-detail/DetailBanner';
import ProgressCard from '@/components/raffle-detail/ProgressCard';
import RecentActivity from '@/components/raffle-detail/RecentActivity';
import StatsGrid from '@/components/raffle-detail/StatsGrid';
import { raffleService } from '@/services/raffleService';
import { useRaffleDetail } from '../../../hooks/useRaffleDetail';

export default function RaffleDashboardScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const raffleId = Array.isArray(id) ? id[0] : id;

  const { raffle, activities, loading, error, refresh } = useRaffleDetail(raffleId || '');
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleFinishRaffle = useCallback(async () => {
    if (!raffleId) return;
    setFinishing(true);
    try {
      await raffleService.closeRaffle(raffleId);
      setShowFinishModal(false);
      refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setFinishing(false);
    }
  }, [raffleId, refresh]);

  if (loading) {
    return (
      <View className="flex-1 bg-app-bg items-center justify-center">
        <ActivityIndicator size="large" color="#3B6FFF" />
      </View>
    );
  }

  if (error || !raffle) {
    return (
      <View className="flex-1 bg-app-bg items-center justify-center p-6">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="text-lg font-bold text-app-dark mt-4 text-center">
          {error || 'No se encontró la rifa especificada.'}
        </Text>
        <Pressable onPress={goBack} className="mt-6 bg-app-dark px-6 py-3 rounded-2xl active:scale-95 transition-all">
          <Text className="text-white font-bold">Volver al Inicio</Text>
        </Pressable>
      </View>
    );
  }

  const defaultImage = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&h=600&fit=crop';
  const hasWinner = raffle.winnerTicketNum != null && raffle.winnerName != null;
  const isClosed = raffle.status === 'Cerrada';

  return (
    <View className="flex-1 bg-app-bg relative">
      <FinishRaffleModal
        visible={showFinishModal}
        winnerName={raffle.winnerName}
        winnerTicketNum={raffle.winnerTicketNum}
        drawDate={raffle.rawDrawDate}
        onClose={() => setShowFinishModal(false)}
        onConfirm={handleFinishRaffle}
        loading={finishing}
      />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <DetailBanner
          title={raffle.title}
          product={raffle.product || undefined}
          status={raffle.status}
          imageUri={raffle.image || defaultImage}
          onBackPress={goBack}
          onOptionsPress={() => {}}
        />

        <View className="px-6 py-6 gap-y-6 relative z-10 -mt-3 bg-app-bg rounded-t-3xl">
          {raffle.description ? (
            <View className="bg-white rounded-3xl p-5 shadow-card border border-gray-100/50">
              <Text className="text-xs font-black text-app-gray uppercase tracking-widest mb-1.5">Descripción</Text>
              <Text className="text-base text-slate-700 leading-relaxed">{raffle.description}</Text>
            </View>
          ) : null}

          <ProgressCard
            totalCollected={raffle.totalCollected}
            totalExpected={raffle.totalExpected}
            progressPercent={raffle.progressPercent}
            date={raffle.date}
            daysRemaining={raffle.daysRemaining}
          />

          <StatsGrid
            assigned={raffle.assignedNumbers}
            paid={raffle.paidNumbers}
            reserved={raffle.reservedNumbers}
            available={raffle.availableNumbers}
            onPressAssigned={() => router.push(`/raffle/${raffleId}/numbers?filter=ALL`)}
            onPressPaid={() => router.push(`/raffle/${raffleId}/numbers?filter=PAGADO`)}
            onPressReserved={() => router.push(`/raffle/${raffleId}/numbers?filter=RESERVADO`)}
            onPressAvailable={() => router.push(`/raffle/${raffleId}/numbers?filter=DISPONIBLE`)}
          />

          {!isClosed ? (
            <>
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => router.push(`/raffle/${raffleId}/numbers`)}
                  className="flex-1 bg-app-dark py-3.5 rounded-2xl items-center justify-center gap-1 active:scale-95 transition-all"
                  style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
                >
                  <Ionicons name="grid-outline" size={20} color="#ffffff" />
                  <Text className="text-xs font-bold uppercase tracking-wider text-white">Números</Text>
                </Pressable>

                <Pressable
                  onPress={() => router.push(`/raffle/${raffleId}/share`)}
                  className="flex-1 bg-white py-3.5 rounded-2xl items-center justify-center gap-1 shadow-card border border-gray-100 active:scale-95 transition-all"
                  style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
                >
                  <Ionicons name="share-social-outline" size={20} color="#111827" />
                  <Text className="text-xs font-bold uppercase tracking-wider text-app-dark">Exportar</Text>
                </Pressable>

                <Pressable
                  onPress={() => router.push(`/raffle/${raffleId}/draw`)}
                  className="flex-1 bg-app-accent py-3.5 rounded-2xl items-center justify-center gap-1 shadow-lg shadow-app-accent/20 active:scale-95 transition-all"
                  style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
                >
                  <Ionicons name="trophy-outline" size={20} color="#ffffff" />
                  <Text className="text-xs font-bold uppercase tracking-wider text-white">Sorteo</Text>
                </Pressable>
              </View>

              {hasWinner ? (
                <Pressable
                  onPress={() => setShowFinishModal(true)}
                  className="bg-reservado py-3.5 rounded-2xl items-center justify-center flex-row gap-2 active:scale-95 transition-all shadow-lg"
                  style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
                >
                  <Ionicons name="flag-outline" size={18} color="#ffffff" />
                  <Text className="text-sm font-black uppercase tracking-wider text-white">Finalizar rifa</Text>
                </Pressable>
              ) : null}
            </>
          ) : (
            <View className="bg-gray-100 py-4 rounded-2xl items-center justify-center flex-row">
              <Ionicons name="lock-closed" size={18} color="#6B7280" />
              <Text className="text-sm font-bold text-gray-600 ml-2">Rifa finalizada</Text>
            </View>
          )}

          <RecentActivity activities={activities} onViewAllPress={() => router.push(`/raffle/${raffleId}/participants`)} />
        </View>
      </ScrollView>
    </View>
  );
}
