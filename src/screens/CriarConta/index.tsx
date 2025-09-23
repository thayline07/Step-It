import { Fundo } from "../../components/fundo";
import { LoginTitle } from "../../components/LoginTitle";
import { InputForm } from "../../components/Input";
import { BotaoLogar } from "../../components/BotaoLogar";
import { Logo } from "../../components/Logo";
import { Cabecalho } from "../../components/Cabecalho";
import { Alert, Text, TouchableOpacity } from "react-native";

import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { Container, Form } from "./styles";

import { registrar } from "./../../services/auth";
import { useState } from "react";

type RootStackParamList = {
  App: { screen?: string };
  CriarConta: undefined;
  Login: undefined;
};

export function CriarConta() {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validarCampos() {
    if (!nome.trim()) {
      Alert.alert("Erro", "Nome é obrigatório");
      return false;
    }

    if (!email.trim()) {
      Alert.alert("Erro", "Email é obrigatório");
      return false;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "Email inválido");
      return false;
    }

    if (!telefone.trim()) {
      Alert.alert("Erro", "Telefone é obrigatório");
      return false;
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "Senha deve ter no mínimo 6 caracteres");
      return false;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return false;
    }

    return true;
  }

  async function handleCreateAccount() {
    if (!validarCampos()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await registrar(
        nome.trim(),
        email.trim(),
        senha,
        telefone.trim(),
        []
      );

      if (result.success) {
        Alert.alert("Sucesso", "Conta criada com sucesso!", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        // Tratar erros específicos
        let errorMessage = "";

        switch (result.error) {
          case "email-already-exists":
            errorMessage = "Este email já está cadastrado";
            break;
          case "username-already-exists":
            errorMessage = "Este nome de usuário já existe";
            break;
          case "phone-already-exists":
            errorMessage = "Este telefone já está cadastrado";
            break;
          case "auth/weak-password":
            errorMessage = "A senha é muito fraca";
            break;
          default:
            errorMessage = "Erro ao criar conta. Tente novamente.";
        }

        Alert.alert("Erro", errorMessage);
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  function voltar() {
    return navigation.goBack();
  }

  return (
    <Fundo>
      <Cabecalho funcao={voltar} tipo="QUATERNARIO" />
      <Container>
        <LoginTitle text="Crie sua conta" />
        <Form>
          <InputForm
            icon="user"
            title="Usuário"
            placeholder="Insira seu usuário"
            onChangeText={setNome}
          />
          <InputForm
            icon="email"
            title="E-mail"
            placeholder="Insira seu e-mail"
            onChangeText={setEmail}
          />
          <InputForm
            icon="telefone"
            title="Telefone"
            placeholder="(00) 00000-0000"
            onChangeText={setTelefone}
          />

          <InputForm
            icon="senha"
            title="Senha"
            placeholder="Insira sua senha"
            onChangeText={setSenha}
            secureTextEntry={true}
          />
          <InputForm
            icon="senha"
            title="Confirmar Senha"
            placeholder="Insira novamente sua senha"
            onChangeText={setConfirmarSenha}
            secureTextEntry={true}
          />

          <BotaoLogar
            style={{ marginTop: 70 }}
            text={isLoading ? "Criando..." : "Criar Conta"}
            onPress={handleCreateAccount}
            disabled={isLoading}
          />
        </Form>
        {/* <Logo /> */}
      </Container>
    </Fundo>
  );
}
