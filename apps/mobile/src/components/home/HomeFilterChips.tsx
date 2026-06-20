import React from 'react';
import { ScrollView, Pressable, Text, Platform } from 'react-native';

export type HomeFilter = 'Todas' | 'En curso' | 'Completas' | 'Cerradas';

const filters: HomeFilter[] = ['Todas', 'En curso', 'Completas', 'Cerradas'];

interface HomeFilterChipsProps {
  activeFilter: HomeFilter;
  onSelectFilter: (filter: HomeFilter) => void;
}

export default function HomeFilterChips({ activeFilter, onSelectFilter }: HomeFilterChipsProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      className="mb-6 -mx-6 px-6"
      contentContainerStyle={{ 
        flexDirection: 'row', 
        gap: 8, 
        paddingRight: 40 
      }}
    >
      {filters.map((filter) => {
        const isSelected = activeFilter === filter;
        return (
          <Pressable
            key={filter}
            onPress={() => onSelectFilter(filter)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold shadow-card transition-all ${
              isSelected ? 'bg-app-accent text-white' : 'bg-white text-gray-500'
            }`}
            style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
          >
            <Text className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-500'}`}>
              {filter}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
