import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FinishRaffleModalProps {
  visible: boolean;
  winnerName: string | null;
  winnerTicketNum: number | null;
  drawDate: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

function getDaysInfo(drawDate: string): { text: string; isPast: boolean } {
  const [year, month, day] = drawDate.split('-').map(Number);
  const draw = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  draw.setHours(0, 0, 0, 0);
  const diffMs = draw.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return { text: `Faltan ${diffDays} ${diffDays === 1 ? 'día' : 'días'} para la fecha del sorteo.`, isPast: false };
  } else if (diffDays === 0) {
    return { text: 'La fecha del sorteo es hoy.', isPast: false };
  } else {
    const absDays = Math.abs(diffDays);
    return { text: `La rifa se cumplió hace ${absDays} ${absDays === 1 ? 'día' : 'días'}.`, isPast: true };
  }
}

export default function FinishRaffleModal({
  visible,
  winnerName,
  winnerTicketNum,
  drawDate,
  onClose,
  onConfirm,
  loading,
}: FinishRaffleModalProps) {
  const daysInfo = getDaysInfo(drawDate);
  const winnerDisplay = winnerTicketNum !== null && winnerTicketNum < 10
    ? `0${winnerTicketNum}`
    : `${winnerTicketNum ?? ''}`;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center p-6">
        <View className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-sm items-center shadow-2xl">
          <View className="w-16 h-16 bg-orangeLight rounded-full items-center justify-center mb-4 border border-orangeBorder">
            <Ionicons name="flag-outline" size={32} color="#F59E0B" />
          </View>

          <Text className="text-xl font-black text-app-dark text-center mb-2">Finalizar rifa</Text>

          {winnerName ? (
            <Text className="text-sm text-app-gray text-center mb-1">
              El ganador es{' '}
              <Text className="font-bold text-app-dark">{winnerName}</Text> -{' '}
              <Text className="font-bold text-app-dark">#{winnerDisplay}</Text>
            </Text>
          ) : (
            <Text className="text-sm text-app-gray text-center mb-1">
              No se ha realizado el sorteo aún.
            </Text>
          )}

          <Text className="text-sm text-app-gray text-center mb-6">{daysInfo.text}</Text>

          <Text className="text-xs font-semibold text-app-gray/70 text-center mb-5 -mt-2">
            Al finalizar la rifa, esta se moverá al historial y no podrá modificarse.
          </Text>

          <View className="flex-row gap-x-3 w-full">
            <Pressable
              onPress={onClose}
              disabled={loading}
              className="flex-1 bg-gray-100 py-3 rounded-xl items-center justify-center active:bg-gray-200"
            >
              <Text className="text-sm font-bold text-app-dark">Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              disabled={loading}
              className="flex-1 bg-reservado py-3 rounded-xl items-center justify-center active:opacity-80 flex-row gap-2"
            >
              {loading ? (
                <Text className="text-sm font-black text-white">Finalizando...</Text>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                  <Text className="text-sm font-black text-white">Finalizar</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
