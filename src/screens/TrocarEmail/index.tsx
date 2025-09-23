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
};

export function TrocarEmail() {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  function voltar() {
    return navigation.goBack();
  }
  return (
    <Fundo>
      <Cabecalho funcao={voltar} tipo="QUATERNARIO" />
      <Container>
        <LoginTitle text="Troque seu Email" />
        <Form>
          <InputForm
            icon="email"
            title="Novo Email"
            placeholder="Insira seu novo email"
          />
          <InputForm
            icon="email"
            title="Confirmação de Email"
            placeholder="Insira novamente seu email"
          />
          <InputForm
            icon="senha"
            title="Senha"
            placeholder="Insira sua senha"
          />

          <BotaoLogar
            style={{ marginTop: 40, marginBottom: 20 }}
            text="Trocar Email"
            onPress={() => navigation.navigate("App", { screen: "Perfil" })}
          />
        </Form>
        <Logo />
      </Container>
    </Fundo>
  );
}
