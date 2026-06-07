import React from 'react';
import { View, Text, ScrollView, Pressable, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import DetailBanner from '@/components/raffle-detail/DetailBanner';
import ProgressCard from '@/components/raffle-detail/ProgressCard';
import StatsGrid from '@/components/raffle-detail/StatsGrid';
import RecentActivity from '@/components/raffle-detail/RecentActivity';
import { useRaffleDetail } from '../../../hooks/useRaffleDetail';

export default function RaffleDashboardScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const raffleId = Array.isArray(id) ? id[0] : id;

  const { raffle, activities, loading, error } = useRaffleDetail(raffleId || '');

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

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
        <Pressable 
          onPress={goBack}
          className="mt-6 bg-app-dark px-6 py-3 rounded-2xl active:scale-95 transition-all"
        >
          <Text className="text-white font-bold">Volver al Inicio</Text>
        </Pressable>
      </View>
    );
  }

  const defaultImage = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&h=600&fit=crop';

  return (
    <View className="flex-1 bg-app-bg relative">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <DetailBanner 
          title={raffle.title}
          product={raffle.product || undefined}
          status={raffle.status}
          imageUri={raffle.image || defaultImage}
          onBackPress={goBack}
          onOptionsPress={() => {}}
        />

        <View className="px-6 py-6 gap-y-6 relative z-10 -mt-3 bg-app-bg rounded-t-3xl">
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
          />

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

          <RecentActivity 
            activities={activities}
            onViewAllPress={() => router.push(`/raffle/${raffleId}/participants`)}
          />

        </View>
      </ScrollView>
    </View>
  );
}
