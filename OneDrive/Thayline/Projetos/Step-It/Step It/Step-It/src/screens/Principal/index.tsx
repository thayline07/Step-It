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

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { useTheme } from "styled-components/native";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";
import { LightningIcon } from "phosphor-react-native";
import { useThemeContext } from "../../theme/ThemeProvider";

export function Principal() {
  const theme = useTheme();
  const currentTheme = useThemeContext();
  console.log(currentTheme);
  const [time, setTime] = useState(getCurrentTimeAMPM());

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
