import React from 'react';
import { View, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ParticipantSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function ParticipantSearchBar({
  value,
  onChangeText,
}: ParticipantSearchBarProps) {
  const webInputStyle = Platform.OS === 'web' ? { outlineStyle: 'none' as any } : undefined;

  return (
    <View className="relative justify-center mb-6">
      <View className="absolute left-4 z-10">
        <Ionicons name="search-outline" size={20} color="#9CA3AF" />
      </View>
      <TextInput 
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar participante por nombre..." 
        placeholderTextColor="#9CA3AF"
        style={webInputStyle}
        className="w-full bg-white border-none py-3.5 pl-12 pr-4 rounded-2xl shadow-card text-base text-app-dark"
      />
    </View>
  );
}
