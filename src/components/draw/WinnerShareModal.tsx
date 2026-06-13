import React, { useRef } from 'react';
import { Modal, Platform, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

interface WinnerShareModalProps {
  visible: boolean;
  raffleTitle: string;
  raffleProduct: string | null;
  winnerNumber: number | null;
  winnerName: string | null;
  onClose: () => void;
}

export default function WinnerShareModal({
  visible,
  raffleTitle,
  raffleProduct,
  winnerNumber,
  winnerName,
  onClose,
}: WinnerShareModalProps) {
  const viewShotRef = useRef<any>(null);

  const handleShareMobileImage = async () => {
    if (Platform.OS === 'web') return;
    try {
      if (!viewShotRef.current) return;
      const uri = await viewShotRef.current.capture();
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `Resultado Sorteo: ${raffleTitle}`,
          UTI: 'public.png',
        });
      } else {
        alert('La función de compartir no está disponible en este dispositivo.');
      }
    } catch (err) {
      console.error(err);
      alert('Error al generar la imagen oficial.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <View className="w-full max-w-sm">
          {/* Tarjeta de Ganador a Capturar */}
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.98 }}>
            <View className="bg-white border border-gray-200 rounded-3xl p-6 items-center relative overflow-hidden">
              {/* Emojis decorativos de celebración */}
              <Text style={{ position: 'absolute', top: 16, left: 16, fontSize: 28 }}>🎉</Text>
              <Text style={{ position: 'absolute', top: 20, right: 20, fontSize: 24 }}>✨</Text>
              <Text style={{ position: 'absolute', bottom: 20, left: 24, fontSize: 26 }}>🥳</Text>
              <Text style={{ position: 'absolute', bottom: 16, right: 16, fontSize: 30 }}>✨</Text>

              <View className="flex-row items-center gap-x-1 mb-2">
                <Text style={{ fontSize: 18 }}>🏆</Text>
                <Text className="text-xs font-bold text-app-gray tracking-widest uppercase">
                  Resultado Oficial
                </Text>
              </View>

              <Text className="text-2xl font-black text-app-dark text-center mb-1" numberOfLines={1}>
                {raffleTitle}
              </Text>
              {raffleProduct && (
                <Text className="text-base text-app-green font-extrabold mb-5 text-center">
                  Premio: {raffleProduct}
                </Text>
              )}

              {/* Círculo del Ganador */}
              <View className="w-44 h-44 rounded-full bg-blue-50 border border-blue-100 items-center justify-center mb-4">
                <Text className="text-7xl font-black text-app-dark">
                  {winnerNumber !== null && winnerNumber !== undefined
                    ? winnerNumber < 10
                      ? `0${winnerNumber}`
                      : winnerNumber
                    : ''}
                </Text>
              </View>

              <Text className="text-xs font-extrabold text-app-accent tracking-widest uppercase mb-1">
                Número Ganador
              </Text>
              <Text className="text-2xl font-black text-app-dark text-center mb-1">
                {winnerName || ''}
              </Text>
              <Text className="text-sm font-bold text-app-accent text-center mt-1">
                ¡Muchas Felicidades! 🎉
              </Text>
            </View>
          </ViewShot>

          {/* Acciones del Modal */}
          <View style={{ marginTop: 16 }}>
            <TouchableOpacity
              onPress={handleShareMobileImage}
              activeOpacity={0.7}
              style={[
                {
                  width: '100%',
                  backgroundColor: '#3B6FFF',
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  shadowOpacity: 0,
                  shadowOffset: { width: 0, height: 0 },
                  shadowRadius: 0,
                  elevation: 0,
                },
                Platform.OS === 'web' ? { cursor: 'pointer' } : undefined,
              ]}
            >
              <Ionicons name="share-social" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' }}>
                Compartir Imagen Oficial
              </Text>
            </TouchableOpacity>

            <View style={{ height: 12 }} />

            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={[
                {
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  paddingVertical: 14,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowOpacity: 0,
                  shadowOffset: { width: 0, height: 0 },
                  shadowRadius: 0,
                  elevation: 0,
                },
                Platform.OS === 'web' ? { cursor: 'pointer' } : undefined,
              ]}
            >
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#111827' }}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
