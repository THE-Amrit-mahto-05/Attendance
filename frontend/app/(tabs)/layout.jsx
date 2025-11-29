import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

const tabConfig = {
  index: { title: 'Dashboard', icon: 'grid' },
  attendance: { title: 'Attendance', icon: 'checkbox' },
  insights: { title: 'Insights', icon: 'stats-chart' },
};

export default function TabsLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#38bdf8',
        tabBarInactiveTintColor: isDark ? '#6b7280' : '#94a3b8',
        tabBarStyle: {
          backgroundColor: isDark ? '#020617' : '#0f172a',
          borderTopWidth: 0,
          paddingBottom: 6,
          height: 64,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          const iconName = tabConfig[route.name]?.icon ?? 'ellipse';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: tabConfig.index.title }} />
      <Tabs.Screen name="attendance" options={{ title: tabConfig.attendance.title }} />
      <Tabs.Screen name="insights" options={{ title: tabConfig.insights.title }} />
    </Tabs>
  );
}

