import { createStackNavigator } from "@react-navigation/stack";
import { Login } from "../screens/Login";
import { CriarConta } from "../screens/CriarConta";
import { TrocarSenhaCodigo } from "../screens/TrocarSenhaCodigo";

export type AuthStackParamList = {
  Login: undefined;
  CriarConta: undefined;
  TrocarSenhaCodigo: undefined;
};

const { Navigator, Screen } = createStackNavigator<AuthStackParamList>();

export function AuthRoutesStack() {
  return (
    <Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
      <Screen name="Login" component={Login} />
      <Screen name="CriarConta" component={CriarConta} />
      <Screen name="TrocarSenhaCodigo" component={TrocarSenhaCodigo} />
    </Navigator>
  );
}
