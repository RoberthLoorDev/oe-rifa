import React from 'react';
import { View, Text, Pressable, Platform, useWindowDimensions } from 'react-native';
import { Ticket } from './types';

interface NumbersGridProps {
  tickets: Ticket[];
  onPressTicket: (ticket: Ticket) => void;
}

export default function NumbersGrid({ tickets, onPressTicket }: NumbersGridProps) {
  const { width } = useWindowDimensions();

  // Calculate items size for 5 columns layout dynamically to fit screen sizes perfectly
  const containerWidth = Math.min(width, 800) - 32; // Screen width - horizontal page padding (16*2)
  const gridPadding = 16; // Padding inside the gray container
  const gapSize = 8; // Gaps size in pixels
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
          {tickets.map((item) => (
            <Pressable
              key={item.num}
              onPress={() => onPressTicket(item)}
              className={`items-center justify-center rounded-xl border active:scale-95 transition-all ${
                item.status === 'DISPONIBLE'
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
              <Text 
                className={`font-extrabold text-base ${
                  item.status === 'DISPONIBLE'
                    ? 'text-app-green'
                    : item.status === 'RESERVADO'
                    ? 'text-app-orange'
                    : 'text-app-red'
                }`}
              >
                {item.num < 10 ? `0${item.num}` : item.num}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
