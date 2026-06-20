import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ticket } from '../raffle/types';

interface ManualWinnerModalProps {
  visible: boolean;
  eligibleTickets: Ticket[];
  onClose: () => void;
  onSelect: (ticket: Ticket) => void;
}

export default function ManualWinnerModal({
  visible,
  eligibleTickets,
  onClose,
  onSelect,
}: ManualWinnerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center p-6">
        <View className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-sm h-[80%] max-h-[500px]">
          <View className="flex-row justify-between items-center mb-4 pb-2 border-b border-gray-100">
            <Text className="text-lg font-black text-app-dark">Asignar Ganador Manual</Text>
            <Pressable
              onPress={onClose}
              className="p-1.5 bg-gray-100 rounded-full active:bg-gray-200"
            >
              <Ionicons name="close" size={20} color="#111827" />
            </Pressable>
          </View>

          <Text className="text-sm text-app-gray mb-4">
            Selecciona un participante de la lista de boletos elegibles para asignarlo directamente como ganador del sorteo:
          </Text>

          {eligibleTickets.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-sm font-bold text-app-gray text-center">
                No hay boletos elegibles disponibles para el sorteo.
              </Text>
            </View>
          ) : (
            <ScrollView className="flex-1 pr-1" showsVerticalScrollIndicator={true}>
              <View className="gap-y-2">
                {eligibleTickets.map((t) => (
                  <Pressable
                    key={t.num}
                    onPress={() => onSelect(t)}
                    className="flex-row items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-2xl active:bg-gray-100"
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 rounded bg-gray-200 items-center justify-center border border-gray-300">
                        <Text className="text-app-dark font-black text-sm">
                          {t.num < 10 ? `0${t.num}` : t.num}
                        </Text>
                      </View>
                      <Text className="text-base font-bold text-app-dark">{t.participant}</Text>
                    </View>
                    <Text className="text-xs font-black uppercase text-app-accent">
                      Seleccionar
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
