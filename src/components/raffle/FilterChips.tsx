import React from 'react';
import { ScrollView, Pressable, Text, Platform } from 'react-native';

const filters = [
  { key: 'ALL', label: 'Todos' },
  { key: 'DISPONIBLE', label: 'Disponibles' },
  { key: 'RESERVADO', label: 'Reservados' },
  { key: 'PAGADO', label: 'Pagados' },
] as const;

interface FilterChipsProps {
  selectedFilter: 'ALL' | 'DISPONIBLE' | 'RESERVADO' | 'PAGADO';
  onSelectFilter: (filter: 'ALL' | 'DISPONIBLE' | 'RESERVADO' | 'PAGADO') => void;
}

export default function FilterChips({ selectedFilter, onSelectFilter }: FilterChipsProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="pb-2"
      contentContainerStyle={{ 
        flexDirection: 'row',
        gap: 8, 
        paddingRight: 16 
      }}
    >
      {filters.map((filter) => {
        const isActive = selectedFilter === filter.key;

        return (
          <Pressable
            key={filter.key}
            onPress={() => onSelectFilter(filter.key)}
            className={`whitespace-nowrap shrink-0 px-5 py-2.5 rounded-full border items-center justify-center ${
              filter.key === 'ALL'
                ? isActive ? 'bg-app-dark border-transparent text-white' : 'bg-app-grayLight border-app-grayBorder'
                : filter.key === 'DISPONIBLE'
                ? isActive ? 'bg-app-green border-transparent text-white' : 'bg-app-grayLight border-app-grayBorder'
                : filter.key === 'RESERVADO'
                ? isActive ? 'bg-app-orange border-transparent text-white' : 'bg-app-orangeLight border-app-orangeBorder'
                : isActive ? 'bg-app-red border-transparent text-white' : 'bg-app-redLight border-app-redBorder'
            }`}
            style={Platform.OS === 'web' ? { outlineStyle: 'none' as any, cursor: 'pointer' } : undefined}
          >
            <Text 
              className={`text-xs font-bold ${
                filter.key === 'ALL'
                  ? isActive ? 'text-white' : 'text-app-gray'
                  : filter.key === 'DISPONIBLE'
                  ? isActive ? 'text-white' : 'text-app-gray'
                  : filter.key === 'RESERVADO'
                  ? isActive ? 'text-white' : 'text-app-orange'
                  : isActive ? 'text-white' : 'text-app-red'
              }`}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
