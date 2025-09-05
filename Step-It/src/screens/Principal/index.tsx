import { Text } from "react-native";
import { View } from "react-native";

import { Cabecalho } from "./../../components/Cabecalho";
import { Fundo } from "../../components/fundo";

export function Principal() {
  return (
    <Fundo>
      <Cabecalho tipo="QUATERNARIO" />
    </Fundo>
  );
}
