import { Ionicons } from '@expo/vector-icons';
import { TabList, TabListProps, Tabs, TabSlot, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton icon="home-outline" activeIcon="home">
              Mis Rifas
            </TabButton>
          </TabTrigger>
          <TabTrigger name="history" href="/history" asChild>
            <TabButton icon="time-outline" activeIcon="time">
              Historial
            </TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

interface TabButtonProps extends TabTriggerSlotProps {
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

export function TabButton({ children, isFocused, icon, activeIcon, ...props }: TabButtonProps) {
  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabBtn, pressed && styles.pressed]}>
      <Ionicons name={isFocused ? activeIcon : icon} size={20} color={isFocused ? '#3B6FFF' : '#9CA3AF'} />
      <Text style={[styles.tabBtnText, { color: isFocused ? '#3B6FFF' : '#9CA3AF' }]}>{children}</Text>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={styles.innerContainer}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  innerContainer: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 600,
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    width: 100,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  pressed: {
    opacity: 0.7,
  },
});
