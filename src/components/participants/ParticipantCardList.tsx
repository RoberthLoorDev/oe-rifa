import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, Text, View } from 'react-native';
import { Participant } from './types';

interface ParticipantCardListProps {
  participants: Participant[];
}

export default function ParticipantCardList({ participants }: ParticipantCardListProps) {
  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone) {
      Linking.openURL(`https://wa.me/${cleanPhone}`).catch((err) => {
        console.error('Error opening WhatsApp URL:', err);
      });
    }
  };

  return (
    <View className="gap-y-4 mb-12">
      {participants.length === 0 ? (
        <View className="bg-white p-8 rounded-3xl border border-gray-100 shadow-card items-center justify-center">
          <Text className="text-sm font-semibold text-app-gray text-center">No se encontraron participantesssssssss.</Text>
        </View>
      ) : (
        participants.map((p) => (
          <View key={p.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-card flex-col gap-y-3">
            {/* Header info */}
            <View className="flex-row justify-between items-center">
              <View className="flex-1 min-w-0 pr-4">
                <Text className="text-base font-extrabold text-app-dark truncate" numberOfLines={1}>
                  {p.name}
                </Text>
              </View>
              <View
                className={`px-2.5 py-1 rounded-lg border ${
                  p.status === 'PAGADO' ? 'bg-app-redLight border-app-redBorder' : 'bg-app-orangeLight border-app-orangeBorder'
                }`}
              >
                <Text className={`text-xs font-black uppercase ${p.status === 'PAGADO' ? 'text-app-red' : 'text-app-orange'}`}>
                  {p.status}
                </Text>
              </View>
            </View>

            {/* Numbers list & phone card */}
            <View className="flex-row flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100/50">
              {/* Left side: numbers list */}
              <View className="flex-row flex-wrap items-center gap-1.5 flex-1 min-w-[150px]">
                <Text className="text-xs text-app-gray font-bold uppercase mr-1">Números:</Text>
                {p.numbers.map((n) => (
                  <View key={n} className="bg-app-bg px-2.5 py-1 rounded-xl border border-gray-200/50">
                    <Text className="text-xs font-extrabold text-app-dark">{n < 10 ? `0${n}` : n}</Text>
                  </View>
                ))}
              </View>

              {/* Right side: WhatsApp button */}
              {p.phone ? (
                <Pressable
                  onPress={() => handleWhatsApp(p.phone)}
                  className="flex-row items-center bg-app-greenLight border border-app-greenBorder px-3 py-1.5 rounded-xl gap-x-1.5 active:opacity-75"
                  style={{ outlineStyle: 'none' as any }}
                >
                  <Ionicons name="logo-whatsapp" size={15} color="#059669" />
                  <Text className="text-sm font-bold text-app-green">{p.phone}</Text>
                </Pressable>
              ) : (
                <View className="flex-row items-center bg-app-grayLight border border-app-grayBorder px-3 py-1.5 rounded-xl">
                  <Text className="text-xs font-bold text-app-gray italic">Sin teléfono</Text>
                </View>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );
}
