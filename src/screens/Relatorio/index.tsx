import { useRoute } from "@react-navigation/native";
import { Text, View } from "react-native";

import { useThemeContext } from "../../theme/ThemeProvider";

import { Cabecalho } from "../../components/Cabecalho";
import { Fundo } from "../../components/fundo";
import { Grafico } from "../../components/Grafico";
import {
  Container,
  CardGrafico,
  Title,
  ContainerIcon,
  Icon,
  CabecalhoGrafico,
  Texto,
  CardEconomia,
  IconTrofeu,
  Numbers,
  Info,
} from "./styles";
import { useTheme } from "styled-components/native";

export function Relatorio() {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const theme = useTheme();

  const currentTheme = useThemeContext();
  const gradientColors =
    currentTheme.themeName == "dark"
      ? ["#2FA8FF00", "#2FA8FF0f"]
      : ["#fff", "#fff"];

  return (
    <Fundo>
      <Cabecalho tipo="SECUNDARIO" />
      <Container>
        <CardGrafico colors={[gradientColors[0], gradientColors[1]]}>
          <CabecalhoGrafico>
            <ContainerIcon
              colors={[
                theme.colors.relatorios.background_icone_voltar[0],
                theme.colors.relatorios.background_icone_voltar[1],
              ]}
            >
              <Icon />
            </ContainerIcon>
            <Title>Estat. Geração de Energia</Title>
          </CabecalhoGrafico>
          <Grafico />
          <Texto>Poxa, sua geração de energia diminuiu 56% esta semana.</Texto>
        </CardGrafico>
        <CardEconomia colors={[gradientColors[0], gradientColors[1]]}>
          <CabecalhoGrafico>
            <ContainerIcon
              colors={[
                theme.colors.relatorios.background_icone_voltar[0],
                theme.colors.relatorios.background_icone_voltar[1],
              ]}
            >
              <IconTrofeu />
            </ContainerIcon>
            <Title>Estat. Economia de Energia</Title>
          </CabecalhoGrafico>
          <View style={{ marginTop: 13 }}>
            <Info>
              <Texto>Geração Total</Texto>
              <Numbers>100 kWh</Numbers>
            </Info>
            <Info>
              <Texto>Economia</Texto>
              <Numbers>R$ 50,00</Numbers>
            </Info>
          </View>
        </CardEconomia>
      </Container>
    </Fundo>
  );
}
