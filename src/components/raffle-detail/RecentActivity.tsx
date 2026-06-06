import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';

interface RecentActivityProps {
  onViewAllPress: () => void;
}

export default function RecentActivity({ onViewAllPress }: RecentActivityProps) {
  return (
    <View className="gap-y-3">
      <View className="flex-row justify-between items-center px-1">
        <Text className="text-base font-bold text-app-dark">Última actividad</Text>
        <Pressable 
          onPress={onViewAllPress}
          style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
        >
          <Text className="text-sm font-bold text-app-accent">Ver todos</Text>
        </Pressable>
      </View>

      <View className="bg-white rounded-3xl p-2 shadow-card border border-gray-100">
        {/* Row 1 */}
        <View className="flex-row items-center gap-3 p-3.5 border-b border-gray-100/50">
          <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
            <Text className="text-blue-600 text-xs font-bold">LZ</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-app-dark">
              Lucía Zambrano tomó <Text className="font-bold text-app-accent">#24</Text>
            </Text>
            <Text className="text-xs text-app-gray mt-0.5">hace 2 horas</Text>
          </View>
        </View>

        {/* Row 2 */}
        <View className="flex-row items-center gap-3 p-3.5 border-b border-gray-100/50">
          <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center">
            <Text className="text-green-600 text-xs font-bold">CT</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-app-dark">
              Carlos Torres pagó <Text className="font-bold text-app-green">#07</Text>
            </Text>
            <Text className="text-xs text-app-gray mt-0.5">hace 5 horas</Text>
          </View>
        </View>

        {/* Row 3 */}
        <View className="flex-row items-center gap-3 p-3.5">
          <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center">
            <Text className="text-orange-600 text-xs font-bold">AM</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-app-dark">
              Andrés Mina reservó <Text className="font-bold text-app-orange">#15, #16</Text>
            </Text>
            <Text className="text-xs text-app-gray mt-0.5">ayer</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
