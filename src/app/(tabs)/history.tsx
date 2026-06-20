import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRaffles } from '@/hooks/useRaffles';

export default function HistoryScreen() {
  const router = useRouter();
  const { raffles, loading } = useRaffles();

  const closedRaffles = useMemo(() => {
    return raffles.filter((r) => r.status === 'Cerrada');
  }, [raffles]);

  return (
    <ScrollView className="flex-1 bg-app-bg p-6">
      <View className="mb-6 pt-6">
        <Text className="text-3xl font-bold text-app-dark">Historial de Rifas</Text>
        <Text className="text-sm text-app-gray mt-1">
          Consulta las rifas cerradas y los ganadores anteriores.
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 py-20 items-center justify-center">
          <ActivityIndicator size="large" color="#3B6FFF" />
        </View>
      ) : closedRaffles.length === 0 ? (
        <View className="flex-1 items-center justify-center py-20 border border-dashed border-gray-300 rounded-3xl bg-white shadow-card">
          <Ionicons name="archive-outline" size={40} color="#D1D5DB" />
          <Text className="text-base font-semibold text-app-dark mb-1 mt-3">No hay rifas finalizadas</Text>
          <Text className="text-sm text-app-gray text-center px-6">
            Aquí aparecerán las rifas una vez que las finalices desde el dashboard.
          </Text>
        </View>
      ) : (
        <View className="gap-4">
          {closedRaffles.map((raffle) => (
            <Pressable
              key={raffle.id}
              onPress={() => router.push(`/raffle/${raffle.id}`)}
              className="bg-white p-4 rounded-3xl shadow-card flex-row gap-4 relative opacity-70 active:scale-[0.98] transition-all"
              style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
            >
              <View className="w-[70px] h-[70px] bg-gray-100 rounded-2xl flex-shrink-0 items-center justify-center overflow-hidden border border-gray-100">
                {raffle.image ? (
                  <Image source={{ uri: raffle.image }} className="absolute inset-0 w-full h-full" resizeMode="cover" />
                ) : (
                  <Ionicons name="image-outline" size={24} color="#D1D5DB" />
                )}
              </View>

              <View className="flex-1 min-w-0 pr-12">
                <Text className="font-bold text-app-dark truncate text-base mb-0.5" numberOfLines={1}>
                  {raffle.title}
                </Text>
                <Text className="text-sm text-app-gray mb-1">
                  Sorteo: {raffle.date}
                </Text>
                {raffle.winnerName ? (
                  <View className="flex-row items-center gap-1.5 mt-1">
                    <Ionicons name="trophy" size={14} color="#D97706" />
                    <Text className="text-xs font-bold text-amber-600" numberOfLines={1}>
                      {raffle.winnerName}
                      {raffle.winnerTicketNum != null && ` #${raffle.winnerTicketNum < 10 ? '0' : ''}${raffle.winnerTicketNum}`}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View className="absolute right-4 top-4">
                <View className="px-2.5 py-0.5 rounded-md bg-gray-100">
                  <Text className="text-xs font-bold uppercase text-gray-600">Cerrada</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
