import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function DrawScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [drawing, setDrawing] = useState(false);
  const [winner, setWinner] = useState<{ num: number; name: string } | null>(null);

  const mockPaidTickets = [
    { num: 5, name: 'Juan Pérez' },
    { num: 10, name: 'Juan Pérez' },
    { num: 15, name: 'Juan Pérez' },
    { num: 20, name: 'Carlos Rojas' },
    { num: 25, name: 'Beatriz Díaz' },
  ];

  const handleStartDraw = () => {
    if (drawing) return;
    setDrawing(true);
    setWinner(null);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockPaidTickets.length);
      setWinner(mockPaidTickets[randomIndex]);
      setDrawing(false);
    }, 2500);
  };

  return (
    <ScrollView className="flex-1 bg-background p-6">
      {/* Header */}
      <View className="mb-6 flex-row items-center gap-2">
        <Pressable onPress={() => router.back()} className="mr-2">
          <Text className="text-primary font-bold text-base">← Panel</Text>
        </Pressable>
        <Text className="text-xl font-black text-text">Sorteo de Rifa</Text>
      </View>

      {/* Draw Simulation Area */}
      <View className="bg-surface p-6 rounded-3xl border border-border shadow-sm items-center justify-center min-h-[280px] mb-6 gap-5">
        {drawing ? (
          <View className="items-center gap-3">
            <Text className="text-5xl animate-bounce">🎲</Text>
            <Text className="text-lg font-black text-text animate-pulse">Mezclando boletos...</Text>
            <Text className="text-xs text-textMuted text-center px-4">
              Seleccionando un ganador al azar de los números pagados
            </Text>
          </View>
        ) : winner ? (
          <View className="items-center gap-2.5">
            <Text className="text-sm font-bold text-disponible uppercase tracking-wider">¡Ganador Seleccionado!</Text>
            <View className="w-24 h-24 rounded-full bg-disponible items-center justify-center shadow-lg border border-white">
              <Text className="text-white font-black text-4xl">{winner.num}</Text>
            </View>
            <Text className="text-2xl font-black text-text mt-2">{winner.name}</Text>
            <Text className="text-xs text-textMuted">¡Felicitaciones!</Text>
          </View>
        ) : (
          <View className="items-center gap-4">
            <Text className="text-sm text-textMuted text-center px-6">
              Presiona el botón para iniciar el sorteo aleatorio entre los boletos pagados.
            </Text>
            <Pressable
              onPress={handleStartDraw}
              className="bg-disponible px-8 py-4 rounded-xl shadow-md active:opacity-95"
              style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
            >
              <Text className="text-white font-extrabold text-sm">Realizar Sorteo</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Eligible Tickets list */}
      <View className="bg-surface p-5 rounded-2xl border border-border mb-12">
        <Text className="text-sm font-bold text-text mb-4">Boletos elegibles ({mockPaidTickets.length})</Text>
        
        <View className="gap-2.5">
          {mockPaidTickets.map((ticket) => (
            <View key={ticket.num} className="flex-row justify-between items-center py-2 border-b border-border last:border-b-0">
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded bg-background items-center justify-center border border-border">
                  <Text className="text-text font-black text-xs">{ticket.num}</Text>
                </View>
                <Text className="text-sm font-bold text-text">{ticket.name}</Text>
              </View>
              <Text className="text-xs font-semibold text-disponible">Elegible</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
