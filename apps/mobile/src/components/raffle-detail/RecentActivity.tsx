import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActivityLogModel } from '../../services/activityService';

interface RecentActivityProps {
  activities: ActivityLogModel[];
  onViewAllPress: () => void;
}

const getActivityIcon = (description: string) => {
  const descLower = description.toLowerCase();
  if (descLower.includes('creó') || descLower.includes('creado')) {
    return {
      iconName: 'add-circle-outline' as const,
      color: '#3B82F6',
      bgColor: 'bg-blue-50'
    };
  }
  if (descLower.includes('pagó') || descLower.includes('pago')) {
    return {
      iconName: 'checkmark-circle-outline' as const,
      color: '#10B981',
      bgColor: 'bg-green-50'
    };
  }
  if (descLower.includes('reservó') || descLower.includes('reservo')) {
    return {
      iconName: 'bookmark-outline' as const,
      color: '#F59E0B',
      bgColor: 'bg-amber-50'
    };
  }
  return {
    iconName: 'information-circle-outline' as const,
    color: '#6B7280',
    bgColor: 'bg-gray-50'
  };
};

export default function RecentActivity({ activities, onViewAllPress }: RecentActivityProps) {
  return (
    <View className="gap-y-3">
      <View className="flex-row justify-between items-center px-1">
        <Text className="text-lg font-bold text-app-dark">Actividad Reciente</Text>
        <Pressable
          onPress={onViewAllPress}
          style={Platform.OS === 'web' ? { cursor: 'pointer', outlineStyle: 'none' as any } : undefined}
        >
          <Text className="text-lg font-bold text-app-accent">Ver todos</Text>
        </Pressable>
      </View>

      <View className="bg-white rounded-3xl p-2 shadow-card border border-gray-100">
        {activities.length === 0 ? (
          <View className="p-6 items-center justify-center">
            <Ionicons name="receipt-outline" size={32} color="#9CA3AF" />
            <Text className="text-sm font-semibold text-app-gray mt-2 text-center">
              Aún no hay actividad registrada en esta rifa.
            </Text>
          </View>
        ) : (
          activities.map((item, index) => {
            const { iconName, color, bgColor } = getActivityIcon(item.description);
            const isLast = index === activities.length - 1;
            return (
              <View 
                key={item.id} 
                className={`flex-row items-center gap-3.5 p-3.5 ${!isLast ? 'border-b border-gray-100/50' : ''}`}
              >
                <View className={`w-9 h-9 rounded-full ${bgColor} items-center justify-center`}>
                  <Ionicons name={iconName} size={18} color={color} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-app-dark">
                    {item.description}
                  </Text>
                  <Text className="text-xs text-app-gray mt-0.5">
                    {item.timeRelative}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}
