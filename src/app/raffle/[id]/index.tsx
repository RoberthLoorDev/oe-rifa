import React from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import DetailBanner from '@/components/raffle-detail/DetailBanner';
import ProgressCard from '@/components/raffle-detail/ProgressCard';
import StatsGrid from '@/components/raffle-detail/StatsGrid';
import RecentActivity from '@/components/raffle-detail/RecentActivity';

export default function RaffleDashboardScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock metadata based on ID matching the Rifa Solidaria Pro from HTML design
  const raffleTitle = id === '2' ? 'iPhone 15 Pro' : 'Rifa Pro-Fondos Viaje';
  const displayTitle = id === '1' ? 'Rifa Solidaria Pro' : raffleTitle;
  
  const price = id === '2' ? 10 : id === '3' ? 3 : 5;
  const total = id === '2' ? 100 : id === '3' ? 30 : 50;
  const assigned = id === '2' ? 100 : id === '3' ? 8 : 23;
  const paid = id === '2' ? 90 : id === '3' ? 5 : 15;
  const reserved = id === '2' ? 10 : id === '3' ? 3 : 8;
  const available = total - assigned;
  const date = id === '2' ? '25 dic 2025' : id === '3' ? '31 dic 2024' : '20 dic 2025';
  
  const status = id === '2' ? 'Completa' : id === '3' ? 'Cerrada' : 'En curso';
  const progressPercent = Math.round((assigned / total) * 100);
  const totalCollected = paid * price;
  const totalExpected = total * price;

  const imageUri = id === '2' 
    ? 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&h=600&fit=crop' 
    : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&h=600&fit=crop';

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View className="flex-1 bg-app-bg relative">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Component */}
        <DetailBanner 
          title={displayTitle}
          status={status}
          imageUri={imageUri}
          onBackPress={goBack}
          onOptionsPress={() => {}}
        />

        {/* Content overlapping the banner slightly */}
        <View className="px-6 py-6 gap-y-6 relative z-10 -mt-3 bg-app-bg rounded-t-3xl">
          
          {/* Progreso (Money Raised Card) */}
          <ProgressCard 
            totalCollected={totalCollected}
            totalExpected={totalExpected}
            progressPercent={progressPercent}
            date={date}
          />

          {/* Stats Grid (2 Columns) */}
          <StatsGrid 
            assigned={assigned}
            paid={paid}
            reserved={reserved}
            available={available}
          />

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <Pressable 
              onPress={() => router.push(`/raffle/${id}/numbers`)}
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
              onPress={() => router.push(`/raffle/${id}/draw`)}
              className="flex-1 bg-app-accent py-3.5 rounded-2xl items-center justify-center gap-1 shadow-lg shadow-app-accent/20 active:scale-95 transition-all"
              style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
            >
              <Ionicons name="trophy-outline" size={20} color="#ffffff" />
              <Text className="text-xs font-bold uppercase tracking-wider text-white">Sorteo</Text>
            </Pressable>
          </View>

          {/* Actividad */}
          <RecentActivity 
            onViewAllPress={() => router.push(`/raffle/${id}/participants`)}
          />

        </View>
      </ScrollView>
    </View>
  );
}
