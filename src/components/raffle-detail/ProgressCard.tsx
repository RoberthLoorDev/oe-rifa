import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProgressCardProps {
  totalCollected: number;
  totalExpected: number;
  progressPercent: number;
  date: string;
}

export default function ProgressCard({
  totalCollected,
  totalExpected,
  progressPercent,
  date,
}: ProgressCardProps) {
  return (
    <View className="bg-white rounded-3xl p-5 shadow-card border border-gray-100">
      <View className="flex-row justify-between items-end mb-3">
        <View>
          <Text className="text-sm text-app-gray font-bold uppercase mb-0.5">Recaudado</Text>
          <Text className="text-2xl font-black text-app-dark">
            ${totalCollected} <Text className="text-base font-medium text-app-gray">de ${totalExpected}</Text>
          </Text>
        </View>
        <View className="bg-app-accent/10 px-2.5 py-1 rounded-lg">
          <Text className="text-sm font-black text-app-accent">{progressPercent}%</Text>
        </View>
      </View>
      
      <View className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
        <View 
          className="h-full bg-app-accent rounded-full" 
          style={{ width: `${progressPercent}%` }} 
        />
      </View>
      
      <View className="flex-row items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
        <Ionicons name="time" size={14} color="#F59E0B" />
        <Text className="text-sm text-gray-500 font-semibold ml-2">
          Sorteo en 14 días — {date}
        </Text>
      </View>
    </View>
  );
}
