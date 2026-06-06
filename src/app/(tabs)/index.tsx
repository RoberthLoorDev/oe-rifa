import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';

import HomeFilterChips, { HomeFilter } from '@/components/home/HomeFilterChips';
import HomeHeader from '@/components/home/HomeHeader';
import RaffleList from '@/components/home/RaffleList';
import SearchBar from '@/components/home/SearchBar';
import { Raffle } from '@/components/home/types';

// Mock data for initial rendering matching the HTML design exactly
const MOCK_RAFFLES: Raffle[] = [
  {
    id: '1',
    title: 'Rifa Solidaria Pro',
    description: 'Ayúdanos a recaudar fondos para causas benéficas.',
    price: 5,
    totalNumbers: 50,
    assignedNumbers: 23,
    status: 'En curso',
    date: '20 dic 2025',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    title: 'iPhone 15 Pro',
    description: 'Gran sorteo de fin de año de un iPhone 15 Pro.',
    price: 10,
    totalNumbers: 100,
    assignedNumbers: 100,
    status: 'Completa',
    date: '25 dic 2025',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    title: 'Canasta Navideña',
    description: 'Sorteo tradicional de la gran canasta familiar.',
    price: 3,
    totalNumbers: 30,
    assignedNumbers: 8,
    status: 'Cerrada',
    date: '31 dic 2024',
    image: null,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<HomeFilter>('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Dual filtering: filter by status tab AND search input text
  const filteredRaffles = useMemo(() => {
    return MOCK_RAFFLES.filter((raffle) => {
      const matchesFilter =
        activeFilter === 'Todas' ||
        (activeFilter === 'En curso' && raffle.status === 'En curso') ||
        (activeFilter === 'Completas' && raffle.status === 'Completa') ||
        (activeFilter === 'Cerradas' && raffle.status === 'Cerrada');

      const matchesSearch =
        raffle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        raffle.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <View className="flex-1 bg-app-bg relative">
      <ScrollView
        className="flex-1 px-6 pt-12"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Component */}
        <HomeHeader />

        {/* Search Bar Component (Now fully functional!) */}
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        {/* Filter Chips Component */}
        <HomeFilterChips activeFilter={activeFilter} onSelectFilter={setActiveFilter} />

        {/* Raffle Card List Component */}
        <RaffleList raffles={filteredRaffles} onPressRaffle={(id) => router.push(`/raffle/${id}`)} />
      </ScrollView>

      {/* Floating Action Button (Create Raffle) */}
      <Pressable
        onPress={() => router.push('/raffle/create')}
        className="absolute bottom-6 right-6 w-14 h-14 bg-app-accent rounded-full shadow-lg items-center justify-center active:scale-90 transition-transform"
        style={Platform.OS === 'web' ? { cursor: 'pointer', zIndex: 50 } : { zIndex: 50 }}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </Pressable>
    </View>
  );
}
