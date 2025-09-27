import { Cabecalho } from "../../components/Cabecalho";
import { Fundo } from "../../components/fundo";
import { CardPerfil } from "../../components/CardPerfil";

import {
  Container,
  Title,
  Imagem,
  ContainerIcon,
  Icon,
  Usuario,
  Link,
  LinkTexto,
} from "./styles";

import { FlatList, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState, useEffect } from "react";

// Imports para autenticação
import { deslogar } from "../../services/auth";
import { useAuth } from "../../contexts/AuthContext";
import { buscarUsuarioPorId } from "../../utils/buscarUsuario";

import { useFocusEffect } from "@react-navigation/native";
import { BackHandler, ToastAndroid } from "react-native";
import { useCallback, useRef } from "react";

type RootParamList = {
  App: { screen?: string };
  TrocarSenhaCodigo: undefined;
  PisosAdicionados: undefined;
  EditarNome: undefined;
  TrocarEmail: undefined;
  PoliticaPrivacidade: undefined;
};

export function Perfil() {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { user } = useAuth(); // Pegar dados do usuário logado
  const [usuarioDados, setUsuarioDados] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const backPressCount = useRef(0);
  const backPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Buscar dados do usuário quando o componente montar
  useEffect(() => {
    async function carregarDadosUsuario() {
      if (user?.uid) {
        setLoadingUser(true);

        const resultado = await buscarUsuarioPorId(user.uid);

        if (resultado.success) {
          setUsuarioDados(resultado.data);
        } else {
          console.error("❌ Erro ao buscar usuário:", resultado.error);
          setUsuarioDados(null);
        }

        setLoadingUser(false);
      }
    }

    carregarDadosUsuario();
  }, [user?.uid]);

  // Função para fazer logout
  async function handleLogout() {
    Alert.alert("Sair da Conta", "Tem certeza que deseja sair da sua conta?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            console.log("🚪 Iniciando logout...");
            const result = await deslogar();

            if (result.success) {
              console.log("✅ Logout realizado com sucesso!");
              // O redirecionamento será automático pelo AuthContext
            } else {
              console.error("❌ Erro no logout:", result.error);
              Alert.alert(
                "Erro",
                "Não foi possível sair da conta. Tente novamente."
              );
            }
          } catch (error) {
            console.error("❌ Erro inesperado no logout:", error);
            Alert.alert("Erro", "Ocorreu um erro inesperado ao sair da conta.");
          }
        },
      },
    ]);
  }

  const cards = [
    {
      id: "1",
      texto: "Adicionar Pisos",
      tipo: "plus" as const,
      acao: () => navigation.navigate("PisosAdicionados"),
    },
    {
      id: "2",
      texto: "Editar Nome",
      tipo: "pencil" as const,
      acao: () => navigation.navigate("EditarNome"),
    },
    {
      id: "3",
      texto: "Trocar E-mail",
      tipo: "pen" as const,
      acao: () => navigation.navigate("TrocarEmail"),
    },
    {
      id: "4",
      texto: "Trocar Senha",
      tipo: "key" as const,
      acao: () => navigation.navigate("TrocarSenhaCodigo"),
    },
    {
      id: "5",
      texto: "Sair da Conta",
      tipo: "logout" as const,
      acao: handleLogout, // ← Conectar com a função de logout
    },
  ];

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

          console.log("🔍 Estado da navegação (Perfil):", {
            currentRoute: currentRouteName,
            routeIndex: state.index,
            allRoutes: state.routes.map((r) => r.name),
          });

          // Verificar se está em uma tela principal
          const mainTabScreens = [
            "Principal",
            "ListaPisosRelatorio",
            "Perfil",
            "PisosAdicionados",
          ];
          const isMainTabScreen = mainTabScreens.includes(
            currentRouteName || ""
          );
        } catch (error) {
          console.log("❌ Erro ao verificar estado da navegação:", error);
          return false;
        }

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

  return (
    <Fundo>
      <Cabecalho tipo="TERCIARIO" />
      <Container>
        <Title>Perfil</Title>
        <Imagem source={require("./../../assets/perfil.png")} />
        <ContainerIcon>
          <Icon size={24} />
        </ContainerIcon>
        <Usuario>
          {loadingUser
            ? "Carregando..."
            : usuarioDados?.nome || user?.email || "Usuário"}
        </Usuario>
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CardPerfil texto={item.texto} tipo={item.tipo} acao={item.acao} />
          )}
          ListFooterComponent={
            <Link onPress={() => navigation.navigate("PoliticaPrivacidade")}>
              <LinkTexto>Política de Privacidade</LinkTexto>
            </Link>
          }
        />
        {/* <Link>
          <LinkTexto>Política de Privacidade</LinkTexto>
        </Link> */}
      </Container>
    </Fundo>
  );
}
