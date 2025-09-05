import { NavigationContainer } from "@react-navigation/native";
import { AppRoutesStack } from "./app.routes";
import { View } from "react-native";
import { useTheme } from "styled-components/native";
import { Fundo } from "../components/fundo";

// export function RoutesPrincipal() {
//   //   const { colors } = useTheme();
//   return (
//     // <View style={{ flex: 1, backgroundColor: colors.GRAY_600 }}>
//     <NavigationContainer>
//       <AppRoutesTab />
//     </NavigationContainer>
//     // </View>
//   );
// }

export function RoutesStack() {
  return (
    <Fundo>
      <NavigationContainer>
        <AppRoutesStack />
      </NavigationContainer>
    </Fundo>
  );
}

// export function RoutesRelatorio() {
//   return (
//     <NavigationContainer>
//       <AppRoutesRelatorio />
//     </NavigationContainer>
//   );
// }
