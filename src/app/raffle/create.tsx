import React from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

export default function CreateRaffleScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="mb-6 flex-row items-center gap-2">
        <Pressable onPress={() => router.back()} className="mr-2">
          <Text className="text-primary font-bold text-base">← Atrás</Text>
        </Pressable>
        <Text className="text-2xl font-black text-text">Crear Nueva Rifa</Text>
      </View>

      <View className="bg-surface p-5 rounded-2xl border border-border shadow-sm gap-5">
        <View>
          <Text className="text-xs font-bold text-textMuted uppercase mb-1.5">Título de la Rifa</Text>
          <TextInput 
            placeholder="Ej. Rifa de Computadora ASUS"
            className="bg-background border border-border px-4 py-3 rounded-xl text-text font-medium"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View>
          <Text className="text-xs font-bold text-textMuted uppercase mb-1.5">Descripción</Text>
          <TextInput 
            placeholder="Detalles sobre el sorteo o el producto..."
            multiline
            numberOfLines={3}
            className="bg-background border border-border px-4 py-3 rounded-xl text-text font-medium text-left"
            textAlignVertical="top"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1">
            <Text className="text-xs font-bold text-textMuted uppercase mb-1.5">Precio por Número</Text>
            <TextInput 
              placeholder="5.00"
              keyboardType="numeric"
              className="bg-background border border-border px-4 py-3 rounded-xl text-text font-medium"
              placeholderTextColor="#94a3b8"
            />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold text-textMuted uppercase mb-1.5">Cantidad de Números</Text>
            <TextInput 
              placeholder="100"
              keyboardType="numeric"
              className="bg-background border border-border px-4 py-3 rounded-xl text-text font-medium"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View className="pt-4 border-t border-border">
          <Pressable 
            onPress={() => router.back()}
            className="bg-primary py-4 rounded-xl items-center shadow-md active:opacity-90"
          >
            <Text className="text-white font-extrabold text-base">Crear Rifa</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
