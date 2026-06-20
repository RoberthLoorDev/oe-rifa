import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import ParticipantFilterChips, { ParticipantFilter } from '@/components/participants/ParticipantFilterChips';
import ParticipantSearchBar from '@/components/participants/ParticipantSearchBar';
import ParticipantCardList from '@/components/participants/ParticipantCardList';
import { useRaffleParticipants } from '../../../hooks/useRaffleParticipants';

export default function ParticipantsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const raffleId = Array.isArray(id) ? id[0] : id;

  const {
    participants,
    raffleTitle,
    product,
    loading,
    error
  } = useRaffleParticipants(raffleId || '');

  const [activeFilter, setActiveFilter] = useState<ParticipantFilter>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchesFilter = activeFilter === 'TODOS' || p.status === activeFilter;
      
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery);

      return matchesFilter && matchesSearch;
    });
  }, [participants, activeFilter, searchQuery]);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/raffle/${raffleId}`);
    }
  };

  if (loading && participants.length === 0) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3B6FFF" />
      </View>
    );
  }

  if (error && participants.length === 0) {
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
    <View className="flex-1 bg-app-bg">
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
            <Text className="text-xl font-bold text-app-dark">
              Participantes
            </Text>
            <Text className="text-xs text-app-gray font-bold mt-0.5" numberOfLines={1}>
              {raffleTitle} {product ? `— ${product}` : ''}
            </Text>
          </View>
        </View>

        <ParticipantFilterChips
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />
      </View>

      <ScrollView 
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <ParticipantSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ParticipantCardList 
          participants={filteredParticipants}
        />
      </ScrollView>
    </View>
  );
}
