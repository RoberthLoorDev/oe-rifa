import { Text, View } from 'react-native';

interface HomeHeaderProps {
  onNotificationPress?: () => void;
}

export default function HomeHeader({ onNotificationPress }: HomeHeaderProps) {
  return (
    <View className="flex-row justify-between items-center mb-6">
      <Text className="text-xl font-black text-app-dark">Mis Rifas</Text>
      {/* <Pressable 
        onPress={onNotificationPress}
        className="relative p-2.5 bg-white rounded-full shadow-card active:bg-gray-100 transition"
        style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
      >
        <Ionicons name="notifications-outline" size={20} color="#60646C" />
        <View className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
      </Pressable> */}
    </View>
  );
}
