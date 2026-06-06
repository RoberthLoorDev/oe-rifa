import React from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function NumbersGridScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock numbers grid (e.g. 50 numbers)
  const numbersList = Array.from({ length: 50 }, (_, i) => {
    const num = i + 1;
    let status: 'DISPONIBLE' | 'RESERVADO' | 'PAGADO' = 'DISPONIBLE';
    let participant = '';
    
    if (num % 5 === 0) {
      status = 'PAGADO';
      participant = 'Juan Pérez';
    } else if (num % 7 === 0) {
      status = 'RESERVADO';
      participant = 'María Gómez';
    }
    
    return { num, status, participant };
  });

  return (
    <ScrollView className="flex-1 bg-background p-6">
      {/* Header */}
      <View className="mb-6 flex-row items-center gap-2">
        <Pressable onPress={() => router.back()} className="mr-2">
          <Text className="text-primary font-bold text-base">← Panel</Text>
        </Pressable>
        <Text className="text-xl font-black text-text">Grilla de Números</Text>
      </View>

      {/* Color Legend */}
      <View className="bg-surface p-4 rounded-xl border border-border flex-row justify-around mb-6">
        <View className="flex-row items-center gap-1.5">
          <View className="w-3.5 h-3.5 rounded bg-disponible" />
          <Text className="text-xs text-text font-bold">Libre</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="w-3.5 h-3.5 rounded bg-reservado" />
          <Text className="text-xs text-text font-bold">Reservado</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="w-3.5 h-3.5 rounded bg-pagado" />
          <Text className="text-xs text-text font-bold">Pagado</Text>
        </View>
      </View>

      {/* Grid Container */}
      <View className="bg-surface p-5 rounded-2xl border border-border shadow-sm mb-12">
        <View className="flex-row flex-wrap justify-between gap-y-3.5">
          {numbersList.map((item) => {
            let bgClass = 'bg-disponible';
            if (item.status === 'RESERVADO') bgClass = 'bg-reservado';
            if (item.status === 'PAGADO') bgClass = 'bg-pagado';
            
            return (
              <Pressable
                key={item.num}
                className={`w-[18%] aspect-square items-center justify-center rounded-xl ${bgClass} active:opacity-85`}
                style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
              >
                <Text className="text-white font-black text-sm">{item.num}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
