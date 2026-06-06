import React from 'react';
import { View, Text, Pressable, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Raffle } from './types';

interface RaffleListProps {
  raffles: Raffle[];
  onPressRaffle: (id: string) => void;
}

export default function RaffleList({ raffles, onPressRaffle }: RaffleListProps) {
  return (
    <View className="gap-4">
      {raffles.map((raffle) => {
        const progressPercent = Math.round((raffle.assignedNumbers / raffle.totalNumbers) * 100);
        const isClosed = raffle.status === 'Cerrada';

        return (
          <Pressable 
            key={raffle.id}
            onPress={() => onPressRaffle(raffle.id)}
            className={`bg-white p-4 rounded-3xl shadow-card flex-row gap-4 relative active:scale-[0.98] transition-all ${
              isClosed ? 'opacity-70' : ''
            }`}
            style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
          >
            {/* Image / Placeholder */}
            <View className="w-[70px] h-[70px] bg-gray-100 rounded-2xl flex-shrink-0 items-center justify-center overflow-hidden relative border border-gray-100">
              {raffle.image ? (
                <Image 
                  source={{ uri: raffle.image }} 
                  className="absolute inset-0 w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="image-outline" size={24} color="#D1D5DB" />
              )}
            </View>

            {/* Card Content */}
            <View className="flex-1 min-w-0 pr-12">
              <View className="flex-row justify-between items-start mb-1">
                <Text className="font-bold text-app-dark truncate pr-2 text-base" numberOfLines={1}>
                  {raffle.title}
                </Text>
              </View>

              <View className="flex-row items-center mb-2">
                <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                <Text className="text-sm text-app-gray ml-1 font-semibold">
                  Sorteo: {raffle.date}
                </Text>
              </View>

              <View className="flex-row items-center justify-between mt-auto">
                <View className="w-2/3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <View 
                    className={`h-full rounded-full ${isClosed ? 'bg-app-gray' : 'bg-app-accent'}`} 
                    style={{ width: `${progressPercent}%` }} 
                  />
                </View>
                <Text className={`text-sm font-bold ml-2 ${
                  raffle.status === 'Completa' ? 'text-app-accent' : 'text-gray-500'
                }`}>
                  {raffle.assignedNumbers}/{raffle.totalNumbers}
                </Text>
              </View>
            </View>

            {/* Status Badge */}
            <View className="absolute right-4 top-4">
              <View className={`px-2.5 py-0.5 rounded-md ${
                raffle.status === 'En curso' 
                  ? 'bg-green-100' 
                  : raffle.status === 'Completa' 
                  ? 'bg-blue-100' 
                  : 'bg-gray-100'
              }`}>
                <Text className={`text-xs font-bold uppercase ${
                  raffle.status === 'En curso' 
                    ? 'text-green-700' 
                    : raffle.status === 'Completa' 
                    ? 'text-blue-700' 
                    : 'text-gray-600'
                }`}>
                  {raffle.status}
                </Text>
              </View>
            </View>

            {/* Price Badge */}
            <View className="absolute right-4 bottom-4 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
              <Text className="text-sm font-bold text-app-dark">${raffle.price}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
