import React from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function RaffleDashboardScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock metadata based on ID
  const raffleTitle = id === '2' ? 'Rifa Laptop Gamer ASUS Rog Strix' : 'Rifa Pro-Fondos Viaje de Estudios';
  const total = id === '2' ? 200 : 100;
  const assigned = id === '2' ? 200 : 68;
  const paid = id === '2' ? 190 : 45;
  const reserved = id === '2' ? 10 : 23;
  const price = id === '2' ? 10.0 : 5.0;
  
  const totalCollected = paid * price;
  const totalExpected = total * price;
  const progressPercent = Math.round((assigned / total) * 100);

  return (
    <ScrollView className="flex-1 bg-background p-6">
      {/* Header / Navigation */}
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Pressable onPress={() => router.replace('/')} className="mr-2">
            <Text className="text-primary font-bold text-base">← Panel</Text>
          </Pressable>
          <Text className="text-xl font-black text-text">Detalle de Rifa</Text>
        </View>
        <Pressable 
          onPress={() => router.push(`/raffle/${id}/edit`)}
          className="border border-border bg-surface px-4 py-2 rounded-xl active:bg-slate-50"
        >
          <Text className="text-text font-bold text-xs">Editar</Text>
        </Pressable>
      </View>

      {/* Raffle Info Card */}
      <View className="bg-surface p-5 rounded-2xl border border-border shadow-sm mb-6">
        <Text className="text-lg font-black text-text">{raffleTitle}</Text>
        <Text className="text-xs text-textMuted mt-1">ID Rifa: #{id}</Text>
        
        {/* Progress bar */}
        <View className="mt-4 mb-2">
          <View className="flex-row justify-between text-xs text-textMuted mb-1.5">
            <Text className="text-xs text-textMuted font-medium">Números vendidos</Text>
            <Text className="text-xs font-bold text-text">{progressPercent}% ({assigned}/{total})</Text>
          </View>
          <View className="w-full h-2 bg-border rounded-full overflow-hidden">
            <View 
              className="h-full rounded-full bg-primary" 
              style={{ width: `${progressPercent}%` }} 
            />
          </View>
        </View>
      </View>

      {/* Stats Summary Grid */}
      <View className="flex-row gap-4 mb-6">
        <View className="flex-1 bg-surface p-4 rounded-xl border border-border">
          <Text className="text-[10px] font-bold text-textMuted uppercase">Monto Cobrado</Text>
          <Text className="text-xl font-black text-disponible mt-1">${totalCollected}</Text>
          <Text className="text-[10px] text-textMuted mt-0.5">Meta: ${totalExpected}</Text>
        </View>
        <View className="flex-1 bg-surface p-4 rounded-xl border border-border">
          <Text className="text-[10px] font-bold text-textMuted uppercase">Por Cobrar</Text>
          <Text className="text-xl font-black text-reservado mt-1">${reserved * price}</Text>
          <Text className="text-[10px] text-textMuted mt-0.5">{reserved} Reservados</Text>
        </View>
      </View>

      {/* Tickets Status Breakdown */}
      <View className="bg-surface p-5 rounded-2xl border border-border mb-6 gap-3">
        <Text className="text-sm font-bold text-text mb-1">Distribución de Números</Text>
        
        <View className="flex-row justify-between items-center py-2 border-b border-border">
          <View className="flex-row items-center gap-2">
            <View className="w-3.5 h-3.5 rounded-full bg-disponible" />
            <Text className="text-sm text-text font-semibold">Pagados</Text>
          </View>
          <Text className="text-sm font-bold text-text">{paid}</Text>
        </View>
        
        <View className="flex-row justify-between items-center py-2 border-b border-border">
          <View className="flex-row items-center gap-2">
            <View className="w-3.5 h-3.5 rounded-full bg-reservado" />
            <Text className="text-sm text-text font-semibold">Reservados</Text>
          </View>
          <Text className="text-sm font-bold text-text">{reserved}</Text>
        </View>
        
        <View className="flex-row justify-between items-center py-2">
          <View className="flex-row items-center gap-2">
            <View className="w-3.5 h-3.5 rounded-full bg-border" />
            <Text className="text-sm text-text font-semibold">Disponibles</Text>
          </View>
          <Text className="text-sm font-bold text-text">{total - assigned}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="gap-3 mb-12">
        <Pressable 
          onPress={() => router.push(`/raffle/${id}/numbers`)}
          className="bg-primary py-4 rounded-xl items-center shadow-md active:opacity-90"
        >
          <Text className="text-white font-extrabold text-sm">Ver Grilla de Números</Text>
        </Pressable>

        <Pressable 
          onPress={() => router.push(`/raffle/${id}/participants`)}
          className="bg-surface border border-border py-4 rounded-xl items-center active:bg-slate-50"
        >
          <Text className="text-text font-extrabold text-sm">Ver Participantes</Text>
        </Pressable>

        <Pressable 
          onPress={() => router.push(`/raffle/${id}/draw`)}
          className="bg-disponible py-4 rounded-xl items-center shadow-md active:opacity-90"
        >
          <Text className="text-white font-extrabold text-sm">Realizar Sorteo 🎲</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
