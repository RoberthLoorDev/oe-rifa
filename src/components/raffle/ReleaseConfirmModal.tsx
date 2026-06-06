import React from 'react';
import { View, Text, Pressable, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ticket } from './types';

interface ReleaseConfirmModalProps {
  visible: boolean;
  ticket: Ticket | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ReleaseConfirmModal({
  visible,
  ticket,
  onClose,
  onConfirm,
}: ReleaseConfirmModalProps) {
  if (!ticket) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View 
        className="flex-1 items-center justify-center p-6"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        {/* Backdrop pressable to close when tapping outside */}
        <Pressable 
          className="absolute inset-0" 
          onPress={onClose} 
        />

        <View className="bg-white rounded-3xl p-6 w-full max-w-sm border border-gray-100 gap-y-5 relative z-10">
          <View className="items-center mt-2">
            <View className="w-14 h-14 bg-red-50 rounded-full items-center justify-center mb-3">
              <Ionicons name="warning-outline" size={30} color="#DC2626" />
            </View>
            <Text className="text-xl font-bold text-app-dark text-center">¿Liberar boleto?</Text>
            <Text className="text-sm text-gray-500 text-center mt-2 leading-relaxed">
              El boleto #{ticket.num < 10 ? `0${ticket.num}` : ticket.num} registrado a nombre de <Text className="font-extrabold text-app-dark">"{ticket.participant || 'Participante'}"</Text> será liberado y se desvinculará.
            </Text>
          </View>

          <View className="flex-row gap-3 mt-2">
            <Pressable
              onPress={onClose}
              className="flex-1 bg-gray-100 py-3.5 rounded-2xl items-center justify-center border border-gray-200/50 active:scale-95 transition-all"
              style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
            >
              <Text className="text-sm font-bold text-app-dark">Cancelar</Text>
            </Pressable>
            
            <Pressable
              onPress={onConfirm}
              className="flex-1 bg-red-500 py-3.5 rounded-2xl items-center justify-center active:scale-95 transition-all shadow-lg shadow-red-500/10"
              style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
            >
              <Text className="text-sm font-bold text-white">Liberar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
