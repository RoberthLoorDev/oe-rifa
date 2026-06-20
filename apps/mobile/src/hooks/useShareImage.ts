import { useCallback } from 'react';
import { Platform } from 'react-native';
import * as Sharing from 'expo-sharing';
import { RaffleDetailModel } from '../types/raffle';
import { Ticket } from '../components/raffle/types';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&h=600&fit=crop';

interface UseShareImageParams {
  raffle: RaffleDetailModel | null;
  tickets: Ticket[];
  total: number;
  viewShotRef: React.RefObject<any>;
}

export function useShareImage({ raffle, tickets, total, viewShotRef }: UseShareImageParams) {
  const handleWebDownload = useCallback(() => {
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
    const cellW = (canvasGridWidth - canvasGap * (canvasCols - 1)) / canvasCols;
    const cellH = cellW;
    const gridHeight = (cellH + canvasGap) * canvasRows - canvasGap;

    const canvasWidth = 1200;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = 'normal 24px Arial';
    const wrapText = (
      context: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number,
    ) => {
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
      descEndY = titleY + 40 + testLinesCount * 32;
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
    img.src = raffle.image || DEFAULT_IMAGE;
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
  }, [raffle, tickets, total]);

  const shareImage = useCallback(async () => {
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
          UTI: 'public.png',
        });
      } else {
        alert('La función de compartir no está disponible en este dispositivo.');
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al generar la imagen promocional.');
    }
  }, [handleWebDownload, raffle, viewShotRef]);

  return { shareImage };
}
