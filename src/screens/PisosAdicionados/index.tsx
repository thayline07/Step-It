import { Fundo } from "../../components/fundo";
import { Cabecalho } from "../../components/Cabecalho";
import { CardPiso } from "../../components/CardPiso";
import { LoginTitle } from "../../components/LoginTitle";

import {
  Container,
  TitleContainer,
  ButtonContainer,
  Texto,
  Icone,
} from "./styles";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { removerPiso, listarPisos } from "../../utils/piso";
import { useAuth } from "../../contexts/AuthContext";
import { ActivityIndicator, Alert, FlatList, Text } from "react-native";
import { useCallback, useState } from "react";

type RootParamList = {
  AdicionarPiso: undefined;
  App: { screen?: string };
};

interface PisoInfo {
  nome: string;
  id: string;
}

export function PisosAdicionados() {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { user } = useAuth();

  const [pisos, setPisos] = useState<String[]>([]);
  const [pisoInfo, setPisoInfo] = useState<PisoInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  function voltar() {
    return navigation.navigate("App", { screen: "Perfil" });
  }

  async function listarPisosUser() {
    if (!user?.uid) {
      Alert.alert("Erro", "Usuário não está logado");
      setLoading(false);
      return;
    }

    try {
      console.log("🔍 Buscando pisos do usuário:", user.uid);

      const result = await listarPisos(user.uid);

      if (result.success) {
        setPisos(result.data || []);
        setarNomeEId(result.data || []);
      } else {
        // Se não encontrou pisos, não é erro - usuário pode não ter pisos ainda
        if (
          result.error === "Usuário não possui pisos" ||
          result.error === "Usuário não encontrado"
        ) {
          setPisos([]);
          setPisoInfo([]);
        } else {
          Alert.alert("Erro", result.error || "Erro ao carregar pisos");
          setPisos([]);
          setPisoInfo([]);
        }
      }
    } catch (error) {
      console.error("❌ Erro inesperado ao listar pisos:", error);
      Alert.alert("Erro", "Erro inesperado ao carregar pisos");
      setPisos([]);
      setPisoInfo([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function setarNomeEId(pisosArray: string[]) {
    const pisosProcessados = pisosArray.map((piso) => ({
      nome: piso.split(", ")[0],
      id: piso.split(", ")[1],
    }));

    setPisoInfo(pisosProcessados);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await listarPisosUser();
  }

  async function handleRemoverPiso(pisoId: string, nomeCompleto: string) {
    Alert.alert("Remover Piso", "Tem certeza que deseja remover este piso?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          if (!user?.uid) {
            Alert.alert("Erro", "Usuário não está logado");
            return;
          }
          try {
            console.log("🗑️ Removendo piso:", { pisoId, nomeCompleto });

            // ✅ Verificar quantos parâmetros sua função removerPiso espera
            const result = await removerPiso(user.uid, pisoId, nomeCompleto);

            if (result.success) {
              Alert.alert("Sucesso", "Piso removido com sucesso!");
              await listarPisosUser();
            } else {
              Alert.alert("Erro", result.error || "Erro ao remover piso");
            }
          } catch (error) {
            Alert.alert("Erro", "Erro inesperado ao remover piso");
          }
        },
      },
    ]);
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setPisoInfo([]);
      listarPisosUser();
    }, [user?.uid])
  );

  return (
    <Fundo>
      <Cabecalho tipo="QUATERNARIO" funcao={voltar} />
      <Container>
        <TitleContainer>
          <LoginTitle text="Pisos" />
        </TitleContainer>

        {loading && (
          <Container
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <ActivityIndicator size="large" color="#1f86e0" />
          </Container>
        )}

        {!loading && (
          <>
            {pisoInfo.length > 0 ? (
              <FlatList
                style={{ marginVertical: 20 }}
                data={pisoInfo}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <CardPiso
                    key={item.id}
                    id={item.id}
                    nome={item.nome}
                    type="SECUNDARIO"
                    onPress={() =>
                      handleRemoverPiso(item.id, `${item.nome}, ${item.id}`)
                    }
                  />
                )}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Container
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Text
                  style={{ color: "#666", fontSize: 16, textAlign: "center" }}
                >
                  Nenhum piso adicionado ainda.{"\n"}
                  Clique em "Adicionar Piso" para começar!
                </Text>
              </Container>
            )}
          </>
        )}

        <ButtonContainer onPress={() => navigation.navigate("AdicionarPiso")}>
          <Icone />
          <Texto>Adicionar Piso</Texto>
        </ButtonContainer>
      </Container>
    </Fundo>
  );
}
