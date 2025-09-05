import { Fundo } from "../../components/fundo";
import { LoginTitle } from "../../components/LoginTitle";
import { InputForm } from "../../components/Input";
import { BotaoLogar } from "../../components/BotaoLogar";
import { Logo } from "../../components/Logo";
import { Cabecalho } from "../../components/Cabecalho";
import { Text, TouchableOpacity } from "react-native";

import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { Container, Form, TrocarSenha } from "./styles";

type RootStackParamList = {
  App: { screen?: string };
  CriarConta: undefined;
};

export function Login() {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <Fundo>
      <Cabecalho tipo="TERCIARIO" />
      <Container>
        <LoginTitle text="Acesse sua conta" />
        <Form>
          <InputForm
            icon="email"
            title="Email"
            placeholder="Digite seu email"
          />
          <InputForm
            icon="senha"
            title="Senha"
            placeholder="Digite sua senha"
          />
          <TrocarSenha onPress={() => navigation.navigate("CriarConta")}>
            <Text
              style={{
                color: theme.colors.login.texto,
                textDecorationLine: "underline",
                fontSize: 13,
              }}
            >
              Esqueceu sua senha?
            </Text>
          </TrocarSenha>

          <BotaoLogar
            text="Entrar"
            onPress={() => navigation.navigate("App", { screen: "Principal" })}
          />
        </Form>
        <Text style={{ color: theme.colors.login.texto }}>
          Não tem uma conta?
          <TouchableOpacity>
            <Text style={{ color: "#1f86e0" }}>Crie Aqui.</Text>
          </TouchableOpacity>
        </Text>
        <Logo />
      </Container>
    </Fundo>
  );
}
