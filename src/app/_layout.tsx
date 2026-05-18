import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { Home, PieChart, Tag, PlusCircle, ArrowDownCircle } from 'lucide-react-native';

import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="gastos"
        options={{
          title: 'Gastos',
          tabBarIcon: ({ color }) => <ArrowDownCircle size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categorias"
        options={{
          title: 'Categorías',
          tabBarIcon: ({ color }) => <Tag size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ingresos"
        options={{
          title: 'Ingresos',
          tabBarIcon: ({ color }) => <PlusCircle size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="resumen"
        options={{
          title: 'Resumen',
          tabBarIcon: ({ color }) => <PieChart size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
