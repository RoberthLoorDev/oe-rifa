import { useMemo } from 'react';

interface GridParams {
  cols: number;
  gap: number;
  fontSize: number;
  cellSize: number;
}

export function useGridParams(total: number, gridWidth: number): GridParams {
  return useMemo(() => {
    if (total <= 0) return { cols: 10, gap: 4, fontSize: 8, cellSize: 22 };

    let cols = 10;
    let gap = 4;
    let fontSize = 12;

    if (total <= 100) {
      cols = 10;
      gap = 4;
      fontSize = 14;
    } else if (total <= 250) {
      cols = 12;
      gap = 3;
      fontSize = 11.5;
    } else if (total <= 500) {
      cols = 15;
      gap = 2;
      fontSize = 10.5;
    } else {
      cols = 20;
      gap = 2;
      fontSize = 9.5;
    }

    const cellSize = Math.floor((gridWidth - gap * (cols - 1)) / cols);
    return { cols, gap, fontSize, cellSize };
  }, [total, gridWidth]);
}
