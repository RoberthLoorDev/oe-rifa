import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { initDatabase } from '../database/db';
import '../global.css';

// Disable strict mode warning triggered by internal template packages
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  useEffect(() => {
    // Inicializa la base de datos local SQLite al iniciar la aplicación
    initDatabase();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="raffle/create" />
      <Stack.Screen name="raffle/[id]/index" />
      <Stack.Screen name="raffle/[id]/numbers" />
      <Stack.Screen name="raffle/[id]/participants" />
      <Stack.Screen name="raffle/[id]/draw" />
      <Stack.Screen name="raffle/[id]/edit" />
    </Stack>
  );
}
