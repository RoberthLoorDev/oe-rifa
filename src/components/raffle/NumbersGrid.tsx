import React from 'react';
import { View, Text, Pressable, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ticket } from './types';

interface NumbersGridProps {
  tickets: Ticket[];
  onPressTicket: (ticket: Ticket) => void;
  selectedNums?: number[];
}

export default function NumbersGrid({ tickets, onPressTicket, selectedNums = [] }: NumbersGridProps) {
  const { width } = useWindowDimensions();

  const containerWidth = Math.min(width, 800) - 32;
  const gridPadding = 16;
  const gapSize = 8;
  const availableGridWidth = containerWidth - (gridPadding * 2);
  const itemWidth = (availableGridWidth - (gapSize * 4)) / 5;

  return (
    <View className="bg-gray-50 rounded-3xl p-4 border border-gray-100 shadow-sm">
      {tickets.length === 0 ? (
        <View className="py-12 items-center justify-center">
          <Text className="text-sm font-semibold text-app-gray text-center">
            No hay números en este estado.
          </Text>
        </View>
      ) : (
        <View 
          className="flex-row flex-wrap" 
          style={{ gap: gapSize }}
        >
          {tickets.map((item) => {
            const isSelected = selectedNums.includes(item.num);
            return (
              <Pressable
                key={item.num}
                onPress={() => onPressTicket(item)}
                className={`items-center justify-center rounded-xl border active:scale-95 transition-all relative ${
                  isSelected
                    ? 'bg-blue-50 border-app-accent'
                    : item.status === 'DISPONIBLE'
                    ? 'bg-app-greenLight border-app-greenBorder'
                    : item.status === 'RESERVADO'
                    ? 'bg-app-orangeLight border-app-orangeBorder'
                    : 'bg-app-redLight border-app-redBorder'
                }`}
                style={[
                  { width: itemWidth, height: itemWidth },
                  Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined
                ]}
              >
                <View style={isSelected ? { transform: [{ scale: 0.82 }] } : undefined}>
                  <Text 
                    className={`font-extrabold text-base ${
                      isSelected
                        ? 'text-app-accent'
                        : item.status === 'DISPONIBLE'
                        ? 'text-app-green'
                        : item.status === 'RESERVADO'
                        ? 'text-app-orange'
                        : 'text-app-red'
                    }`}
                  >
                    {item.num < 10 ? `0${item.num}` : item.num}
                  </Text>
                </View>

                {isSelected && (
                  <View className="absolute bottom-0.5 right-0.5 bg-app-accent rounded-full w-5 h-5 items-center justify-center shadow-md border-2 border-white z-10">
                    <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
