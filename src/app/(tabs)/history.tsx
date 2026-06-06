import { View, Text, ScrollView } from 'react-native';
import React from 'react';

export default function HistoryScreen() {
  return (
    <ScrollView className="flex-1 bg-app-bg p-6">
      <View className="mb-6 pt-6">
        <Text className="text-3xl font-bold text-app-dark">Historial de Rifas</Text>
        <Text className="text-sm text-app-gray mt-1">
          Consulta las rifas cerradas, canceladas y los ganadores anteriores.
        </Text>
      </View>

      <View className="flex-1 items-center justify-center py-20 border border-dashed border-gray-300 rounded-3xl bg-white shadow-card">
        <Text className="text-base font-semibold text-app-dark mb-1">No hay rifas finalizadas</Text>
        <Text className="text-sm text-app-gray text-center px-6">
          Aquí aparecerán las rifas una vez que realices el sorteo o sean canceladas.
        </Text>
      </View>
    </ScrollView>
  );
}
