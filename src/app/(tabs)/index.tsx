import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, View, ActivityIndicator, Text } from 'react-native';
import HomeFilterChips, { HomeFilter } from '@/components/home/HomeFilterChips';
import HomeHeader from '@/components/home/HomeHeader';
import RaffleList from '@/components/home/RaffleList';
import SearchBar from '@/components/home/SearchBar';
import { useRaffles } from '../../hooks/useRaffles';

export default function HomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<HomeFilter>('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const { raffles, loading, error } = useRaffles();

  const filteredRaffles = useMemo(() => {
    return raffles.filter((raffle) => {
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
  }, [raffles, activeFilter, searchQuery]);

  return (
    <View className="flex-1 bg-app-bg relative">
      <ScrollView
        className="flex-1 px-6 pt-12"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <HomeFilterChips activeFilter={activeFilter} onSelectFilter={setActiveFilter} />

        {loading ? (
          <View className="flex-1 py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#3B6FFF" />
          </View>
        ) : error ? (
          <View className="flex-1 py-16 items-center justify-center bg-red-50 border border-red-200 rounded-3xl p-4 gap-y-2">
            <Ionicons name="alert-circle" size={36} color="#EF4444" />
            <Text className="text-red-700 font-bold text-center">Fallo al conectar con la base de datos</Text>
            <Text className="text-red-500 text-xs text-center">{error}</Text>
          </View>
        ) : raffles.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20 px-4 gap-y-4">
            <View className="w-20 h-20 bg-app-accent/10 rounded-full items-center justify-center mb-2">
              <Ionicons name="gift-outline" size={40} color="#3B6FFF" />
            </View>
            <Text className="text-xl font-bold text-app-dark text-center">¡No tienes rifas activas!</Text>
            <Text className="text-sm text-app-gray text-center px-4">
              Organiza tus sorteos de forma digital. Crea tu primera rifa presionando el botón de abajo.
            </Text>
            <Pressable
              onPress={() => router.push('/raffle/create')}
              className="bg-app-accent px-6 py-3.5 rounded-2xl shadow-lg shadow-app-accent/25 active:scale-95 transition-all mt-2"
              style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
            >
              <Text className="text-white font-extrabold text-sm">Crear mi primera Rifa</Text>
            </Pressable>
          </View>
        ) : filteredRaffles.length === 0 ? (
          <View className="flex-1 items-center justify-center py-16 px-4 gap-y-2">
            <Ionicons name="search-outline" size={36} color="#9CA3AF" />
            <Text className="text-base font-bold text-app-gray text-center">No se encontraron resultados</Text>
            <Text className="text-xs text-app-gray/70 text-center">Intenta ajustar los filtros o el texto de búsqueda.</Text>
          </View>
        ) : (
          <RaffleList raffles={filteredRaffles} onPressRaffle={(id) => router.push(`/raffle/${id}`)} />
        )}
      </ScrollView>

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
