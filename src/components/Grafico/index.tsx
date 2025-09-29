import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";

import { LineChart } from "react-native-gifted-charts";
import { useTheme } from "styled-components/native";
import { PickerSelect } from "./../PickerSelect";

import { Gradient } from "./styles";

const WIDTH = 350;
const CHART_HEIGHT = 200;

type GraficoProps = {
  dataDiaria: number[];
  dataSemanal: number[];
  dataMensal: number[];
  value: string;
  setValue: (value: string) => void;
};

export function Grafico({
  dataDiaria,
  dataSemanal,
  dataMensal,
  value,
  setValue,
}: GraficoProps) {
  const theme = useTheme();

  // Calcula yMin/yMax com folga para não colar nos cantos
  const currentData =
    value === "Hoje"
      ? dataDiaria
      : value === "Semana"
      ? dataSemanal
      : dataMensal;
  const min = Math.min(...currentData) + 50;
  const max = Math.max(...currentData) + 61;
  const pad = Math.max(6, Math.round((max - min) * 0.08));
  const yMin = Math.min(0, min - pad);
  const yMax = max + pad;

  // Gerar labels para o eixo X
  const xLabels = (() => {
    const n = currentData.length;
    const denom = Math.max(1, n - 1);
    const kind = (String(value || "").toLowerCase() || "mensal").trim();

    if (kind === "hoje") {
      return currentData.map((_, i) => {
        const hour = Math.round((i / denom) * 24) % 24;
        return `${String(hour).padStart(2, "0")}h`;
      });
    }

    if (kind === "semana") {
      const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
      if (n === 7) return days;
      return currentData.map((_, i) => {
        const idx = Math.round((i / denom) * (days.length - 1));
        return days[idx];
      });
    }

    if (kind === "mês" || kind === "mes" || kind === "mensal") {
      const maxDay = 30;
      return currentData.map((_, i) => {
        const day = Math.round((i / denom) * (maxDay - 1)) + 1;
        return String(day).padStart(2, "0");
      });
    }

    return currentData.map((_, i) => String(i + 1).padStart(2, "0"));
  })();

  // Preparar dados para o gráfico
  const chartData = currentData.map((value, index) => ({
    value: value,
    label: xLabels[index] || "",
  }));

  return (
    <View
      style={{
        width: WIDTH,
        borderRadius: 30,
        marginVertical: 20,
        alignSelf: "center",
      }}
    >
      <PickerSelect
        value={value}
        setValue={setValue}
        items={[
          { label: "Hoje", value: "Hoje" },
          { label: "Semana", value: "Semana" },
          { label: "Mês", value: "Mês" },
        ]}
      />

      <Gradient colors={["#2FA8FF22", "#2FA8FF00"]} pointerEvents="none">
        <View style={{ padding: 16, paddingTop: 40 }}>
          <LineChart
            data={chartData}
            width={WIDTH - 80}
            height={CHART_HEIGHT}
            trimYAxisAtTop={true}
            spacing={value === "Hoje" ? 30 : value === "Semana" ? 40 : 35}
            // Usar suas variáveis de escala
            yAxisOffset={yMin}
            maxValue={yMax}
            mostNegativeValue={yMin}
            // Formatação do eixo Y
            formatYLabel={(value) => `${Math.round(Number(value))}`}
            // stepValue={Math.round((yMax - yMin) / 4)}
            yAxisLabelSuffix=" kWh"
            yAxisLabelContainerStyle={{ display: "flex", marginRight: 10 }}
            noOfSections={4}
            // Estilo da linha
            color="#2FA8FF"
            thickness={1.5}
            dataPointsColor="#2fa8ff"
            dataPointsRadius={3.5}
            dataPointsWidth={1}
            // Área preenchida
            areaChart
            startFillColor="#2FA8FF"
            endFillColor="#2FA8FF"
            startOpacity={0.3}
            endOpacity={0.001}
            // Curva suave
            curved
            // Cores dos eixos e textos

            xAxisColor={theme.colors.relatorios.texto}
            yAxisColor={theme.colors.relatorios.texto}
            xAxisIndicesWidth={1}
            // Estilos de texto
            xAxisLabelTextStyle={{
              color: theme.colors.relatorios.texto,
              fontSize: 12,
              textAlign: "right",
            }}
            yAxisTextStyle={{
              color: theme.colors.relatorios.texto,
              fontSize: 12,
            }}
            // Configurações adicionais
            backgroundColor="transparent"
            hideDataPoints={false}
            showVerticalLines={false}
            hideRules={false}
            hideAxesAndRules={false}
            // Espaçamento
            initialSpacing={10}
            endSpacing={0}
          />
        </View>
      </Gradient>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#fff",
    marginBottom: 8,
  },
});
