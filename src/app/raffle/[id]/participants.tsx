import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ParticipantsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState<'TODOS' | 'PAGADO' | 'RESERVADO'>('TODOS');

  // Mock participants data
  const participants = [
    { id: '1', name: 'Juan Pérez', phone: '+51 987 654 321', numbers: [5, 10, 15], status: 'PAGADO' },
    { id: '2', name: 'María Gómez', phone: '+51 987 000 111', numbers: [7, 14], status: 'RESERVADO' },
    { id: '3', name: 'Carlos Rojas', phone: '+51 912 345 678', numbers: [20], status: 'PAGADO' },
    { id: '4', name: 'Ana Mendoza', phone: '', numbers: [21, 28], status: 'RESERVADO' },
  ];

  const filteredParticipants = participants.filter(p => filter === 'TODOS' || p.status === filter);

  return (
    <ScrollView className="flex-1 bg-background p-6">
      {/* Header */}
      <View className="mb-6 flex-row items-center gap-2">
        <Pressable onPress={() => router.back()} className="mr-2">
          <Text className="text-primary font-bold text-base">← Panel</Text>
        </Pressable>
        <Text className="text-xl font-black text-text">Participantes</Text>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row bg-surface p-1.5 rounded-xl border border-border gap-2 mb-6">
        {(['TODOS', 'PAGADO', 'RESERVADO'] as const).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setFilter(tab)}
            className={`flex-1 py-2 rounded-lg items-center ${filter === tab ? 'bg-primary' : 'bg-transparent'}`}
            style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
          >
            <Text className={`text-xs font-bold ${filter === tab ? 'text-white' : 'text-textMuted'}`}>
              {tab === 'TODOS' ? 'Todos' : tab === 'PAGADO' ? 'Pagados' : 'Reservados'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Search Bar */}
      <View className="mb-6">
        <TextInput
          placeholder="Buscar participante por nombre..."
          className="bg-surface border border-border px-4 py-3 rounded-xl text-text font-medium shadow-sm"
          placeholderTextColor="#94a3b8"
        />
      </View>

      {/* Participants List */}
      <View className="gap-4 mb-12">
        {filteredParticipants.map((p) => (
          <View key={p.id} className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
            <View className="flex-row justify-between items-start mb-2">
              <View>
                <Text className="text-base font-extrabold text-text">{p.name}</Text>
                {p.phone ? (
                  <Text className="text-xs text-textMuted mt-0.5">{p.phone}</Text>
                ) : (
                  <Text className="text-xs text-textMuted italic mt-0.5">Sin teléfono</Text>
                )}
              </View>
              <View className={`px-2.5 py-1 rounded-full ${p.status === 'PAGADO' ? 'bg-disponible/10' : 'bg-reservado/10'}`}>
                <Text className={`text-[10px] font-black uppercase ${p.status === 'PAGADO' ? 'text-disponible' : 'text-reservado'}`}>
                  {p.status}
                </Text>
              </View>
            </View>
            
            <View className="flex-row flex-wrap items-center gap-1.5 mt-2 pt-2.5 border-t border-border">
              <Text className="text-xs text-textMuted font-medium mr-1">Números:</Text>
              {p.numbers.map((n) => (
                <View key={n} className="bg-background px-2.5 py-1 rounded-lg border border-border">
                  <Text className="text-xs font-bold text-text">{n}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
