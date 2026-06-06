import React from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function EditRaffleScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock initial values
  const defaultTitle = id === '2' ? 'Rifa Laptop Gamer ASUS Rog Strix' : 'Rifa Pro-Fondos Viaje de Estudios';
  const defaultDesc = id === '2' ? 'Sorteo benéfico para equipamiento tecnológico.' : 'Ayúdanos a recaudar fondos para el viaje de fin de curso.';
  const defaultPrice = id === '2' ? '10.00' : '5.00';
  const defaultNumbers = id === '2' ? '200' : '100';

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="mb-6 flex-row items-center gap-2">
        <Pressable onPress={() => router.back()} className="mr-2">
          <Text className="text-primary font-bold text-base">← Atrás</Text>
        </Pressable>
        <Text className="text-2xl font-black text-text">Editar Rifa</Text>
      </View>

      <View className="bg-surface p-5 rounded-2xl border border-border shadow-sm gap-5">
        <View>
          <Text className="text-xs font-bold text-textMuted uppercase mb-1.5">Título de la Rifa</Text>
          <TextInput 
            defaultValue={defaultTitle}
            className="bg-background border border-border px-4 py-3 rounded-xl text-text font-medium"
          />
        </View>

        <View>
          <Text className="text-xs font-bold text-textMuted uppercase mb-1.5">Descripción</Text>
          <TextInput 
            defaultValue={defaultDesc}
            multiline
            numberOfLines={3}
            className="bg-background border border-border px-4 py-3 rounded-xl text-text font-medium text-left"
            textAlignVertical="top"
          />
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1">
            <Text className="text-xs font-bold text-textMuted uppercase mb-1.5">Precio por Número</Text>
            <TextInput 
              defaultValue={defaultPrice}
              keyboardType="numeric"
              className="bg-background border border-border px-4 py-3 rounded-xl text-text font-medium"
            />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold text-textMuted uppercase mb-1.5">Cantidad de Números</Text>
            <TextInput 
              defaultValue={defaultNumbers}
              keyboardType="numeric"
              className="bg-background border border-border px-4 py-3 rounded-xl text-text font-medium"
            />
          </View>
        </View>

        <View className="pt-4 border-t border-border flex-row gap-3">
          <Pressable 
            onPress={() => router.back()}
            className="flex-1 bg-surface border border-border py-4 rounded-xl items-center active:bg-slate-50"
          >
            <Text className="text-text font-bold text-base">Cancelar</Text>
          </Pressable>
          <Pressable 
            onPress={() => router.back()}
            className="flex-1 bg-primary py-4 rounded-xl items-center shadow-md active:opacity-90"
          >
            <Text className="text-white font-extrabold text-base">Guardar</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
