import { useTheme } from "styled-components/native";
import { ContainerPiso, NomePiso, IdPiso } from "./styles";
import { MinusIcon } from "phosphor-react-native";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { View } from "../../screens/Inicial/styles";

type CardProps = TouchableOpacityProps & {
  id: string;
  nome: string;
  type: "PRINCIPAL" | "SECUNDARIO";
};

export function CardPiso({ id, nome, type, ...props }: CardProps) {
  const theme = useTheme();

  if (type === "PRINCIPAL") {
    // Para tipo PRINCIPAL, todo o card é clicável
    return (
      <ContainerPiso {...props}>
        <View style={{ justifyContent: "center" }}>
          <NomePiso>{nome}</NomePiso>
          <IdPiso>Código: {id}</IdPiso>
        </View>
      </ContainerPiso>
    );
  }

  // Para tipo SECUNDARIO, apenas o ícone é clicável
  return (
    <ContainerPiso>
      <View style={{ justifyContent: "center" }}>
        <NomePiso>{nome}</NomePiso>
        <IdPiso>Código: {id}</IdPiso>
      </View>
      <TouchableOpacity {...props}>
        <MinusIcon size={24} color={theme.colors.texto} />
      </TouchableOpacity>
    </ContainerPiso>
  );
}
