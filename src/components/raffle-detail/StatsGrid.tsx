import React from 'react';
import { View, Text } from 'react-native';

interface StatsGridProps {
  assigned: number;
  paid: number;
  reserved: number;
  available: number;
}

export default function StatsGrid({
  assigned,
  paid,
  reserved,
  available,
}: StatsGridProps) {
  return (
    <View className="gap-y-3">
      {/* Row 1 */}
      <View className="flex-row gap-3">
        <View className="flex-1 bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-app-accent/10 items-center justify-center">
            <Text className="text-lg">🎟️</Text>
          </View>
          <View>
            <Text className="text-2xl font-black text-app-dark">{assigned}</Text>
            <Text className="text-xs uppercase font-bold text-app-gray tracking-wide">Tomados</Text>
          </View>
        </View>
        <View className="flex-1 bg-white rounded-2xl p-4 shadow-card border border-green-100 flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-app-green/10 items-center justify-center">
            <Text className="text-lg">✅</Text>
          </View>
          <View>
            <Text className="text-2xl font-black text-app-dark">{paid}</Text>
            <Text className="text-xs uppercase font-bold text-app-green tracking-wide">Pagados</Text>
          </View>
        </View>
      </View>

      {/* Row 2 */}
      <View className="flex-row gap-3">
        <View className="flex-1 bg-white rounded-2xl p-4 shadow-card border border-orange-100 flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-app-orange/10 items-center justify-center">
            <Text className="text-lg">🟡</Text>
          </View>
          <View>
            <Text className="text-2xl font-black text-app-dark">{reserved}</Text>
            <Text className="text-xs uppercase font-bold text-amber-600 tracking-wide">Reservados</Text>
          </View>
        </View>
        <View className="flex-1 bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
            <Text className="text-lg">🟢</Text>
          </View>
          <View>
            <Text className="text-2xl font-black text-app-dark">{available}</Text>
            <Text className="text-xs uppercase font-bold text-app-gray tracking-wide">Disponibles</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
