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
import { useState, useEffect } from "react";
import { useTheme } from "styled-components/native";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";
import { LightningIcon } from "phosphor-react-native";
import { useThemeContext } from "../../theme/ThemeProvider";

import { geracaoDiaria } from "../../utils/geracao";
import { listarPisos } from "../../utils/piso";

export function Principal() {
  const theme = useTheme();
  const currentTheme = useThemeContext();
  console.log(currentTheme);
  const [time, setTime] = useState(getCurrentTimeAMPM());
  const { user } = useAuth();
  const [usuarioDados, setUsuarioDados] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [geracaoTotal, setGeracaoTotal] = useState(0);
  const [loadingGeracao, setLoadingGeracao] = useState(true);
  const [economiaTotal, setEconomiaTotal] = useState(0);

  const pisosTotais = async () => {
    try {
      const userId = user?.uid;
      if (!userId) {
        console.log("❌ Usuário não logado");
        return [];
      }

      const result = await listarPisos(userId);

      if (result.success && result.data) {
        // ✅ Processar array de strings "nome, id" para extrair IDs
        const idsDosPisos = result.data.map((piso) => {
          const id = piso.split(", ")[1]; // Extrair apenas o ID
          return id;
        });
        return idsDosPisos;
      } else {
        console.log("⚠️ Nenhum piso encontrado ou erro:", result.error);
        return [];
      }
    } catch (error) {
      console.error("❌ Erro ao buscar pisos:", error);
      return [];
    }
  };

  const calcularGeracaoTotal = async () => {
    try {
      setLoadingGeracao(true);

      // 1. Buscar todos os pisos do usuário
      const pisos = await pisosTotais();

      if (pisos.length === 0) {
        console.log("📭 Usuário não possui pisos");
        setGeracaoTotal(0);
        setEconomiaTotal(0);
        return;
      }

      // 2. Buscar geração de cada piso e somar
      let totalKw = 0;
      let totalEconomia = 0;

      for (const pisoId of pisos) {
        const geracaoResult = await geracaoDiaria(pisoId);

        if (geracaoResult.success && geracaoResult.data) {
          // Somar a geração de todos os registros deste piso
          geracaoResult.data.forEach((registro) => {
            const corrente = registro.corrente || 0; // Assumindo que tem um campo corrente
            const tensao = registro.tensao || 0; // Assumindo que tem um campo tensao
            totalKw += (corrente * tensao) / 1000;

            // Calcular economia (exemplo: R$ 0,50 por kW)
            totalEconomia += totalKw * 0.75;

            console.log(`⚡ Piso ${pisoId}: +${(corrente * tensao) / 1000} kW`);
          });
        } else {
          console.log(`⚠️ Nenhuma geração encontrada para piso ${pisoId}`);
        }
      }

      console.log(`🎯 Geração total calculada: ${totalKw} kW`);
      console.log(
        `💰 Economia total calculada: R$ ${totalEconomia.toFixed(2)}`
      );

      setGeracaoTotal(totalKw);
      setEconomiaTotal(totalEconomia);
    } catch (error) {
      console.error("❌ Erro ao calcular geração total:", error);
      setGeracaoTotal(0);
      setEconomiaTotal(0);
    } finally {
      setLoadingGeracao(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      console.log("🚀 Usuário logado, calculando geração...");
      calcularGeracaoTotal();
    }
  }, [user?.uid]);

  function fundoEfeito() {
    if (currentTheme.themeName == "dark") {
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
    } else {
      return null;
    }
  }

  function getCurrentTimeAMPM() {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

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

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTimeAMPM());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
            {fundoEfeito()}
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
                0
              </Text>
              <Text
                style={[styles.unit, { color: theme.colors.numero_legenda }]}
              >
                kW
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
          <CardDate>{getCurrentTimeAMPM()}</CardDate>
        </View>
        <CardValue>0 kW</CardValue>
        <CardTexto>O piso gerou um total de 0 kW até agora</CardTexto>
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
            <CardEconomia>R$0,00</CardEconomia>
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
