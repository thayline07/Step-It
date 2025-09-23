import { Inicial } from "./../screens/Inicial/index";
import { CriarConta } from "./../screens/CriarConta/index";
import { Login } from "./../screens/Login/index";
import { ListaPisosRelatorio } from "./../screens/ListaPisosRelatorio/index";
import { Perfil } from "./../screens/Perfil/index";
import { Principal } from "./../screens/Principal/index";
import { Relatorio } from "./../screens/Relatorio/index";
import { TrocarSenhaCodigo } from "./../screens/TrocarSenhaCodigo/index";
import { TrocarSenha } from "./../screens/TrocarSenha/index";
import { PisosAdicionados } from "../screens/PisosAdicionados";
import { AdicionarPiso } from "../screens/AdicionarPiso";
import { EditarNome } from "../screens/EditarNome";
import { TrocarEmail } from "../screens/TrocarEmail";
import { PoliticaPrivacidade } from "../screens/PoliticaPrivacidade";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { View, TouchableOpacity, Text } from "react-native";
import { LightningIcon, FileTextIcon, UserIcon } from "phosphor-react-native";

import { useTheme } from "styled-components/native";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function NoEffectTabBarButton(props) {
  return <TouchableOpacity {...props} activeOpacity={1} />;
}

function AppTabNavigator() {
  const theme = useTheme();

  console.log("🏠 AppTabNavigator está sendo renderizado!");

  return (
    // <View style={{ flex: 1 }}>
    <Tab.Navigator
      initialRouteName="Principal"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.colors.navegacao.background,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          height: 80,
          borderTopWidth: 0,
          paddingTop: 10,
          paddingBottom: 15,
        },
        tabBarButton: (props) => <NoEffectTabBarButton {...props} />,
        tabBarIcon: ({ focused }) => {
          let IconComponent: React.ElementType = View;
          let iconSize = 24;

          if (route.name === "ListaPisosRelatorio") {
            IconComponent = FileTextIcon;
            iconSize = 31;
          } else if (route.name === "Principal") {
            IconComponent = LightningIcon;
            iconSize = 24;
          } else if (route.name === "Perfil") {
            IconComponent = UserIcon;
            iconSize = 24;
          }

          return (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 55,
                height: 55,
                borderWidth: focused ? 40 : 0,
                borderColor: focused
                  ? theme.colors.navegacao.background
                  : "transparent",
                borderRadius: 40,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 55,
                  height: 55,
                }}
              >
                <View
                  style={{
                    backgroundColor: focused
                      ? theme.colors.navegacao.fundo_icone_clicado
                      : theme.colors.navegacao.background,
                    marginTop: 10,
                    borderRadius: 30,
                    width: 55,
                    height: 55,
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: focused
                      ? theme.colors.navegacao.sombra_fundo_icone_clicado
                      : "transparent",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: focused ? 0.8 : 0,
                    shadowRadius: focused ? 20 : 0,
                    elevation: focused ? 15 : 5,
                    transform: [{ translateY: focused ? -5 : 0 }],
                  }}
                >
                  <IconComponent
                    size={iconSize}
                    color={
                      focused
                        ? theme.colors.navegacao.icone_clicado
                        : theme.colors.navegacao.icones
                    }
                    weight={focused ? "fill" : "regular"}
                    style={{
                      shadowColor: focused ? "#fff" : "transparent",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: focused ? 1 : 0,
                      shadowRadius: focused ? 20 : 0,
                      elevation: focused ? 15 : 5,
                    }}
                  />
                </View>
              </View>
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="ListaPisosRelatorio"
        component={ListaPisosRelatorio}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Principal"
        component={Principal}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
    // </View>
  );
}

export function AppRoutesStack() {
  console.log("📱 AppRoutesStack está sendo renderizado!");

  // Versão simplificada - apenas o essencial para funcionar
  return (
    <Stack.Navigator
      initialRouteName="App"
      screenOptions={{ headerShown: false }}
    >
      {/* Tela principal com as tabs */}
      <Stack.Screen name="App" component={AppTabNavigator} />

      {/* Telas secundárias acessadas pelas tabs */}
      <Stack.Screen name="Relatorio" component={Relatorio} />
      <Stack.Screen name="PisosAdicionados" component={PisosAdicionados} />
      <Stack.Screen name="AdicionarPiso" component={AdicionarPiso} />
      <Stack.Screen name="EditarNome" component={EditarNome} />
      <Stack.Screen name="TrocarEmail" component={TrocarEmail} />
      <Stack.Screen name="TrocarSenhaCodigo" component={TrocarSenhaCodigo} />
      <Stack.Screen name="TrocarSenha" component={TrocarSenha} />
      <Stack.Screen
        name="PoliticaPrivacidade"
        component={PoliticaPrivacidade}
      />
    </Stack.Navigator>
  );
}
