import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Text, StyleSheet, Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";

// import { SafeAreaView } from "react-native-safe-area-context";
import {
  useFonts,
  Inter_600SemiBold,
  Inter_800ExtraBold,
  Inter_400Regular,
} from "@expo-google-fonts/inter";

import { RoutesStack } from "./src/routes";
import { useTheme } from "styled-components/native";
import { ThemeProvider, useThemeContext } from "./src/theme/ThemeProvider";
import { AppRoutesStack } from "./src/routes/app.routes";
import { View } from "./src/screens/Inicial/styles";
// import { Inicial } from "./src/screens/Inicial";

import { fetchUserData } from "./src/services/auth";
import { AuthProvider } from "./src/contexts/AuthContext";

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_800ExtraBold,
    Inter_400Regular,
  });

  useEffect(() => {
    async function setupNavBar() {
      if (Platform.OS === "android") {
        // comportamento para reaparecer quando o usuário fizer swipe
        await NavigationBar.setBehaviorAsync("overlay-swipe"); // mostra temporariamente por cima
        // esconder definitivamente (até o swipe)
        await NavigationBar.setVisibilityAsync("hidden");
        // opcional: deixar transparente / desenhar por trás
        await NavigationBar.setPositionAsync("absolute");
        await NavigationBar.setBackgroundColorAsync("transparent");
      }
    }
    setupNavBar();
    fetchUserData();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function MainApp() {
  const { themeName, toggleTheme } = useThemeContext();
  const theme = useTheme();
  // const insets = useSafeAreaInsets(); // Não precisa mais

  return (
    <>
      <StatusBar style="light" />
      <View
        style={{
          backgroundColor: theme.colors.background_principal,
          paddingTop: 30,
          // paddingBottom: insets.bottom, // Remova esta linha!
        }}
      >
        <RoutesStack />
      </View>
    </>
  );
}
