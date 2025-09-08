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

import { Container, Form } from "./styles";
import styled from "styled-components";

type RootStackParamList = {
  App: { screen?: string };
  CriarConta: undefined;
  Login: undefined;
  TrocarSenhaCodigo: undefined;
};

export function TrocarSenha() {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  function voltar() {
    return navigation.goBack("TrocarSenhaCodigo");
  }
  return (
    <Fundo>
      <Cabecalho funcao={voltar} tipo="QUATERNARIO" />
      <Container>
        <LoginTitle text="Redefinir Senha" />
        <Form>
          <InputForm
            icon="senha"
            title="Nova senha"
            placeholder="Insira sua senha nova"
          />
          <InputForm
            icon="senha"
            title="Confirmação de senha"
            placeholder="Insira novamente a senha nova"
          />

          <BotaoLogar
            style={{ marginTop: 70, marginBottom: 80 }}
            text="Redefinir Senha"
            onPress={() => navigation.navigate("Login")}
          />
        </Form>
        <Logo />
      </Container>
    </Fundo>
  );
}
