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

  return (
    <ContainerPiso {...props}>
      <View style={{ justifyContent: "center" }}>
        <NomePiso>{nome}</NomePiso>
        <IdPiso>Código: {id}</IdPiso>
      </View>
      {type === "PRINCIPAL" ? (
        <></>
      ) : (
        <TouchableOpacity>
          <MinusIcon size={24} color={theme.colors.texto} />
        </TouchableOpacity>
      )}
    </ContainerPiso>
  );
}
