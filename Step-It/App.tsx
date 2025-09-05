import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useFonts,
  Inter_600SemiBold,
  Inter_800ExtraBold,
  Inter_400Regular,
} from "@expo-google-fonts/inter";

import { RoutesStack } from "./src/routes";
import { ThemeProvider, useThemeContext } from "./src/theme/ThemeProvider";
import { AppRoutesStack } from "./src/routes/app.routes";
// import { Inicial } from "./src/screens/Inicial";

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
      <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1 }}>
        <MainApp />
      </SafeAreaView>
    </ThemeProvider>
  );
}

function MainApp() {
  const { themeName, toggleTheme } = useThemeContext();

  return <RoutesStack />;
}
