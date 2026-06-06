import React from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  // Mock data for initial rendering
  const activeRaffles = [
    {
      id: '1',
      title: 'Rifa Pro-Fondos Viaje de Estudios',
      description: 'Ayúdanos a recaudar fondos para el viaje de fin de curso.',
      price: 5.0,
      totalNumbers: 100,
      assignedNumbers: 68,
      paidNumbers: 45,
      reservedNumbers: 23,
      status: 'EN_CURSO',
      date: '30 Jun 2026',
    },
    {
      id: '2',
      title: 'Rifa Laptop Gamer ASUS Rog Strix',
      description: 'Sorteo benéfico para equipamiento tecnológico.',
      price: 10.0,
      totalNumbers: 200,
      assignedNumbers: 200,
      paidNumbers: 190,
      reservedNumbers: 10,
      status: 'COMPLETA',
      date: '15 Jun 2026',
    }
  ];

  return (
    <ScrollView className="flex-1 bg-background p-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-sm font-semibold text-textMuted uppercase tracking-wider">Dashboard</Text>
          <Text className="text-3xl font-extrabold text-text mt-0.5">Mis Rifas</Text>
        </View>
        <Pressable 
          onPress={() => router.push('/raffle/create')}
          className="bg-primary px-5 py-3 rounded-full shadow-lg active:opacity-80"
          style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
        >
          <Text className="text-white font-bold text-sm">+ Nueva Rifa</Text>
        </Pressable>
      </View>

      {/* Stats Cards */}
      <View className="flex-row gap-4 mb-8">
        <View className="flex-1 bg-surface p-5 rounded-2xl border border-border shadow-sm">
          <Text className="text-xs font-semibold text-textMuted uppercase">Activas</Text>
          <Text className="text-2xl font-black text-text mt-1">2</Text>
        </View>
        <View className="flex-1 bg-surface p-5 rounded-2xl border border-border shadow-sm">
          <Text className="text-xs font-semibold text-textMuted uppercase">Recaudado</Text>
          <Text className="text-2xl font-black text-disponible mt-1">$2,125</Text>
        </View>
      </View>

      {/* Raffle List Section */}
      <Text className="text-lg font-bold text-text mb-4">Rifas en curso</Text>
      
      <View className="gap-4">
        {activeRaffles.map((raffle) => {
          const progressPercent = Math.round((raffle.assignedNumbers / raffle.totalNumbers) * 100);
          
          return (
            <Pressable 
              key={raffle.id}
              onPress={() => router.push(`/raffle/${raffle.id}`)}
              className="bg-surface p-5 rounded-2xl border border-border shadow-sm active:bg-slate-50/50"
              style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 mr-2">
                  <Text className="text-base font-extrabold text-text" numberOfLines={1}>
                    {raffle.title}
                  </Text>
                  <Text className="text-xs text-textMuted mt-0.5" numberOfLines={1}>
                    Sorteo: {raffle.date}
                  </Text>
                </View>
                
                {/* Status Badge */}
                <View className={`px-2.5 py-1 rounded-full ${
                  raffle.status === 'COMPLETA' ? 'bg-disponible/10' : 'bg-primary/10'
                }`}>
                  <Text className={`text-[10px] font-black uppercase ${
                    raffle.status === 'COMPLETA' ? 'text-disponible' : 'text-primary'
                  }`}>
                    {raffle.status === 'COMPLETA' ? 'Completa' : 'En Curso'}
                  </Text>
                </View>
              </View>

              <Text className="text-sm text-textMuted mb-4" numberOfLines={2}>
                {raffle.description}
              </Text>

              {/* Progress Section */}
              <View className="mb-2">
                <View className="flex-row justify-between text-xs text-textMuted mb-1.5">
                  <Text className="text-xs text-textMuted font-medium">Progreso de Ventas</Text>
                  <Text className="text-xs font-bold text-text">{progressPercent}% ({raffle.assignedNumbers}/{raffle.totalNumbers})</Text>
                </View>
                <View className="w-full h-2.5 bg-border rounded-full overflow-hidden">
                  <View 
                    className={`h-full rounded-full ${raffle.status === 'COMPLETA' ? 'bg-disponible' : 'bg-primary'}`} 
                    style={{ width: `${progressPercent}%` }} 
                  />
                </View>
              </View>

              {/* Bottom Details */}
              <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-border">
                <Text className="text-xs text-textMuted">
                  Precio: <Text className="font-extrabold text-text">${raffle.price.toFixed(2)}</Text>
                </Text>
                <Text className="text-xs font-bold text-primary">Ver Dashboard →</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
