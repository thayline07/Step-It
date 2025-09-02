import { NavigationContainer } from "@react-navigation/native";
import { AppRoutesStack, AppRoutesTab, AppRoutesRelatorio } from "./app.routes";
import { View } from "react-native";
import { useTheme } from "styled-components/native";

export function RoutesPrincipal() {
  //   const { colors } = useTheme();
  return (
    // <View style={{ flex: 1, backgroundColor: colors.GRAY_600 }}>
    <NavigationContainer>
      <AppRoutesTab />
    </NavigationContainer>
    // </View>
  );
}

export function RoutesStack() {
  return (
    <NavigationContainer>
      <AppRoutesStack />
    </NavigationContainer>
  );
}

export function RoutesRelatorio() {
  return (
    <NavigationContainer>
      <AppRoutesRelatorio />
    </NavigationContainer>
  );
}
