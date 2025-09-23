import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import { AreaChart, LineChart, XAxis, YAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { Defs, Stop, Circle } from "react-native-svg";
import { LinearGradient } from "react-native-svg";
import { useTheme } from "styled-components/native";
import { PickerSelect } from "./../PickerSelect";

import { Gradient } from "./styles";

const WIDTH = 350;
const CHART_HEIGHT = 239;
const CONTENT_INSET = { top: 20, bottom: 20 };

export function Grafico({ data = [0, 40, 80, 30, 100, 20, 100] }) {
  const [value, setValue] = useState("Hoje");
  const theme = useTheme();
  // calcula yMin/yMax com folga para não colar nos cantos
  const min = Math.min(...data) + 50;
  const max = Math.max(...data) + 61;
  const pad = Math.max(6, Math.round((max - min) * 0.08));
  const yMin = Math.min(0, min - pad);
  const yMax = max + pad;

  // decorator para desenhar pontos
  const Points = ({ x, y, data: pts = [] }) =>
    pts.map((v, i) => <Circle key={i} cx={x(i)} cy={y(v)} r={2} fill="#fff" />);

  // const xLabels = data.map((_, i) => String(i + 1).padStart(2, "0"));
  const xLabels = (() => {
    const n = data.length;
    const denom = Math.max(1, n - 1);

    const kind = (String(value || "").toLowerCase() || "mensal").trim();

    if (kind === "hoje") {
      // horários distribuídos ao longo de 24h
      return data.map((_, i) => {
        const hour = Math.round((i / denom) * 24) % 24;
        return `${String(hour).padStart(2, "0")}h`;
      });
    }

    if (kind === "semana") {
      const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
      if (n === 7) return days;
      // distribui os dias pelos índices (amostragem)
      return data.map((_, i) => {
        const idx = Math.round((i / denom) * (days.length - 1));
        return days[idx];
      });
    }

    if (kind === "mês" || kind === "mes" || kind === "mensal") {
      // dias do mês (01..30/31) distribuídos
      const maxDay = 30;
      return data.map((_, i) => {
        const day = Math.round((i / denom) * (maxDay - 1)) + 1;
        return String(day).padStart(2, "0");
      });
    }

    // fallback: índices
    return data.map((_, i) => String(i + 1).padStart(2, "0"));
  })();

  // labels X simples (1,2,3...) - ajuste conforme precisar

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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <YAxis
            data={[yMin, yMax]} // NÃO passar dados brutos aqui
            contentInset={CONTENT_INSET}
            svg={{
              fill: theme.colors.relatorios.texto,
              fontSize: 12,
            }}
            numberOfTicks={4}
            style={{ marginBottom: 30, marginLeft: 10 }}
            min={yMin}
            max={yMax}
            formatLabel={(value) => `${Math.round(value)} kWh`}
          />
          <View style={{ flex: 1, marginLeft: 8, marginRight: 16 }}>
            <View style={{ height: CHART_HEIGHT }}>
              <AreaChart
                style={{ flex: 1 }}
                data={data}
                contentInset={CONTENT_INSET}
                yMin={yMin}
                yMax={yMax}
                curve={shape.curveMonotoneX}
                svg={{ fill: "url(#grad)" }}
              >
                <Defs>
                  <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#2FA8FF" stopOpacity="0.3" />
                    <Stop
                      offset="100%"
                      stopColor="#2FA8FF"
                      stopOpacity="0.001"
                    />
                  </LinearGradient>
                </Defs>
              </AreaChart>

              <LineChart
                style={StyleSheet.absoluteFill}
                data={data}
                yMin={yMin}
                yMax={yMax}
                contentInset={CONTENT_INSET}
                curve={shape.curveMonotoneX}
                svg={{
                  stroke: theme.colors.relatorios.linha_grafico,
                  strokeWidth: 1.5,
                }}
              >
                <Points />
              </LineChart>
            </View>

            <XAxis
              style={{ marginBottom: 10 }}
              data={data}
              formatLabel={(value, index) => xLabels[index]}
              contentInset={{ left: 10, right: 10 }}
              svg={{ fill: theme.colors.relatorios.texto, fontSize: 12 }}
            />
          </View>
        </View>
      </Gradient>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { color: "#fff", marginBottom: 8 },
  botao: {},
});

// import React, { useState } from "react";
// import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
// import { LineChart } from "react-native-chart-kit";
// import { useTheme } from "styled-components/native";
// import { PickerSelect } from "./../PickerSelect";
// import { Gradient } from "./styles";

// const chartConfig = {
//   backgroundGradientFrom: "#111", // Cor de fundo do gráfico (não será visível por causa do Gradient)
//   backgroundGradientTo: "#111", // Cor de fundo do gráfico (não será visível por causa do Gradient)
//   color: (opacity = 1) => `#2FA8FF`, // Cor principal da linha e da área
//   labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//   strokeWidth: 1.5,
//   fillShadowGradient: "#2FA8FF",
//   fillShadowGradientOpacity: 0.3,
//   barRadius: 100, // Usado para arredondar a área do gráfico
// };

// export function Grafico({
//   data = [40, 75, 50, 80, 50, 90, 75, 50, 40, 30, 50],
// }) {
//   const [value, setValue] = useState("Mês");
//   const theme = useTheme();

//   // Mantenha sua lógica de rótulos do eixo X
//   const xLabels = (() => {
//     const n = data.length;
//     const denom = Math.max(1, n - 1);
//     const kind = (String(value || "").toLowerCase() || "mensal").trim();

//     if (kind === "hoje") {
//       return data.map((_, i) => {
//         const hour = Math.round((i / denom) * 24) % 24;
//         return `${String(hour).padStart(2, "0")}h`;
//       });
//     }

//     if (kind === "semana") {
//       const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
//       return data.map((_, i) => {
//         const idx = Math.round((i / denom) * (days.length - 1));
//         return days[idx];
//       });
//     }

//     if (kind === "mês" || kind === "mes" || kind === "mensal") {
//       const maxDay = 30;
//       return data.map((_, i) => {
//         const day = Math.round((i / denom) * (maxDay - 1)) + 1;
//         return String(day).padStart(2, "0");
//       });
//     }

//     return data.map((_, i) => String(i + 1).padStart(2, "0"));
//   })();

//   const chartData = {
//     labels: xLabels,
//     datasets: [
//       {
//         data: data,
//       },
//     ],
//   };

//   return (
//     <View
//       style={{
//         width: 350,
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
//         <LineChart
//           data={chartData}
//           width={Dimensions.get("window").width * 0.85} // ou ajuste para a sua necessidade
//           height={239}
//           chartConfig={{
//             ...chartConfig,
//             color: (opacity = 1) => theme.colors.relatorios.linha_grafico,
//             labelColor: (opacity = 1) => theme.colors.relatorios.texto,
//           }}
//           bezier // para criar a curva suave
//           withDots // para mostrar os pontos
//           withVerticalLabels
//           withHorizontalLabels
//           yLabelsOffset={10}
//           xLabelsOffset={10}
//           style={{
//             marginVertical: 8,
//             borderRadius: 30,
//           }}
//           yAxisSuffix=" kWh"
//           fromZero={true}
//           formatYLabel={(yValue) => `${yValue}`}
//         />
//       </Gradient>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   title: { color: "#fff", marginBottom: 8 },
//   botao: {},
// });
