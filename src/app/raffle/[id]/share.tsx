import React, { useRef, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Platform, ActivityIndicator, Image, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useRaffleDetail } from '../../../hooks/useRaffleDetail';
import { useRaffleTickets } from '../../../hooks/useRaffleTickets';

export default function ExportShareScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const raffleId = Array.isArray(id) ? id[0] : id;

  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width, 500) - 32;
  const gridWidth = cardWidth - 72;

  const { raffle, loading: loadingDetail, error: errorDetail } = useRaffleDetail(raffleId || '');
  const { tickets, loading: loadingTickets, error: errorTickets } = useRaffleTickets(raffleId || '');

  const viewShotRef = useRef<any>(null);

  const loading = loadingDetail || loadingTickets;
  const error = errorDetail || errorTickets;

  const defaultImage = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&h=600&fit=crop';

  const total = raffle?.totalNumbers || 0;

  const gridParams = useMemo(() => {
    if (total <= 0) return { cols: 10, gap: 4, fontSize: 8, cellSize: 22 };

    let cols = 10;
    let gap = 4;
    let fontSize = 8;

    if (total <= 100) {
      cols = 10;
      gap = 4;
      fontSize = 9;
    } else if (total <= 250) {
      cols = 12;
      gap = 3;
      fontSize = 7.5;
    } else if (total <= 500) {
      cols = 15;
      gap = 2;
      fontSize = 6.5;
    } else {
      cols = 20;
      gap = 2;
      fontSize = 5.5;
    }

    const cellSize = Math.floor((gridWidth - (gap * (cols - 1))) / cols);
    return { cols, gap, fontSize, cellSize };
  }, [total, gridWidth]);

  const { cols, gap, fontSize, cellSize } = gridParams;

  const handleWebDownload = () => {
    if (!raffle) return;

    let canvasCols = 10;
    let canvasGap = 6;
    if (total <= 100) {
      canvasCols = 10;
      canvasGap = 6;
    } else if (total <= 250) {
      canvasCols = 12;
      canvasGap = 5;
    } else if (total <= 500) {
      canvasCols = 15;
      canvasGap = 4;
    } else {
      canvasCols = 20;
      canvasGap = 3;
    }

    const canvasRows = Math.ceil(total / canvasCols);
    const startX = 120;
    const canvasGridWidth = 960;
    const cellW = (canvasGridWidth - (canvasGap * (canvasCols - 1))) / canvasCols;
    const cellH = cellW;
    const gridHeight = (cellH + canvasGap) * canvasRows - canvasGap;

    const canvasWidth = 1200;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = 'normal 24px Arial';
    const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split(' ');
      let line = '';
      let currentY = y;
      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, x, currentY);
      return currentY;
    };

    const titleY = 100;
    let descEndY = titleY + 20;

    const testCanvas = document.createElement('canvas');
    const testCtx = testCanvas.getContext('2d');
    if (testCtx && raffle.description) {
      testCtx.font = 'normal 24px Arial';
      let words = raffle.description.split(' ');
      let line = '';
      let testLinesCount = 1;
      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = testCtx.measureText(testLine);
        if (metrics.width > 1000 && n > 0) {
          line = words[n] + ' ';
          testLinesCount++;
        } else {
          line = testLine;
        }
      }
      descEndY = titleY + 40 + (testLinesCount * 32);
    } else if (raffle.description) {
      descEndY = titleY + 72;
    }

    const imageStartY = descEndY + 30;
    const imageH = 1000;
    const badgeY = imageStartY + imageH + 50;
    const gridCardStartY = badgeY + 200;
    const drawGridStartY = gridCardStartY + 20;
    const canvasHeight = drawGridStartY + gridHeight + 80;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 54px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(raffle.title, 600, titleY);

    if (raffle.description) {
      ctx.fillStyle = '#64748B';
      ctx.font = 'normal 24px Arial';
      ctx.textAlign = 'center';
      wrapText(ctx, raffle.description, 600, titleY + 50, 1000, 32);
    }

    const priceText = `💵 BOLETO: $${raffle.price.toFixed(2)}`;
    const dateText = `📅 SORTEO: ${raffle.date}`;

    ctx.fillStyle = '#EFF6FF';
    ctx.beginPath();
    ctx.roundRect?.(300, badgeY, 600, 70, 35);
    ctx.fill();
    ctx.fillStyle = '#1D4ED8';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(priceText, 600, badgeY + 44);

    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.roundRect?.(300, badgeY + 90, 600, 70, 35);
    ctx.fill();
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(dateText, 600, badgeY + 90 + 44);

    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.roundRect?.(80, gridCardStartY, 1040, gridHeight + 40, 24);
    ctx.fill();
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    for (let i = 0; i < total; i++) {
      const col = i % canvasCols;
      const row = Math.floor(i / canvasCols);
      const x = startX + col * (cellW + canvasGap);
      const y = drawGridStartY + row * (cellH + canvasGap);

      const ticket = tickets[i];
      const status = ticket ? ticket.status : 'DISPONIBLE';

      let cellBg = '#DCFCE7';
      let cellBorder = '#A7F3D0';
      let cellTextColor = '#059669';
      let slashColor = 'rgba(220, 38, 38, 0.4)';

      const isAvailable = status === 'DISPONIBLE';

      if (!isAvailable) {
        ctx.globalAlpha = 0.2;
        cellBg = '#FEE2E2';
        cellBorder = '#FCA5A5';
        cellTextColor = '#DC2626';
        slashColor = '#DC2626';
      }

      ctx.fillStyle = cellBg;
      ctx.beginPath();
      ctx.roundRect?.(x, y, cellW, cellH, 6);
      ctx.fill();

      ctx.strokeStyle = cellBorder;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect?.(x, y, cellW, cellH, 6);
      ctx.stroke();

      ctx.fillStyle = cellTextColor;
      const canvasFontSize = Math.max(10, Math.floor(cellW * 0.45));
      ctx.font = `bold ${canvasFontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(i + 1), x + cellW / 2, y + cellH / 2);

      if (!isAvailable) {
        ctx.strokeStyle = slashColor;
        ctx.lineWidth = Math.max(1.5, cellW * 0.08);
        ctx.beginPath();
        ctx.moveTo(x + cellW * 0.2, y + cellH * 0.2);
        ctx.lineTo(x + cellW * 0.8, y + cellH * 0.8);
        ctx.stroke();
      }

      ctx.globalAlpha = 1.0;
    }

    const img = window.document.createElement('img');
    img.crossOrigin = 'anonymous';
    img.src = raffle.image || defaultImage;
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect?.(100, imageStartY, 1000, imageH, 24);
      ctx.clip();
      ctx.drawImage(img, 100, imageStartY, 1000, imageH);
      ctx.restore();

      if (raffle.product) {
        const boxHeight = 100;
        const boxY = imageStartY + imageH - boxHeight - 30;

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect?.(130, boxY, 940, boxHeight, 16);
        ctx.fill();

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 34px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Premio: ${raffle.product}`, 600, boxY + 60);
      }

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Promocion_${raffle.title.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    };
    img.onerror = () => {
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.roundRect?.(100, imageStartY, 1000, imageH, 24);
      ctx.fill();

      if (raffle.product) {
        const boxHeight = 100;
        const boxY = imageStartY + imageH - boxHeight - 30;

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect?.(130, boxY, 940, boxHeight, 16);
        ctx.fill();

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 34px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Premio: ${raffle.product}`, 600, boxY + 60);
      }

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Promocion_${raffle.title.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    };
  };

  const handleShare = async () => {
    if (Platform.OS === 'web') {
      handleWebDownload();
      return;
    }

    try {
      if (!viewShotRef.current) return;
      const uri = await viewShotRef.current.capture();

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `Compartir Rifa: ${raffle?.title}`,
          UTI: 'public.png'
        });
      } else {
        alert('La función de compartir no está disponible en este dispositivo.');
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al generar la imagen promocional.');
    }
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/raffle/${raffleId}`);
    }
  };

  if (loading || !raffle) {
    return (
      <View className="flex-1 bg-app-bg items-center justify-center">
        <ActivityIndicator size="large" color="#3B6FFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-app-bg items-center justify-center p-6">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="text-lg font-bold text-app-dark mt-4 text-center">{error}</Text>
        <Pressable 
          onPress={goBack}
          className="mt-6 bg-app-dark px-6 py-3 rounded-2xl active:scale-95 transition-all"
        >
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
          Esta tarjeta se generará dinámicamente con el estado actual de tus boletos para que la compartas en tus estados de WhatsApp.
        </Text>

        <View className="shadow-2xl rounded-3xl overflow-hidden mb-8 bg-white">
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.95 }}>
            <View 
              className="bg-white p-5"
              style={{ width: cardWidth }}
            >
              <View className="items-center mb-5 px-2">
                <Text className="text-3xl font-black text-slate-900 text-center tracking-tight leading-tight px-1" numberOfLines={2}>
                  {raffle.title}
                </Text>

                {raffle.description ? (
                  <Text className="text-sm font-semibold text-slate-500 text-center px-4 mt-2 max-w-[90%] leading-relaxed">
                    {raffle.description}
                  </Text>
                ) : null}
              </View>

              <View className="relative w-full mb-5">
                <Image 
                  source={{ uri: raffle.image || defaultImage }} 
                  className="rounded-3xl mx-auto"
                  style={{ 
                    width: cardWidth - 40, 
                    aspectRatio: 1 / 1
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
                  <Text className="text-slate-700 font-extrabold text-[12px] tracking-wide">
                    📅 SORTEO: {raffle.date}
                  </Text>
                </View>
              </View>

              <View 
                className="p-4 rounded-2xl border border-slate-100/80 mt-6 mb-2" 
                style={{ backgroundColor: '#F8FAFC' }}
              >
                <View 
                  className="flex-row flex-wrap justify-center" 
                  style={{ gap: gap }}
                >
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
                          opacity: isAvailable ? 1.0 : 0.2
                        }}
                      >
                        <Text 
                          className="font-black text-center"
                          style={{ 
                            fontSize: fontSize, 
                            color: textColor,
                            textDecorationLine: !isAvailable ? 'line-through' : 'none'
                          }}
                        >
                          {t.num}
                        </Text>

                        {!isAvailable && (
                          <View className="absolute inset-0 items-center justify-center pointer-events-none">
                            <View 
                              className="w-[1.2px] h-[75%] rotate-45" 
                              style={{ backgroundColor: slashColor }} 
                            />
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </ViewShot>
        </View>

        <Pressable
          onPress={handleShare}
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
