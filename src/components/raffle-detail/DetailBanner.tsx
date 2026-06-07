import React from 'react';
import { View, Text, Pressable, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DetailBannerProps {
  title: string;
  product?: string;
  status: 'En curso' | 'Completa' | 'Cerrada';
  imageUri: string;
  onBackPress: () => void;
  onOptionsPress?: () => void;
}

export default function DetailBanner({
  title,
  product,
  status,
  imageUri,
  onBackPress,
  onOptionsPress,
}: DetailBannerProps) {
  return (
    <View className="relative h-80 w-full">
      {/* Floating Header Buttons Overlay */}
      <View 
        className="absolute top-0 left-0 right-0 z-20 flex-row justify-between items-center px-4 pt-12 pb-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
      >
        <Pressable 
          onPress={onBackPress} 
          className="p-2 bg-white/20 backdrop-blur-md rounded-full active:bg-white/30"
          style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </Pressable>
        <Pressable 
          onPress={onOptionsPress}
          className="p-2 bg-white/20 backdrop-blur-md rounded-full active:bg-white/30"
          style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="#ffffff" />
        </Pressable>
      </View>

      {/* Image Banner */}
      <Image 
        source={{ uri: imageUri }} 
        className="w-full h-full"
        resizeMode="cover"
      />
      
      {/* Dark gradient overlay + status badge + title */}
      <View className="absolute inset-0 bg-black/40 justify-end p-6 pb-6">
        <View className="items-start">
          <View className={`px-2.5 py-1 rounded-lg mb-2 uppercase ${
            status === 'Cerrada' ? 'bg-app-gray' : 'bg-app-green'
          }`}>
            <Text className="text-white text-xs font-black tracking-wider uppercase">
              {status}
            </Text>
          </View>
          <Text className="text-3xl font-extrabold text-white leading-tight">
            {title}
          </Text>
          {product ? (
            <View className="flex-row items-center mt-1.5 gap-x-1.5 bg-black/30 px-2.5 py-1 rounded-lg self-start">
              <Ionicons name="gift-outline" size={14} color="#DCFCE7" />
              <Text className="text-xs font-bold text-[#DCFCE7]">
                Premio: {product}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
