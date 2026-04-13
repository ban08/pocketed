import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';

import { AuthContext } from '../src/context/AuthContext';
import { AuthProvider } from '../src/context/AuthContext';

import { useColorScheme } from '@/hooks/use-color-scheme';

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const [hasUsers, setHasUsers] = React.useState<boolean | null>(null);
  const router = useRouter();

  const { isAuthenticated } = useContext(AuthContext);

  React.useEffect(() => {
    const checkUsers = async () => {
      try {
        const usersJson = await AsyncStorage.getItem("pocket_users");
        const users = usersJson ? JSON.parse(usersJson) : [];
        setHasUsers(users.length > 0);
      } catch (error) {
        console.error("Users check failed:", error);
        setHasUsers(false);
      }
    };
    checkUsers();
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)/dashboard");
    } else if (hasUsers !== null) {
      if (hasUsers) {
        router.replace("/auth/login");
      } else {
        router.replace("/auth/welcome");
      }
    }
  }, [isAuthenticated, hasUsers]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/welcome" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-expense" options={{ presentation: "modal", title: "Add Expense" }}/>
        <Stack.Screen name="add-budget" options={{ presentation: "modal", title: "Add Budget" }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}