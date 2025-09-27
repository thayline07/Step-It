import { Fundo } from "../../components/fundo";
import { Cabecalho } from "../../components/Cabecalho";
import { LoginTitle } from "../../components/LoginTitle";
import { InputForm } from "../../components/Input";
import { BotaoLogar } from "../../components/BotaoLogar";
import { Logo } from "../../components/Logo";

import { Container, ContainerForm } from "./styles";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { adicionarPiso, listarPisos } from "../../utils/piso";
import { useState } from "react";
import { getCurrentUser } from "../../services/auth"; // Mudança aqui
import { useAuth } from "../../contexts/AuthContext"; // Adicionar este import
import { Alert } from "react-native";

type RootParamList = {
  App: { screen?: string };
  PisosAdicionados: undefined;
};

export function AdicionarPiso() {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { user } = useAuth(); // Usar o hook do contexto
  const [nomePiso, setNomePiso] = useState("");
  const [codigoPiso, setCodigoPiso] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function voltar() {
    return navigation.goBack();
  }

  // ✅ Função para debug - verificar estado dos pisos
  async function verificarEstadoPisos() {
    try {
      if (!user?.uid) {
        Alert.alert("Erro", "Usuário não está logado");
        return;
      }

      const result = await listarPisos(user.uid);

      if (result.success && result.data) {
        const mensagem =
          result.data.length > 0
            ? `Pisos encontrados (${result.data.length}):\n\n${result.data.join(
                "\n"
              )}`
            : "Nenhum piso encontrado na conta";

        Alert.alert("Debug - Pisos Atuais", mensagem);
      } else {
        Alert.alert("Debug - Erro", result.error || "Erro ao listar pisos");
      }
    } catch (error) {
      console.error("❌ Erro no debug:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      Alert.alert("Debug - Erro", errorMessage);
    }
  }

  async function handleAddPiso() {
    // Validações básicas
    if (!nomePiso.trim() || !codigoPiso.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    if (!user?.uid) {
      Alert.alert("Erro", "Usuário não está logado");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Limpar e validar os dados de entrada
      const codigoLimpo = codigoPiso.trim();
      const nomeLimpo = nomePiso.trim();

      if (!codigoLimpo) {
        Alert.alert("Erro", "Por favor, insira o código do piso");
        return;
      }

      if (!nomeLimpo) {
        Alert.alert("Erro", "Por favor, insira o nome do piso");
        return;
      }

      const result = await adicionarPiso(user.uid, codigoLimpo, nomeLimpo);

      if (result.success) {
        Alert.alert("Sucesso", "Piso adicionado com sucesso!", [
          {
            text: "OK",
            onPress: () => {
              // Limpar campos
              setNomePiso("");
              setCodigoPiso("");
              // Navegar de volta
              navigation.navigate("PisosAdicionados");
            },
          },
        ]);
      } else {
        // ✅ Tratamento específico de erros
        let mensagemErro = "Erro desconhecido";

        console.error("❌ Erro retornado:", result.error);

        if (result.error === "duplicate") {
          mensagemErro = "Este piso já foi adicionado à sua conta!";
        } else if (result.error === "Código inválido!") {
          mensagemErro =
            "Código do piso não encontrado. Verifique se o código está correto.";
        } else {
          mensagemErro = result.error || "Erro ao adicionar piso";
        }

        Alert.alert("Erro", mensagemErro);
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Fundo>
      <Cabecalho tipo="QUATERNARIO" funcao={voltar} />
      <Container>
        <LoginTitle text="Adicionar Piso" />
        <ContainerForm>
          <InputForm
            title="Nome do Piso"
            placeholder="Insira o nome do piso"
            icon="senha"
            value={nomePiso}
            onChangeText={setNomePiso}
          />
          <InputForm
            title="Código do piso"
            placeholder="Insira o código do piso"
            icon="key"
            value={codigoPiso}
            onChangeText={setCodigoPiso}
          />
        </ContainerForm>
        <BotaoLogar
          text={isLoading ? "Adicionando..." : "Adicionar Piso"}
          onPress={handleAddPiso}
          disabled={isLoading}
          style={{ marginBottom: 20 }}
        />

        <Logo />
      </Container>
    </Fundo>
  );
}
