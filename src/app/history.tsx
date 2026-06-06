import { View, Text, ScrollView } from 'react-native';
import React from 'react';

export default function HistoryScreen() {
  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-text">Historial de Rifas</Text>
        <Text className="text-sm text-textMuted mt-1">
          Consulta las rifas cerradas, canceladas y los ganadores anteriores.
        </Text>
      </View>

      <View className="flex-1 items-center justify-center py-20 border border-dashed border-border rounded-2xl bg-surface">
        <Text className="text-base font-semibold text-text mb-1">No hay rifas finalizadas</Text>
        <Text className="text-sm text-textMuted text-center px-6">
          Aquí aparecerán las rifas una vez que realices el sorteo o sean canceladas.
        </Text>
      </View>
    </ScrollView>
  );
}
