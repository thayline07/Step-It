import { StatusBar } from "expo-status-bar";
import {} from "react-native";
import {
  useFonts,
  Inter_600SemiBold,
  Inter_800ExtraBold,
  Inter_400Regular,
} from "@expo-google-fonts/inter";

import { RoutesStack } from "./src/routes";

import { ThemeProvider, useThemeContext } from "./src/theme/ThemeProvider";
import { Inicial } from "./src/screens/Inicial";
import { AppRoutesStack } from "./src/routes/app.routes";

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_800ExtraBold,
    Inter_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

function MainApp() {
  const { themeName, toggleTheme } = useThemeContext();

  return <RoutesStack />;
}
