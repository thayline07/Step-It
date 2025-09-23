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

import { Container, Form, Texto } from "./styles";
import styled from "styled-components";

type RootStackParamList = {
  App: { screen?: string };
  CriarConta: undefined;
  TrocarSenha: undefined;
  Login: undefined;
};

export function TrocarSenhaCodigo() {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  function voltar() {
    return navigation.goBack("Login");
  }

  return (
    <Fundo>
      <Cabecalho funcao={voltar} tipo="QUATERNARIO" />
      <Container>
        <LoginTitle text="Confirmação de Código" />
        <Texto>
          Digite o código que enviamos ao seu email para confirmar sua
          solicitação.
        </Texto>
        <Form>
          <InputForm icon="key" placeholder="Insira o código" />
          <BotaoLogar
            style={{ marginTop: 100, marginBottom: 55 }}
            text="Confirmar"
            onPress={() => navigation.navigate("TrocarSenha")}
          />
        </Form>
        <Logo />
      </Container>
    </Fundo>
  );
}
