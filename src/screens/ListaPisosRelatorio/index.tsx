import { Fundo } from "../../components/fundo";
import { Cabecalho } from "../../components/Cabecalho";
import { LoginTitle } from "../../components/LoginTitle";

import { Container } from "./styles";
import { FlatList } from "react-native";
import { CardPiso } from "./../../components/CardPiso";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  BackHandler,
  ToastAndroid,
  ActivityIndicator,
  Text,
} from "react-native";
import { useCallback, useRef, useState } from "react";

import { listarPisos } from "../../utils/piso";
import { useAuth } from "../../contexts/AuthContext";
import { Alert } from "react-native";

type RootParamList = {
  App: { screen?: string };
  Relatorio: { id: string; nome: string };
  ListaPisosRelatorio: undefined;
};

interface PisoInfo {
  nome: string;
  id: string;
}

export function ListaPisosRelatorio() {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { user } = useAuth();

  // ✅ Estados necessários
  const [pisos, setPisos] = useState<string[]>([]);
  const [pisoInfo, setPisoInfo] = useState<PisoInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Função para listar pisos do usuário
  async function listarPisosUser() {
    if (!user?.uid) {
      Alert.alert("Erro", "Usuário não está logado");
      setLoading(false);
      return;
    }

    try {
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

  // ✅ Função para processar dados dos pisos
  function setarNomeEId(pisosArray: string[]) {
    console.log("🔍 Dados recebidos do Firebase:", pisosArray);

    const pisosProcessados = pisosArray.map((piso, index) => {
      console.log(`📋 Piso ${index}:`, piso);

      const partes = piso.split(", ");
      console.log(`📋 Partes do split:`, partes);

      const resultado = {
        nome: partes[0],
        id: partes[1],
      };

      console.log(`📋 Resultado processado:`, resultado);
      return resultado;
    });

    console.log("🎯 Todos os pisos processados:", pisosProcessados);
    setPisoInfo(pisosProcessados);
  }

  // ✅ Função para refresh
  async function handleRefresh() {
    setRefreshing(true);
    await listarPisosUser();
  }

  // ✅ Variáveis para controle do botão voltar
  const backPressTimer = useRef<NodeJS.Timeout | null>(null);
  const backPressCount = useRef(0);

  // ✅ Funcionalidade de "pressione duas vezes para sair"
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        try {
          // Verificar se está em uma das telas principais da tab bar
          const state = navigation.getState();

          if (!state || !state.routes || state.index === undefined) {
            console.log("⚠️ Estado da navegação inválido");
            return false;
          }

          const currentRouteName = state.routes[state.index]?.name;

          console.log("🔍 Estado da navegação (ListaPisosRelatorio):", {
            currentRoute: currentRouteName,
            routeIndex: state.index,
            allRoutes: state.routes.map((r) => r.name),
          });

          // Verificar se está em uma tela principal
          const mainTabScreens = ["Principal", "ListaPisosRelatorio", "Perfil"];
          const isMainTabScreen = mainTabScreens.includes(
            currentRouteName || ""
          );

          if (isMainTabScreen) {
            backPressCount.current += 1;

            if (backPressCount.current === 1) {
              // Primeiro clique
              ToastAndroid.show(
                "Pressione novamente para sair",
                ToastAndroid.SHORT
              );

              // Reset o contador após 2 segundos
              backPressTimer.current = setTimeout(() => {
                backPressCount.current = 0;
              }, 2000);

              return true; // Previne sair do app
            } else if (backPressCount.current === 2) {
              // Segundo clique - sair do app
              if (backPressTimer.current) {
                clearTimeout(backPressTimer.current);
              }
              BackHandler.exitApp(); // Sai do app
              return false;
            }
          }

          // Se não é tela principal, comportamento normal de voltar
          return false;
        } catch (error) {
          console.log("❌ Erro ao verificar estado da navegação:", error);
          return false;
        }
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => {
        subscription.remove();
        if (backPressTimer.current) {
          clearTimeout(backPressTimer.current);
        }
      };
    }, [navigation])
  );

  // ✅ Carregar pisos quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setPisoInfo([]);
      listarPisosUser();
    }, [user?.uid])
  );

  return (
    <Fundo>
      <Cabecalho tipo="SECUNDARIO" />
      <Container>
        <LoginTitle text="Relatórios" />

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
                    type="PRINCIPAL"
                    onPress={() => {
                      console.log("🚀 Navegando com item:", item);
                      console.log("🚀 ID:", item.id);
                      console.log("🚀 Nome:", item.nome);

                      navigation.navigate("Relatorio", {
                        id: item.id,
                        nome: item.nome,
                      });
                    }}
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
                  Adicione um piso primeiro para ver os relatórios!
                </Text>
              </Container>
            )}
          </>
        )}
      </Container>
    </Fundo>
  );
}
