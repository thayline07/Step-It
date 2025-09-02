import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Inicial } from "./../screens/Inicial";
import { CriarConta } from "./../screens/CriarConta/index";
import { Login } from "./../screens/Login/index";
import { ListaPisosRelatorio } from "./../screens/ListaPisosRelatorio/index";
import { Perfil } from "./../screens/Perfil/index";
import { Principal } from "./../screens/Principal/index";
import { Relatorio } from "./../screens/Relatorio/index";
// import {} from "./../screens/";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export function AppRoutesStack() {
  return (
    <Stack.Navigator
      initialRouteName="Inicial"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Inicial" component={Inicial} />
      <Stack.Screen name="CriarConta" component={CriarConta} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}

export function AppRoutesTab() {
  return (
    <Tab.Navigator initialRouteName="Principal">
      <Tab.Screen name="ListaPisosRelatorio" component={ListaPisosRelatorio} />
      <Tab.Screen name="Principal" component={Principal} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

export function AppRoutesRelatorio() {
  return (
    <Stack.Navigator
      initialRouteName="ListaPisosRelatorio"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="ListaPisosRelatorio"
        component={ListaPisosRelatorio}
      />
      <Stack.Screen name="Relatorio" component={Relatorio} />
    </Stack.Navigator>
  );
}
