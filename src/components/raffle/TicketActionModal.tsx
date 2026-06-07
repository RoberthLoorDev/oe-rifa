import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  Platform, 
  Modal, 
  TextInput, 
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ticket } from './types';

interface TicketActionModalProps {
  visible: boolean;
  ticket: Ticket | null;
  selectedNums?: number[];
  onClose: () => void;
  onSave: (isPaid: boolean, participantName: string, participantPhone: string) => void;
  onReleasePress: () => void;
}

export default function TicketActionModal({
  visible,
  ticket,
  selectedNums = [],
  onClose,
  onSave,
  onReleasePress,
}: TicketActionModalProps) {
  const [participantName, setParticipantName] = useState('');
  const [participantPhone, setParticipantPhone] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState('');

  const isBulk = ticket === null;

  useEffect(() => {
    if (visible) {
      if (ticket) {
        setParticipantName(ticket.participant || '');
        setParticipantPhone(ticket.phone || '');
        setIsPaid(ticket.status === 'PAGADO');
      } else {
        setParticipantName('');
        setParticipantPhone('');
        setIsPaid(false);
      }
      setError('');
    }
  }, [ticket, visible]);

  const handleSave = () => {
    if (!participantName.trim()) {
      setError('El nombre del participante es obligatorio.');
      return;
    }
    onSave(isPaid, participantName, participantPhone);
  };

  const webInputStyle = Platform.OS === 'web' ? { outlineStyle: 'none' as any } : undefined;

  if (!ticket && selectedNums.length === 0) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <View 
          className="flex-1 justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <Pressable 
            className="absolute inset-0" 
            onPress={onClose} 
          />
          
          <View className="bg-white rounded-t-[2.5rem] p-6 pb-10 shadow-sheet gap-y-5">
            <View className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto" />

            <View className="flex-row justify-between items-center mt-2">
              <View className="flex-1 pr-2">
                <Text className="text-sm text-app-gray font-bold uppercase tracking-wider">
                  {isBulk ? 'Asignación Masiva' : 'Gestión de Boleto'}
                </Text>
                <Text className="text-2xl font-black text-app-dark" numberOfLines={1}>
                  {isBulk 
                    ? `Asignar Boletos` 
                    : `Boleto #${ticket.num < 10 ? `0${ticket.num}` : ticket.num}`
                  }
                </Text>
              </View>
              <View className={`px-3 py-1.5 rounded-xl ${
                isBulk 
                  ? 'bg-blue-50' 
                  : ticket.status === 'PAGADO' 
                  ? 'bg-app-redLight' 
                  : ticket.status === 'RESERVADO' 
                  ? 'bg-app-orangeLight' 
                  : 'bg-app-greenLight'
              }`}>
                <Text className={`text-xs font-black uppercase ${
                  isBulk 
                    ? 'text-app-accent' 
                    : ticket.status === 'PAGADO' 
                    ? 'text-app-red' 
                    : ticket.status === 'RESERVADO' 
                    ? 'text-app-orange' 
                    : 'text-app-green'
                }`}>
                  {isBulk 
                    ? `Múltiple (${selectedNums.length})` 
                    : ticket.status === 'DISPONIBLE' 
                    ? 'Libre' 
                    : ticket.status
                  }
                </Text>
              </View>
            </View>

            {isBulk && selectedNums.length > 0 && (
              <View className="gap-y-2">
                <Text className="text-xs font-bold text-app-gray uppercase tracking-wider ml-1">
                  Números seleccionados:
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  contentContainerStyle={{ gap: 8 }}
                  className="py-1"
                >
                  {selectedNums.map((num) => (
                    <View key={num} className="bg-blue-50/50 border border-blue-100/30 px-3.5 py-1.5 rounded-xl">
                      <Text className="font-extrabold text-app-accent text-sm">
                        #{num < 10 ? `0${num}` : num}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <View className="gap-y-3 mt-1">
              <View>
                <Text className="text-sm font-semibold text-app-gray mb-1.5 ml-1">Nombre del participante</Text>
                <TextInput
                  value={participantName}
                  onChangeText={(val) => {
                    setParticipantName(val);
                    if (val.trim()) setError('');
                  }}
                  placeholder="Ej: Juan Pérez"
                  placeholderTextColor="#9CA3AF"
                  style={webInputStyle}
                  className="bg-app-bg border border-transparent focus:border-app-accent focus:bg-white py-3 px-4 rounded-xl text-base outline-none transition"
                />
                {error ? (
                  <Text className="text-xs text-app-red mt-1 ml-1 font-semibold">{error}</Text>
                ) : null}
              </View>
              <View>
                <Text className="text-sm font-semibold text-app-gray mb-1.5 ml-1">Teléfono (opcional)</Text>
                <TextInput
                  value={participantPhone}
                  onChangeText={setParticipantPhone}
                  placeholder="Ej: +51 987 654 321"
                  placeholderTextColor="#9CA3AF"
                  style={webInputStyle}
                  className="bg-app-bg border border-transparent focus:border-app-accent focus:bg-white py-3 px-4 rounded-xl text-base outline-none transition"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <Pressable 
              onPress={() => setIsPaid(!isPaid)} 
              className="flex-row items-center justify-between bg-gray-50 p-4 rounded-2xl active:bg-gray-100/50 mt-1"
              style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
            >
              <View className="flex-row items-center gap-3 flex-1 pr-4">
                <View className={`w-10 h-10 rounded-full items-center justify-center ${isPaid ? 'bg-app-accent/10' : 'bg-gray-100'}`}>
                  <Ionicons 
                    name={isPaid ? 'cash-outline' : 'card-outline'} 
                    size={20} 
                    color={isPaid ? '#3B6FFF' : '#9CA3AF'} 
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-app-dark">¿Pago completado?</Text>
                  <Text className="text-sm text-app-gray mt-1">
                    {isPaid ? 'Boletos pagados por completo' : 'Boletos apartados (pendientes de pago)'}
                  </Text>
                </View>
              </View>
              
              <View className={`w-12 h-7 rounded-full p-1 justify-center ${isPaid ? 'bg-app-accent items-end' : 'bg-gray-300 items-start'}`}>
                <View className="w-5 h-5 bg-white rounded-full shadow-sm" />
              </View>
            </Pressable>

            {!isBulk && ticket.status !== 'DISPONIBLE' && (
              <Pressable
                onPress={onReleasePress}
                className="w-full bg-red-50 py-3.5 rounded-2xl items-center justify-center active:bg-red-100 transition-all mt-1"
                style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
              >
                <Text className="text-sm font-bold text-app-red">Liberar boleto (Disponible)</Text>
              </Pressable>
            )}

            <View className="flex-row gap-3 mt-4">
              <Pressable
                onPress={onClose}
                className="flex-1 bg-gray-100 py-3.5 rounded-2xl items-center justify-center active:scale-95 transition-all"
                style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
              >
                <Text className="text-sm font-bold text-app-dark">Cancelar</Text>
              </Pressable>
              
              <Pressable
                onPress={handleSave}
                className="flex-1 bg-app-accent py-3.5 rounded-2xl items-center justify-center active:scale-95 transition-all shadow-lg shadow-app-accent/10"
                style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
              >
                <Text className="text-sm font-bold text-white">Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
