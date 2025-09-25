import { Fundo } from "../../components/fundo";
import { Cabecalho } from "../../components/Cabecalho";
import { LoginTitle } from "../../components/LoginTitle";
import { InputForm } from "../../components/Input";
import { BotaoLogar } from "../../components/BotaoLogar";
import { Logo } from "../../components/Logo";

import { Container, ContainerForm } from "./styles";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { adicionarPiso, listarPisos, removerPiso } from "../../utils/piso";
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
      const result = await adicionarPiso(user.uid, codigoPiso, nomePiso);

      console.log(user.uid, codigoPiso, nomePiso);

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
        console.error("❌ Erro retornado:", result.error);
        Alert.alert("Erro", result.error || "Erro ao adicionar piso");
      }
    } catch (error) {
      console.error("❌ Erro inesperado:", error);
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
          style={{ marginBottom: 50 }}
        />
        <Logo />
      </Container>
    </Fundo>
  );
}
