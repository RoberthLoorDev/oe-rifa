import React from 'react';
import { Modal, View, Pressable, Image, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImageModalProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
}

export default function ImageModal({ visible, imageUri, onClose }: ImageModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/95 justify-center items-center relative">
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        
        <Pressable 
          onPress={onClose}
          className="absolute top-12 right-4 z-50 p-2.5 bg-white/20 backdrop-blur-md rounded-full active:bg-white/35"
          style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
        >
          <Ionicons name="close" size={24} color="#ffffff" />
        </Pressable>

        <Pressable 
          onPress={onClose} 
          className="absolute inset-0 z-10" 
        />

        <Image 
          source={{ uri: imageUri }} 
          className="w-full h-5/6 z-20"
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
}
