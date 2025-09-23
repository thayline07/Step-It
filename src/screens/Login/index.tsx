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

import { Container, Form, TrocarSenha } from "./styles";

import { useState } from "react";

import { logar, getCurrentUser } from "./../../services/auth";
import { useAuth } from "./../../contexts/AuthContext";

type RootStackParamList = {
  App: { screen?: string };
  CriarConta: undefined;
  TrocarSenhaCodigo: undefined;
};

export function Login() {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { checkAuthState } = useAuth(); // ← Pegar função do contexto

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn() {
    // Validações básicas
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);

    try {
      const result = await logar(email.trim(), senha);

      if (result.success) {
        console.log("Login bem-sucedido!");

        // Verificar o estado após 1 segundo
        setTimeout(() => {
          const currentUser = getCurrentUser();
          console.log("🔍 Verificando usuário após login:", currentUser?.email);
          console.log("🔍 auth.currentUser existe:", !!currentUser);

          // ← FORÇAR VERIFICAÇÃO MANUAL DO ESTADO
          console.log("🔧 Forçando verificação manual...");
          checkAuthState();
        }, 1000);

        // O redirecionamento será automático através do AuthContext
        // Não precisa navegar manualmente aqui
      } else {
        // Tratar erros específicos
        let errorMessage = "";

        switch (result.error) {
          case "auth/user-not-found":
            errorMessage = "Usuário não encontrado";
            break;
          case "auth/wrong-password":
            errorMessage = "Senha incorreta";
            break;
          case "auth/invalid-email":
            errorMessage = "Email inválido";
            break;
          case "auth/user-disabled":
            errorMessage = "Usuário desabilitado";
            break;
          case "auth/too-many-requests":
            errorMessage = "Muitas tentativas. Tente novamente mais tarde";
            break;
          case "auth/invalid-credential":
            errorMessage = "Credenciais inválidas";
            break;
          default:
            errorMessage = "Erro ao fazer login. Verifique suas credenciais";
        }

        Alert.alert("Erro no Login", errorMessage);
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

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
            onChangeText={setEmail}
            value={email}
          />
          <InputForm
            icon="senha"
            title="Senha"
            placeholder="Digite sua senha"
            onChangeText={setSenha}
            value={senha}
            secureTextEntry={true}
          />
          <TrocarSenha onPress={() => navigation.navigate("TrocarSenhaCodigo")}>
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
            text={isLoading ? "Entrando..." : "Entrar"} // ← Texto dinâmico
            onPress={handleSignIn} // ← Nova função sem parâmetros
            disabled={isLoading}
          />
        </Form>
        <Text
          style={{
            color: theme.colors.login.texto,
            marginTop: 4,
            marginBottom: 15,
          }}
        >
          Não tem uma conta?
          <TouchableOpacity
            onPress={() => navigation.navigate("CriarConta")}
            style={{ marginTop: 8 }}
          >
            <Text style={{ color: "#1f86e0" }}> Crie Aqui.</Text>
          </TouchableOpacity>
        </Text>
        <Logo />
      </Container>
    </Fundo>
  );
}
