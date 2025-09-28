// import React, { useState } from "react";
// import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";

// import { LineChart } from 'react-native-gifted-charts';
// // import { AreaChart, LineChart, XAxis, YAxis } from "react-native-svg-charts";
// import * as shape from "d3-shape";
// import { Defs, Stop, Circle } from "react-native-svg";
// import { LinearGradient } from "react-native-svg";
// import { useTheme } from "styled-components/native";
// import { PickerSelect } from "./../PickerSelect";

// import { Gradient } from "./styles";

// const WIDTH = 350;
// const CHART_HEIGHT = 239;
// const CONTENT_INSET = { top: 20, bottom: 20 };

// type GraficoProps = {
//   dataDiaria: number[];
//   dataSemanal: number[];
//   dataMensal: number[];
// };

// export function Grafico({ dataDiaria, dataSemanal, dataMensal }: GraficoProps) {
//   const [value, setValue] = useState("Hoje");
//   const theme = useTheme();
//   // calcula yMin/yMax com folga para não colar nos cantos
//   const min =
//     Math.min(
//       ...(value === "Hoje"
//         ? dataDiaria
//         : value === "Semana"
//         ? dataSemanal
//         : dataMensal)
//     ) + 50;
//   const max =
//     Math.max(
//       ...(value === "Hoje"
//         ? dataDiaria
//         : value === "Semana"
//         ? dataSemanal
//         : dataMensal)
//     ) + 61;
//   const pad = Math.max(6, Math.round((max - min) * 0.08));
//   const yMin = Math.min(0, min - pad);
//   const yMax = max + pad;

//   // decorator para desenhar pontos
//   const Points = ({ x, y, data: pts = [] }) =>
//     pts.map((v, i) => <Circle key={i} cx={x(i)} cy={y(v)} r={2} fill="#fff" />);

//   // const xLabels = data.map((_, i) => String(i + 1).padStart(2, "0"));
//   const xLabels = (() => {
//     const n =
//       value === "Hoje"
//         ? dataDiaria.length
//         : value === "Semana"
//         ? dataSemanal.length
//         : dataMensal.length;
//     const denom = Math.max(1, n - 1);

//     const kind = (String(value || "").toLowerCase() || "mensal").trim();

//     if (kind === "hoje") {
//       // horários distribuídos ao longo de 24h
//       return dataDiaria.map((_, i) => {
//         const hour = Math.round((i / denom) * 24) % 24;
//         return `${String(hour).padStart(2, "0")}h`;
//       });
//     }

//     if (kind === "semana") {
//       const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
//       if (n === 7) return days;
//       // distribui os dias pelos índices (amostragem)
//       return dataSemanal.map((_, i) => {
//         const idx = Math.round((i / denom) * (days.length - 1));
//         return days[idx];
//       });
//     }

//     if (kind === "mês" || kind === "mes" || kind === "mensal") {
//       // dias do mês (01..30/31) distribuídos
//       const maxDay = 30;
//       return dataMensal.map((_, i) => {
//         const day = Math.round((i / denom) * (maxDay - 1)) + 1;
//         return String(day).padStart(2, "0");
//       });
//     }

//     const data =
//       value === "Hoje"
//         ? dataDiaria
//         : value === "Semana"
//         ? dataSemanal
//         : dataMensal;

//     // fallback: índices
//     return data.map((_, i) => String(i + 1).padStart(2, "0"));
//   })();

//   // labels X simples (1,2,3...) - ajuste conforme precisar

//   return (
//     <View
//       style={{
//         width: WIDTH,
//         borderRadius: 30,
//         marginVertical: 20,
//         alignSelf: "center",
//       }}
//     >
//       <PickerSelect
//         value={value}
//         setValue={setValue}
//         items={[
//           { label: "Hoje", value: "Hoje" },
//           { label: "Semana", value: "Semana" },
//           { label: "Mês", value: "Mês" },
//         ]}
//       />
//       <Gradient colors={["#2FA8FF22", "#2FA8FF00"]} pointerEvents="none">
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           <YAxis
//             data={[yMin, yMax]} // NÃO passar dados brutos aqui
//             contentInset={CONTENT_INSET}
//             svg={{
//               fill: theme.colors.relatorios.texto,
//               fontSize: 12,
//             }}
//             numberOfTicks={4}
//             style={{ marginBottom: 30, marginLeft: 10 }}
//             min={yMin}
//             max={yMax}
//             formatLabel={(value) => `${Math.round(value)} kWh`}
//           />
//           <View style={{ flex: 1, marginLeft: 8, marginRight: 16 }}>
//             <View style={{ height: CHART_HEIGHT }}>
//               <AreaChart
//                 style={{ flex: 1 }}
//                 data={
//                   value === "Hoje"
//                     ? dataDiaria
//                     : value === "Semana"
//                     ? dataSemanal
//                     : dataMensal
//                 }
//                 contentInset={CONTENT_INSET}
//                 yMin={yMin}
//                 yMax={yMax}
//                 curve={shape.curveMonotoneX}
//                 svg={{ fill: "url(#grad)" }}
//               >
//                 <Defs>
//                   <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
//                     <Stop offset="0%" stopColor="#2FA8FF" stopOpacity="0.3" />
//                     <Stop
//                       offset="100%"
//                       stopColor="#2FA8FF"
//                       stopOpacity="0.001"
//                     />
//                   </LinearGradient>
//                 </Defs>
//               </AreaChart>

//               <LineChart
//                 style={StyleSheet.absoluteFill}
//                 data={
//                   value === "Hoje"
//                     ? dataDiaria
//                     : value === "Semana"
//                     ? dataSemanal
//                     : dataMensal
//                 }
//                 yMin={yMin}
//                 yMax={yMax}
//                 contentInset={CONTENT_INSET}
//                 curve={shape.curveMonotoneX}
//                 svg={{
//                   stroke: theme.colors.relatorios.linha_grafico,
//                   strokeWidth: 1.5,
//                 }}
//               >
//                 <Points />
//               </LineChart>
//             </View>

//             <XAxis
//               style={{ marginBottom: 10 }}
//               data={
//                 value === "Hoje"
//                   ? dataDiaria
//                   : value === "Semana"
//                   ? dataSemanal
//                   : dataMensal
//               }
//               formatLabel={(value, index) => xLabels[index]}
//               contentInset={{ left: 10, right: 10 }}
//               svg={{ fill: theme.colors.relatorios.texto, fontSize: 12 }}
//             />
//           </View>
//         </View>
//       </Gradient>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   title: { color: "#fff", marginBottom: 8 },
//   botao: {},
// });

import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";

import { LineChart } from "react-native-gifted-charts";
import { useTheme } from "styled-components/native";
import { PickerSelect } from "./../PickerSelect";

import { Gradient } from "./styles";

const WIDTH = 350;
const CHART_HEIGHT = 239;

type GraficoProps = {
  dataDiaria: number[];
  dataSemanal: number[];
  dataMensal: number[];
};

export function Grafico({ dataDiaria, dataSemanal, dataMensal }: GraficoProps) {
  const [value, setValue] = useState("Hoje");
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
        <View style={{ padding: 16 }}>
          <LineChart
            data={chartData}
            width={WIDTH - 60}
            height={CHART_HEIGHT}
            // Usar suas variáveis de escala
            yAxisOffset={yMin}
            maxValue={yMax}
            mostNegativeValue={yMin}
            // Formatação do eixo Y
            formatYLabel={(value) => `${Math.round(value)} kWh`}
            noOfSections={4}
            // Estilo da linha
            color="#2FA8FF"
            thickness={1.5}
            dataPointsColor="#fff"
            dataPointsRadius={2}
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
            rulesColor={theme.colors.relatorios.texto + "40"}
            rulesType="solid"
            xAxisColor={theme.colors.relatorios.texto + "60"}
            yAxisColor={theme.colors.relatorios.texto + "60"}
            // Estilos de texto
            xAxisLabelTextStyle={{
              color: theme.colors.relatorios.texto,
              fontSize: 12,
              textAlign: "center",
            }}
            yAxisLabelTextStyle={{
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
            endSpacing={10}
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
