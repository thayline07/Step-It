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
import { useEffect, useState } from "react";
import {
  buscarGeracaoDiaria,
  buscarGeracaoMensal,
  buscarGeracaoSemanal,
} from "../../utils/geracao";

export function Relatorio() {
  const route = useRoute();
  const { id, nome } = route.params as { id: string; nome: string };
  const theme = useTheme();
  const [graficoPeriod, setGraficoPeriod] = useState("Hoje");

  const [dadosEnergia, setDadosEnergia] = useState({
    diaria: {
      grafico: new Array(7).fill(0),
      total: 0,
    },
    semanal: {
      grafico: new Array(7).fill(0),
      total: 0,
    },
    mensal: {
      grafico: new Array(7).fill(0),
      total: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  const currentTheme = useThemeContext();
  const gradientColors =
    currentTheme.themeName == "dark"
      ? ["#2FA8FF00", "#2FA8FF0f"]
      : ["#fff", "#fff"];

  useEffect(() => {
    if (!id) return;

    console.log("🚀 Iniciando busca para piso:", id);
    console.log("🚀 Nome do piso:", nome);

    const unsubscribers: any = [];

    // Dados diários
    const unsubDiaria = buscarGeracaoDiaria(id, (dados) => {
      setDadosEnergia((prev) => ({
        ...prev,
        diaria: {
          grafico: dados.grafico,
          total: dados.total,
        },
      }));
      setLoading(false);
    });

    // Dados semanais
    const unsubSemanal = buscarGeracaoSemanal(id, (dados) => {
      setDadosEnergia((prev) => ({
        ...prev,
        semanal: {
          grafico: dados.grafico,
          total: dados.total,
        },
      }));
    });

    // Dados mensais
    const unsubMensal = buscarGeracaoMensal(id, (dados) => {
      setDadosEnergia((prev) => ({
        ...prev,
        mensal: {
          grafico: dados.grafico,
          total: dados.total,
        },
      }));
    });

    unsubscribers.push(unsubDiaria, unsubSemanal, unsubMensal);

    return () => {
      unsubscribers.forEach((unsub) => {
        if (typeof unsub === "function") {
          unsub();
        }
      });
    };
  }, [id]);

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
            <Title>Estat. Geração - {nome}</Title>
          </CabecalhoGrafico>
          <Grafico
            dataDiaria={dadosEnergia.diaria.grafico}
            dataSemanal={dadosEnergia.semanal.grafico}
            dataMensal={dadosEnergia.mensal.grafico}
            value={graficoPeriod}
            setValue={setGraficoPeriod}
          />
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
              <Numbers>
                {graficoPeriod === "Hoje"
                  ? (dadosEnergia.diaria.total * 0.65).toFixed(1)
                  : graficoPeriod === "Semana"
                  ? (dadosEnergia.semanal.total * 0.65).toFixed(1)
                  : (dadosEnergia.mensal.total * 0.65).toFixed(1)}
                kWh
              </Numbers>
            </Info>
            <Info>
              <Texto>Economia</Texto>
              <Numbers>
                R${" "}
                {graficoPeriod === "Hoje"
                  ? (dadosEnergia.diaria.total * 0.65).toFixed(2)
                  : graficoPeriod === "Semana"
                  ? (dadosEnergia.semanal.total * 0.65).toFixed(2)
                  : (dadosEnergia.mensal.total * 0.65).toFixed(2)}
              </Numbers>
            </Info>
          </View>
        </CardEconomia>
      </Container>
    </Fundo>
  );
}
