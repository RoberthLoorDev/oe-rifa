import React, { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View, Keyboard, Animated } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCreateRaffle } from '../../hooks/useCreateRaffle';

const formatDrawDateDisplay = (date: Date): string => {
  const formatted = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export default function CreateRaffleScreen() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const inputStyle = Platform.OS === 'web' ? { outlineStyle: 'none' as any } : undefined;
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const {
    title,
    setTitle,
    product,
    setProduct,
    description,
    setDescription,
    ticketCount,
    setTicketCount,
    ticketPrice,
    setTicketPrice,
    drawDate,
    setDrawDate,
    loading,
    error,
    setError,
    submitCreateRaffle,
  } = useCreateRaffle();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastY = useRef(new Animated.Value(-100)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const [showDatePicker, setShowDatePicker] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    
    Animated.parallel([
      Animated.timing(toastY, {
        toValue: 20,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start();

    const timer = setTimeout(() => {
      hideToast();
    }, 3000);

    return () => clearTimeout(timer);
  };

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(toastY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setToastVisible(false);
      setToastMessage(null);
    });
  };

  useEffect(() => {
    if (error) {
      showToast(error);
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const showListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const handleDateValueChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDrawDate(selectedDate);
    }
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  const handleDateDismiss = () => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      className="flex-1 bg-app-bg"
    >
      <View 
        className="flex-1"
        style={Platform.OS === 'android' ? { paddingBottom: keyboardHeight } : undefined}
      >
        {toastVisible && (
          <Animated.View
            style={{
              position: 'absolute',
              top: 50,
              left: 20,
              right: 20,
              zIndex: 9999,
              elevation: 9999,
              transform: [{ translateY: toastY }],
              opacity: toastOpacity,
            }}
            pointerEvents="none"
          >
            <View className="bg-red-50 border border-red-200 px-4 py-3 rounded-2xl flex-row items-center gap-x-2.5 shadow-xl shadow-red-500/10">
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
              <Text className="text-red-700 font-extrabold flex-1 text-sm">{toastMessage}</Text>
            </View>
          </Animated.View>
        )}

        <View className="bg-white px-4 pt-12 pb-4 flex-row items-center border-b border-gray-200/50">
          <Pressable
            onPress={goBack}
            className="p-2 -ml-2 rounded-full active:bg-gray-100 transition"
            style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </Pressable>
          <Text className="text-xl font-bold text-app-dark mx-auto pr-8">Nueva Rifa</Text>
        </View>

        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-y-6">
            <View className="bg-white rounded-3xl p-2 shadow-card border border-gray-100">
              <Pressable
                className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-[1.3rem] p-8 flex-col items-center justify-center text-center active:bg-gray-100 transition"
                style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
              >
                <View className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                  <Ionicons name="camera" size={20} color="#3B6FFF" />
                </View>
                <Text className="text-base font-semibold text-app-dark">Toca para subir foto</Text>
                <Text className="text-sm text-app-gray mt-1">PNG o JPG max. 5MB</Text>
              </Pressable>
            </View>

            <View className="bg-white rounded-3xl p-5 shadow-card border border-gray-100 gap-y-4">
              <Text className="text-base font-bold text-app-dark mb-2">Información básica</Text>

              <View>
                <Text className="text-sm font-semibold text-app-gray mb-1 ml-1">Título de la rifa *</Text>
                <TextInput
                  placeholder="Ej: Rifa Solidaria Navidad"
                  placeholderTextColor="#9CA3AF"
                  value={title}
                  onChangeText={setTitle}
                  style={inputStyle}
                  className="bg-app-bg border border-transparent focus:border-app-accent focus:bg-white py-3 px-4 rounded-xl text-base outline-none transition"
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-app-gray mb-1 ml-1">Producto / Premio (Opcional)</Text>
                <TextInput
                  placeholder="Ej: iPhone 15 Pro, Laptop Asus, Canasta"
                  placeholderTextColor="#9CA3AF"
                  value={product}
                  onChangeText={setProduct}
                  style={inputStyle}
                  className="bg-app-bg border border-transparent focus:border-app-accent focus:bg-white py-3 px-4 rounded-xl text-base outline-none transition"
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-app-gray mb-1 ml-1">Descripción</Text>
                <TextInput
                  placeholder="¿Para qué es esta rifa?"
                  placeholderTextColor="#9CA3AF"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={2}
                  style={inputStyle}
                  className="bg-app-bg border border-transparent focus:border-app-accent focus:bg-white py-3 px-4 rounded-xl text-base text-left outline-none transition"
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View className="bg-white rounded-3xl p-5 shadow-card border border-gray-100 gap-y-4">
              <Text className="text-base font-bold text-app-dark mb-2">Configuración</Text>

              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-app-gray mb-1 ml-1">Números *</Text>
                  <TextInput
                    placeholder="Ej: 100"
                    placeholderTextColor="#9CA3AF"
                    value={ticketCount}
                    onChangeText={setTicketCount}
                    keyboardType="numeric"
                    style={inputStyle}
                    className="w-full bg-app-bg border border-transparent focus:border-app-accent focus:bg-white py-3 px-4 rounded-xl text-base font-bold text-app-dark outline-none transition"
                  />
                  <Text className="text-[11px] text-app-gray mt-1 ml-1">Opciones: 30, 50, 100, 1000</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-app-gray mb-1 ml-1">Precio c/u *</Text>
                  <View className="relative justify-center">
                    <Text className="absolute left-4 text-app-gray font-bold text-base">$</Text>
                    <TextInput
                      placeholder="0.00"
                      placeholderTextColor="#9CA3AF"
                      value={ticketPrice}
                      onChangeText={setTicketPrice}
                      keyboardType="numeric"
                      style={inputStyle}
                      className="w-full bg-app-bg border border-transparent focus:border-app-accent focus:bg-white py-3 pl-8 pr-4 rounded-xl text-base font-bold text-app-dark outline-none transition"
                    />
                  </View>
                </View>
              </View>

              <View>
                <Text className="text-sm font-semibold text-app-gray mb-1 ml-1">Fecha del sorteo *</Text>
                {Platform.OS === 'web' ? (
                  <input
                    type="date"
                    value={drawDate.toISOString().split('T')[0]}
                    onChange={(e) => setDrawDate(new Date(e.target.value + 'T00:00:00'))}
                    style={{
                      backgroundColor: '#F5F5F7',
                      borderWidth: 1,
                      borderColor: 'transparent',
                      padding: 12,
                      borderRadius: 12,
                      fontSize: 16,
                      fontFamily: 'inherit',
                      outline: 'none',
                      width: '100%',
                    }}
                  />
                ) : Platform.OS === 'ios' ? (
                  <View className="bg-app-bg border border-transparent py-2 px-4 rounded-xl flex-row justify-between items-center">
                    <DateTimePicker
                      value={drawDate}
                      mode="date"
                      display="compact"
                      onValueChange={handleDateValueChange}
                      onDismiss={handleDateDismiss}
                      locale="es-ES"
                    />
                    <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
                  </View>
                ) : (
                  <>
                    <Pressable
                      onPress={() => setShowDatePicker(true)}
                      className="w-full bg-app-bg border border-transparent py-3.5 px-4 rounded-xl flex-row justify-between items-center"
                    >
                      <Text className="text-base font-medium text-app-dark">
                        {formatDrawDateDisplay(drawDate)}
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
                    </Pressable>
                    {showDatePicker && (
                      <DateTimePicker
                        value={drawDate}
                        mode="date"
                        display="default"
                        onValueChange={handleDateValueChange}
                        onDismiss={handleDateDismiss}
                      />
                    )}
                  </>
                )}
              </View>
            </View>
          </View>

          <View className="mt-8 pb-4">
            <Pressable
              onPress={submitCreateRaffle}
              disabled={loading}
              className={`w-full py-4 rounded-2xl shadow-lg items-center active:scale-[0.98] transition-all ${
                loading ? 'bg-app-accent/60' : 'bg-app-accent hover:bg-app-accentHover shadow-app-accent/20'
              }`}
              style={Platform.OS === 'web' ? { cursor: (loading ? 'not-allowed' : 'pointer') as any } : undefined}
            >
              <Text className="text-white font-bold text-lg">
                {loading ? 'Creando Rifa...' : 'Crear Rifa'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
