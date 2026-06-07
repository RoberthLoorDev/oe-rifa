import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Participant } from '@/components/participants/types';
import ParticipantFilterChips, { ParticipantFilter } from '@/components/participants/ParticipantFilterChips';
import ParticipantSearchBar from '@/components/participants/ParticipantSearchBar';
import ParticipantCardList from '@/components/participants/ParticipantCardList';

// Mock participants data matching the project's styling and mock values
const MOCK_PARTICIPANTS: Participant[] = [
  { id: '1', name: 'Juan Pérez', phone: '+51 987 654 321', numbers: [5, 10, 15], status: 'PAGADO' },
  { id: '2', name: 'María Gómez', phone: '+51 987 000 111', numbers: [7, 14], status: 'RESERVADO' },
  { id: '3', name: 'Carlos Rojas', phone: '+51 912 345 678', numbers: [20], status: 'PAGADO' },
  { id: '4', name: 'Ana Mendoza', phone: '', numbers: [21, 28], status: 'RESERVADO' },
];

export default function ParticipantsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock metadata based on ID matching raffle details
  const raffleTitle = id === '2' ? 'iPhone 15 Pro' : 'Rifa Pro-Fondos Viaje';
  const displayTitle = id === '1' ? 'Rifa Solidaria Pro' : raffleTitle;
  const product = id === '1' ? 'iPhone 15 Pro' : id === '2' ? 'iPhone 15 Pro' : 'Viaje a Galápagos';

  const [activeFilter, setActiveFilter] = useState<ParticipantFilter>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');

  // Dual filtering: filter by status filter tab AND search query input text
  const filteredParticipants = useMemo(() => {
    return MOCK_PARTICIPANTS.filter((p) => {
      // 1. Filter by status
      const matchesFilter = activeFilter === 'TODOS' || p.status === activeFilter;
      
      // 2. Filter by search query (match name or phone number case-insensitively)
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/raffle/${id}`);
    }
  };

  return (
    <View className="flex-1 bg-app-bg">
      {/* HEADER CONTAINER */}
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
              {displayTitle} {product ? `— ${product}` : ''}
            </Text>
          </View>
        </View>

        {/* Horizontal Scrollable Filter Chips Component */}
        <ParticipantFilterChips
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />
      </View>

      {/* SEARCH BAR & CARDS LIST CONTAINER */}
      <ScrollView 
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Input Component (Fully functional!) */}
        <ParticipantSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Cards List Component */}
        <ParticipantCardList 
          participants={filteredParticipants}
        />
      </ScrollView>
    </View>
  );
}
