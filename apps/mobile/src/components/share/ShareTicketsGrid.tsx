import { Text, View } from 'react-native';
import { Ticket } from '../raffle/types';

interface ShareTicketsGridProps {
  tickets: Ticket[];
  cellSize: number;
  fontSize: number;
  gap: number;
}

export default function ShareTicketsGrid({ tickets, cellSize, fontSize, gap }: ShareTicketsGridProps) {
  return (
    <View className="rounded-2xl mt-6 mb-2">
      <View className="flex-row flex-wrap justify-center" style={{ gap }}>
        {tickets.map((t, idx) => {
          const isAvailable = t.status === 'DISPONIBLE';

          let bgColor = '#DCFCE7';
          let borderColor = '#A7F3D0';
          let textColor = '#059669';
          let slashColor = 'rgba(220, 38, 38, 0.4)';

          if (!isAvailable) {
            bgColor = '#FEE2E2';
            borderColor = '#FCA5A5';
            textColor = '#DC2626';
            slashColor = 'rgba(220, 38, 38, 0.4)';
          }

          return (
            <View
              key={idx}
              className="items-center justify-center rounded"
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: bgColor,
                borderWidth: 0.5,
                borderColor: borderColor,
                opacity: isAvailable ? 1.0 : 0.2,
              }}
            >
              <Text
                className="font-black text-center"
                style={{
                  fontSize: fontSize,
                  color: textColor,
                  textDecorationLine: !isAvailable ? 'line-through' : 'none',
                }}
              >
                {t.num}
              </Text>

              {!isAvailable && (
                <View className="absolute inset-0 items-center justify-center pointer-events-none">
                  <View className="w-[1.2px] h-[75%] rotate-45" style={{ backgroundColor: slashColor }} />
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
