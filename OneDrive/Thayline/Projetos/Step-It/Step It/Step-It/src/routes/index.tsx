import { NavigationContainer } from "@react-navigation/native";
import { AppRoutesStack } from "./app.routes";
import { AuthRoutesStack } from "./auth.routes"; // ← Criar este arquivo
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "styled-components/native";
import { Fundo } from "../components/fundo";
import { useAuth } from "../contexts/AuthContext"; // ← Adicionar import

export function RoutesStack() {
  const { isAuthenticated, isLoading } = useAuth(); // ← Usar o hook

  console.log("🧭 RoutesStack - Estado atual:", {
    isAuthenticated,
    isLoading,
  });

  // Tela de loading enquanto verifica autenticação
  if (isLoading) {
    console.log("⏳ Mostrando tela de loading...");
    return (
      <Fundo>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#1f86e0" />
        </View>
      </Fundo>
    );
  }

  console.log(
    "🎯 Navegando para:",
    isAuthenticated ? "AppRoutes" : "AuthRoutes"
  );

  console.log(
    "🔍 Componente que será renderizado:",
    isAuthenticated ? "AppRoutesStack" : "AuthRoutesStack"
  );

  return (
    <Fundo>
      <NavigationContainer>
        {isAuthenticated ? (
          <>
            {console.log("✅ Renderizando AppRoutesStack...")}
            <AppRoutesStack />
          </>
        ) : (
          <>
            {console.log("✅ Renderizando AuthRoutesStack...")}
            <AuthRoutesStack />
          </>
        )}
      </NavigationContainer>
    </Fundo>
  );
}
