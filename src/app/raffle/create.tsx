import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function CreateRaffleScreen() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const inputStyle = Platform.OS === 'web' ? { outlineStyle: 'none' as any } : undefined;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-app-bg">
      <View className="flex-1 relative">
        {/* Header */}
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

        {/* Scrollable Form */}
        <ScrollView 
          className="flex-1 px-6 py-6"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-y-6">
            {/* Foto Upload */}
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

            {/* Info Básica */}
            <View className="bg-white rounded-3xl p-5 shadow-card border border-gray-100 gap-y-4">
              <Text className="text-base font-bold text-app-dark mb-2">Información básica</Text>

              <View>
                <Text className="text-base font-semibold text-app-gray mb-1 ml-1">Título de la rifa</Text>
                <TextInput
                  placeholder="Ej: Rifa Solidaria Navidad"
                  placeholderTextColor="#9CA3AF"
                  style={inputStyle}
                  className="bg-app-bg border border-transparent focus:border-app-accent focus:bg-white py-3 px-4 rounded-xl text-base outline-none transition"
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-app-gray mb-1 ml-1">Descripción</Text>
                <TextInput
                  placeholder="¿Para qué es esta rifa?"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={2}
                  style={inputStyle}
                  className="bg-app-bg border border-transparent focus:border-app-accent focus:bg-white py-3 px-4 rounded-xl text-base text-left outline-none transition"
                  textAlignVertical="top"
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-app-gray mb-1 ml-1">Frase para la imagen</Text>
                <TextInput
                  placeholder="¡Apóyanos y gana!"
                  placeholderTextColor="#9CA3AF"
                  style={inputStyle}
                  className="bg-app-bg border border-transparent focus:border-app-accent focus:bg-white py-3 px-4 rounded-xl text-base outline-none transition"
                />
              </View>
            </View>

            {/* Configuración */}
            <View className="bg-white rounded-3xl p-5 shadow-card border border-gray-100 gap-y-4">
              <Text className="text-base font-bold text-app-dark mb-2">Configuración</Text>

              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-app-gray mb-1 ml-1">Números</Text>
                  <TextInput
                    placeholder="Ej: 100"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    style={inputStyle}
                    className="w-full bg-app-bg border border-transparent focus:border-app-accent focus:bg-white py-3 px-4 rounded-xl text-base font-bold text-app-dark outline-none transition"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-app-gray mb-1 ml-1">Precio c/u</Text>
                  <View className="relative justify-center">
                    <Text className="absolute left-4 text-app-gray font-bold text-base">$</Text>
                    <TextInput
                      placeholder="0.00"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      style={inputStyle}
                      className="w-full bg-app-bg border border-transparent focus:border-app-accent focus:bg-white py-3 pl-8 pr-4 rounded-xl text-base font-bold text-app-dark outline-none transition"
                    />
                  </View>
                </View>
              </View>

              <View>
                <Text className="text-sm font-semibold text-app-gray mb-1 ml-1">Fecha del sorteo</Text>
                <TextInput
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor="#9CA3AF"
                  style={inputStyle}
                  className="w-full bg-app-bg border border-transparent focus:border-app-accent focus:bg-white py-3 px-4 rounded-xl text-base font-medium text-app-gray outline-none transition"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Fading Fixed Bottom Button */}
        <View className="absolute bottom-0 left-0 right-0 p-6 bg-app-bg/95 pt-8 border-t border-gray-200/20">
          <Pressable
            onPress={goBack}
            className="w-full bg-app-accent hover:bg-app-accentHover py-4 rounded-2xl shadow-lg shadow-app-accent/20 items-center active:scale-[0.98] transition-all"
            style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
          >
            <Text className="text-white font-bold text-lg">Crear Rifa</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
