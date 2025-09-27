import { Cabecalho } from "./../../components/Cabecalho";
import { Fundo } from "../../components/fundo";
import {
  CardContainer,
  Subtitle,
  CardTitle,
  CardDate,
  CardValue,
  CardTexto,
  CardLinha,
  CardIconContainer,
  CardIcon,
  CardEconomia,
} from "./styles";

import { buscarUsuarioPorId } from "../../utils/buscarUsuario";
import { useAuth } from "../../contexts/AuthContext";

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTheme } from "styled-components/native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";
import { LightningIcon } from "phosphor-react-native";
import { useThemeContext } from "../../theme/ThemeProvider";

import { geracaoDiaria } from "../../utils/geracao";
import { listarPisos } from "../../utils/piso";
import { db } from "../../../firebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

import { BackHandler, Alert, ToastAndroid } from "react-native";
import { useRef } from "react";

type RootParamList = {
  App: { screen?: string };
  ListaPisosRelatorio: undefined;
  Perfil: undefined;
};

export function Principal() {
  const navigation = useNavigation();
  const theme = useTheme();
  const currentTheme = useThemeContext();

  // ✅ Memoizar função de tempo para evitar recálculos
  const getCurrentTimeAMPM = useCallback(() => {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  const [time, setTime] = useState(() => getCurrentTimeAMPM());
  const { user } = useAuth();
  const [usuarioDados, setUsuarioDados] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [geracaoTotal, setGeracaoTotal] = useState(0);
  const [loadingGeracao, setLoadingGeracao] = useState(true);
  const [economiaTotal, setEconomiaTotal] = useState(0);
  const [meusPisos, setMeusPisos] = useState<string[]>([]);
  const [listenersAtivos, setListenersAtivos] = useState<(() => void)[]>([]);
  const [dadosPorPiso, setDadosPorPiso] = useState<Map<string, number>>(
    new Map()
  );

  const backPressTimer = useRef<NodeJS.Timeout | null>(null);
  const backPressCount = useRef(0);

  const pisosTotais = async () => {
    try {
      const userId = user?.uid;
      if (!userId) {
        return [];
      }

      const result = await listarPisos(userId);

      if (result.success && result.data) {
        // ✅ Processar array de strings "nome, id" para extrair IDs
        const idsDosPisos = result.data.map((piso) => {
          const partes = piso.split(", ");
          const id = partes[1]; // Extrair apenas o ID

          return id;
        });

        return idsDosPisos;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  };

  // Função para recalcular total baseado nos dados por piso
  const atualizarTotalGeral = () => {
    let total = 0;
    dadosPorPiso.forEach((valor) => {
      total += valor;
    });

    const economia = total * 0.75;

    setGeracaoTotal(total);
    setEconomiaTotal(economia);
    setLoadingGeracao(false);
  };

  const calcularGeracaoTotal = async () => {
    try {
      setLoadingGeracao(true);

      // 1. Buscar todos os pisos do usuário
      const pisos = await pisosTotais();

      if (pisos.length === 0) {
        setGeracaoTotal(0);
        setEconomiaTotal(0);
        return;
      }

      // 2. Buscar geração de cada piso e somar
      let totalKWh = 0;
      let totalEconomia = 0;

      for (const pisoId of pisos) {
        const geracaoResult = await geracaoDiaria(pisoId);

        if (
          geracaoResult.success &&
          geracaoResult.data &&
          geracaoResult.data.length > 0
        ) {
          geracaoResult.data.forEach((registro: any) => {
            const corrente = registro.corrente || 0;
            const tensao = registro.tensao || 0;

            // Calcular kWh (Potência = Corrente × Tensão ÷ 1000)
            const kWhGerado = (corrente * tensao) / 1000;
            totalKWh += kWhGerado;
          });
          totalEconomia = totalKWh * 0.75;

          setGeracaoTotal(totalKWh);
          setEconomiaTotal(totalEconomia);
        }
      }
    } catch (error) {
      setGeracaoTotal(0);
      setEconomiaTotal(0);
    } finally {
      setLoadingGeracao(false);
    }
  };

  // Buscar pisos do usuário sempre que a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      const buscarPisos = async () => {
        if (user?.uid) {
          const pisos = await pisosTotais();
          setMeusPisos(pisos);
        }
      };

      buscarPisos();
    }, [user?.uid])
  );

  // ✅ Configurar listeners individuais para cada piso
  useEffect(() => {
    if (meusPisos.length === 0) {
      setGeracaoTotal(0);
      setEconomiaTotal(0);
      setLoadingGeracao(false);
      // ✅ Limpar todos os dados quando não há pisos
      setDadosPorPiso(new Map());
      return;
    }

    // Limpar listeners anteriores
    listenersAtivos.forEach((unsubscribe) => unsubscribe());

    // ✅ Limpar dados de pisos que não existem mais
    setDadosPorPiso((prevDados) => {
      const novosDados = new Map();
      // Manter apenas dados de pisos que ainda existem
      meusPisos.forEach((pisoId) => {
        if (prevDados.has(pisoId)) {
          novosDados.set(pisoId, prevDados.get(pisoId));
        }
      });

      return novosDados;
    });

    const agora = new Date();
    const vintEQuatroHorasAtras = new Date(
      agora.getTime() - 24 * 60 * 60 * 1000
    );
    const timestampLimite = Timestamp.fromDate(vintEQuatroHorasAtras);

    const geracaoRef = collection(db, "geracao");
    const novosListeners: (() => void)[] = [];

    // ✅ Criar listeners individuais para cada piso (sem índice complexo)
    meusPisos.forEach((pisoId) => {
      // Query simples - sem filtro de data para evitar índice
      const qPiso = query(
        collection(db, "geracao"),
        where("id_piso", "==", pisoId)
      );

      const unsubscribe = onSnapshot(qPiso, (snapshot) => {
        let totalPiso = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();

          // ✅ Filtrar manualmente por data das últimas 24h
          if (data.data_cadastro && data.data_cadastro.toDate) {
            const dataDoc = data.data_cadastro.toDate();
            if (dataDoc >= vintEQuatroHorasAtras) {
              const corrente = data.corrente || 0;
              const tensao = data.tensao || 0;
              const kWhGerado = (corrente * tensao) / 1000;
              totalPiso += kWhGerado;
            }
          }
        });

        setDadosPorPiso((prev) => {
          const novoMap = new Map(prev);
          novoMap.set(pisoId, totalPiso);
          return novoMap;
        });
      });

      novosListeners.push(unsubscribe);
    });

    // Armazenar listeners para cleanup
    setListenersAtivos(novosListeners);

    // Cleanup: remover todos os listeners
    return () => {
      novosListeners.forEach((unsubscribe) => unsubscribe());
    };
  }, [meusPisos]);

  // ✅ Atualizar totais sempre que dadosPorPiso mudar
  useEffect(() => {
    atualizarTotalGeral();
  }, [dadosPorPiso]);

  // Atualizar filtro de 24h a cada minuto para manter precisão
  useEffect(() => {
    const interval = setInterval(() => {
      if (meusPisos.length > 0) {
        // Força re-render do useEffect anterior mudando uma dependência
        setMeusPisos((prev) => [...prev]);
      }
    }, 60000); // A cada 1 minuto

    return () => clearInterval(interval);
  }, []);

  // ✅ Memoizar SVG para evitar recriação desnecessária
  const fundoEfeito = useMemo(() => {
    if (currentTheme.themeName === "dark") {
      return (
        <Svg height="200" width="200">
          <Defs>
            <RadialGradient
              id="grad"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <Stop
                offset="30%"
                stopColor={theme.colors.color_circulo}
                stopOpacity="0.1"
              />
              <Stop
                offset="100%"
                stopColor={theme.colors.color_circulo}
                stopOpacity="0.2"
              />
            </RadialGradient>
          </Defs>
          <Circle cx="100" cy="100" r="100" fill="url(#grad)" />
        </Svg>
      );
    }
    return null;
  }, [currentTheme.themeName, theme.colors.color_circulo]);

  // Buscar dados do usuário quando o componente montar
  useEffect(() => {
    async function carregarDadosUsuario() {
      if (user?.uid) {
        setLoadingUser(true);

        const resultado = await buscarUsuarioPorId(user.uid);

        if (resultado.success) {
          setUsuarioDados(resultado.data);
        } else {
          setUsuarioDados(null);
        }

        setLoadingUser(false);
      }
    }

    carregarDadosUsuario();
  }, [user?.uid]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTimeAMPM());
    }, 1000);
    return () => clearInterval(interval);
  }, [getCurrentTimeAMPM]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        let isMainTabScreen = false;
        try {
          // Verificar se está em uma das telas principais da tab bar
          const state = navigation.getState();

          if (!state || !state.routes || state.index === undefined) {
            return false;
          }

          const currentRouteName = state.routes[state.index]?.name;

          console.log("🔍 Estado da navegação:", {
            currentRoute: currentRouteName,
            routeIndex: state.index,
            allRoutes: state.routes.map((r) => r.name),
          });

          // Verificar se está em uma tela principal (ajuste os nomes conforme sua estrutura)
          isMainTabScreen =
            currentRouteName === "Principal" ||
            currentRouteName === "ListaPisosRelatorio" ||
            currentRouteName === "Perfil";
        } catch (error) {
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
      <Cabecalho tipo="PRINCIPAL" />
      <View
        style={[
          styles.container,
          {
            borderWidth: 1,
            borderColor: theme.colors.circulo_borda,
            borderRadius: 132,
            shadowColor: theme.colors.sombra,
            elevation: 70,
          },
        ]}
      >
        <LinearGradient
          colors={[
            theme.colors.circulo_degrade[0],
            theme.colors.circulo_degrade[1],
          ]}
          style={styles.gradientCircle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View
            style={[
              styles.innerCircle,
              { backgroundColor: theme.colors.background_principal },
            ]}
          >
            {fundoEfeito}
            <View
              style={{
                position: "absolute",
                top: "auto",
                alignItems: "center",
              }}
            >
              <LightningIcon
                size={20}
                color={theme.colors.raio}
                style={{ marginBottom: 8 }}
                weight="fill"
              />
              <Text style={[styles.value, { color: theme.colors.numero }]}>
                {loadingGeracao ? "..." : geracaoTotal.toFixed(2)}
              </Text>
              <Text
                style={[styles.unit, { color: theme.colors.numero_legenda }]}
              >
                kWh
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
      <Subtitle>Energia Gerada Hoje</Subtitle>
      <CardContainer colors={[theme.colors.card[0], theme.colors.card[1]]}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 13,
            marginLeft: 15,
            marginRight: 15,
            alignItems: "center",
          }}
        >
          <CardTitle>Total de Energia Hoje</CardTitle>
          <CardDate>{time}</CardDate>
        </View>
        <CardValue>
          {loadingGeracao ? "..." : geracaoTotal.toFixed(2)} kWh
        </CardValue>
        <CardTexto>
          O piso gerou um total de{" "}
          {loadingGeracao ? "..." : geracaoTotal.toFixed(2)} kWh até agora
        </CardTexto>
        <CardLinha />
        <View
          style={{
            alignSelf: "center",
            display: "flex",
            flexDirection: "row",
            marginTop: 20,
          }}
        >
          <CardIconContainer>
            <CardIcon size={22} color={theme.colors.titulo_card} />
          </CardIconContainer>
          <View>
            <CardEconomia>
              R$
              {loadingGeracao ? "..." : economiaTotal.toFixed(2)}
            </CardEconomia>
            <CardTexto>Economia</CardTexto>
          </View>
        </View>
      </CardContainer>
    </Fundo>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    width: 263,
    height: 263,
  },
  gradientCircle: {
    width: 215.44,
    height: 215.44,
    borderRadius: 110,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  innerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 2,
  },
  unit: {
    fontSize: 17,
    fontWeight: 400,
    letterSpacing: 1,
  },
});
