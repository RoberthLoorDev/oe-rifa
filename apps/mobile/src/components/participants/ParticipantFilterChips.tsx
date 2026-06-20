import React from 'react';
import { ScrollView, Pressable, Text, Platform } from 'react-native';

export type ParticipantFilter = 'TODOS' | 'PAGADO' | 'RESERVADO';

const filters = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'PAGADO', label: 'Pagados' },
  { key: 'RESERVADO', label: 'Reservados' },
] as const;

interface ParticipantFilterChipsProps {
  activeFilter: ParticipantFilter;
  onSelectFilter: (filter: ParticipantFilter) => void;
}

export default function ParticipantFilterChips({
  activeFilter,
  onSelectFilter,
}: ParticipantFilterChipsProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="pb-2 mb-4"
      contentContainerStyle={{ 
        flexDirection: 'row',
        gap: 8, 
        paddingRight: 16 
      }}
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.key;

        return (
          <Pressable
            key={filter.key}
            onPress={() => onSelectFilter(filter.key)}
            className={`whitespace-nowrap shrink-0 px-5 py-2.5 rounded-full border items-center justify-center ${
              filter.key === 'TODOS'
                ? isActive ? 'bg-app-dark border-transparent text-white' : 'bg-app-grayLight border-app-grayBorder'
                : filter.key === 'PAGADO'
                ? isActive ? 'bg-app-red border-transparent text-white' : 'bg-app-redLight border-app-redBorder'
                : isActive ? 'bg-app-orange border-transparent text-white' : 'bg-app-orangeLight border-app-orangeBorder'
            }`}
            style={Platform.OS === 'web' ? { outlineStyle: 'none' as any, cursor: 'pointer' } : undefined}
          >
            <Text 
              className={`text-xs font-bold ${
                filter.key === 'TODOS'
                  ? isActive ? 'text-white' : 'text-app-gray'
                  : filter.key === 'PAGADO'
                  ? isActive ? 'text-white' : 'text-app-red'
                  : isActive ? 'text-white' : 'text-app-orange'
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
