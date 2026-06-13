import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';
import { ActivityIndicator, Image, Platform, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import ShareTicketsGrid from '../../../components/share/ShareTicketsGrid';
import { useGridParams } from '../../../hooks/useGridParams';
import { useRaffleDetail } from '../../../hooks/useRaffleDetail';
import { useRaffleTickets } from '../../../hooks/useRaffleTickets';
import { useShareImage } from '../../../hooks/useShareImage';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&h=600&fit=crop';

export default function ExportShareScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const raffleId = Array.isArray(id) ? id[0] : id;

  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width, 500) - 32;
  const gridWidth = cardWidth - 52;

  const { raffle, loading: loadingDetail, error: errorDetail } = useRaffleDetail(raffleId || '');
  const { tickets, loading: loadingTickets, error: errorTickets } = useRaffleTickets(raffleId || '');

  const viewShotRef = useRef<any>(null);

  const loading = loadingDetail || loadingTickets;
  const error = errorDetail || errorTickets;

  const total = raffle?.totalNumbers || 0;
  const { gap, fontSize, cellSize } = useGridParams(total, gridWidth);

  const { shareImage } = useShareImage({ raffle, tickets, total, viewShotRef });

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/raffle/${raffleId}`);
    }
  };

  /* ── Estado: cargando ── */
  if (loading || !raffle) {
    return (
      <View className="flex-1 bg-app-bg items-center justify-center">
        <ActivityIndicator size="large" color="#3B6FFF" />
      </View>
    );
  }

  /* ── Estado: error ── */
  if (error) {
    return (
      <View className="flex-1 bg-app-bg items-center justify-center p-6">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="text-lg font-bold text-app-dark mt-4 text-center">{error}</Text>
        <Pressable onPress={goBack} className="mt-6 bg-app-dark px-6 py-3 rounded-2xl active:scale-95 transition-all">
          <Text className="text-white font-bold">Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-app-bg">
      <View
        className="bg-white px-4 pt-12 pb-4 flex-row items-center"
        style={{ borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}
      >
        <Pressable
          onPress={goBack}
          className="p-2 -ml-2 rounded-full active:bg-gray-100 transition"
          style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text className="text-xl font-bold text-app-dark mx-auto pr-8">Promocionar Rifa</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ alignItems: 'center', padding: 16, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-sm font-semibold text-app-gray text-center mb-6 px-4">
          Esta tarjeta se generará dinámicamente con el estado actual de tus boletos para que la compartas en tus estados de
          WhatsApp.
        </Text>

        <View className="shadow-2xl rounded-3xl overflow-hidden mb-8 bg-white">
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.95 }}>
            <View className="bg-white p-5" style={{ width: cardWidth }}>
              <View className="items-center mb-5 px-2">
                <Text
                  className="text-3xl font-black text-slate-900 text-center tracking-tight leading-tight px-1"
                  numberOfLines={2}
                >
                  {raffle.title}
                </Text>

                {raffle.description ? (
                  <Text className="text-sm font-semibold text-slate-500 text-center px-4 mt-1 max-w-[90%] leading-relaxed">
                    {raffle.description}
                  </Text>
                ) : null}
              </View>

              <View className="relative w-full mb-5">
                <Image
                  source={{ uri: raffle.image || DEFAULT_IMAGE }}
                  className="rounded-3xl mx-auto"
                  style={{
                    width: cardWidth - 100,
                    aspectRatio: 1 / 1,
                  }}
                  resizeMode="cover"
                />

                {raffle.product && (
                  <View
                    className="absolute bottom-4 left-4 right-4 bg-white px-4 py-3 rounded-2xl shadow-lg border border-slate-100"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <Text className="text-sm font-black text-slate-900 text-center uppercase tracking-wider" numberOfLines={1}>
                      Premio: {raffle.product}
                    </Text>
                  </View>
                )}
              </View>

              <View className="w-full gap-y-2 items-center">
                <View className="w-full max-w-[280px] bg-blue-50 px-4 py-2.5 rounded-full border border-blue-100/50 items-center">
                  <Text className="text-blue-700 font-extrabold text-[12px] tracking-wide">
                    💵 BOLETO: ${raffle.price.toFixed(2)}
                  </Text>
                </View>
                <View className="w-full max-w-[280px] bg-slate-50 px-4 py-2.5 rounded-full border border-slate-100 items-center">
                  <Text className="text-slate-700 font-extrabold text-[12px] tracking-wide">📅 SORTEO: {raffle.date}</Text>
                </View>
              </View>

              <ShareTicketsGrid tickets={tickets} cellSize={cellSize} fontSize={fontSize} gap={gap} />
            </View>
          </ViewShot>
        </View>

        <Pressable
          onPress={shareImage}
          className="w-full max-w-[360px] bg-app-accent py-4 rounded-2xl items-center justify-center flex-row gap-x-2.5 shadow-lg shadow-app-accent/25 active:scale-[0.98] transition-all"
          style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
        >
          <Ionicons name="share-social" size={20} color="#FFFFFF" />
          <Text className="text-white font-bold text-base">
            {Platform.OS === 'web' ? 'Descargar Imagen Promocional' : 'Compartir en WhatsApp / Guardar'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
