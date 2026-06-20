import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ticket } from '../raffle/types';

interface OverwriteConfirmModalProps {
  visible: boolean;
  winner: Ticket | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function OverwriteConfirmModal({
  visible,
  winner,
  onClose,
  onConfirm,
}: OverwriteConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center p-6">
        <View className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-sm items-center shadow-2xl">
          <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4 border border-red-100">
            <Ionicons name="warning" size={32} color="#EF4444" />
          </View>

          <Text className="text-xl font-black text-app-dark text-center mb-2">¿Realizar nuevo sorteo?</Text>
          <Text className="text-sm text-app-gray text-center mb-6">
            Ya se ha seleccionado a un ganador ({winner ? (winner.num < 10 ? `0${winner.num}` : winner.num) : ''} -{' '}
            {winner?.participant}). Si continúas, se descartará este resultado para iniciar un nuevo sorteo.
          </Text>

          <View className="flex-row gap-x-3 w-full">
            <Pressable
              onPress={onClose}
              className="flex-1 bg-gray-100 py-3 rounded-xl items-center justify-center active:bg-gray-200"
            >
              <Text className="text-sm font-bold text-app-dark">Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              className="flex-1 bg-red-600 py-3 rounded-xl items-center justify-center active:bg-red-700"
            >
              <Text className="text-sm font-black text-white">Continuar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
