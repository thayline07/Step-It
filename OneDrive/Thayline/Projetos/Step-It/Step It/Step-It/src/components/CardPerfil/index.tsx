import { LinearGradient } from "expo-linear-gradient";
import { Container, Texto } from "./styles";
import {
  PenIcon,
  PlusIcon,
  PencilLineIcon,
  KeyIcon,
  SignOutIcon,
} from "phosphor-react-native";
import { useTheme } from "styled-components/native";

type CardPerfilProps = {
  texto: string;
  tipo: "plus" | "pencil" | "pen" | "key" | "logout";
  acao: () => void;
};

export function CardPerfil({ texto, tipo, acao }: CardPerfilProps) {
  const theme = useTheme();

  function Icon() {
    switch (tipo) {
      case "plus":
        return <PlusIcon size={24} color={theme.colors.texto} />;
      case "pencil":
        return <PencilLineIcon size={24} color={theme.colors.texto} />;
      case "pen":
        return <PenIcon size={24} color={theme.colors.texto} />;
      case "key":
        return <KeyIcon size={24} color={theme.colors.texto} />;
      case "logout":
        return <SignOutIcon size={24} color={theme.colors.texto} />;
    }
  }

  return (
    <Container onPress={acao}>
      <LinearGradient
        colors={[theme.colors.perfil.card[0], theme.colors.perfil.card[1]]}
        style={{
          width: 329,
          height: 76,
          flex: 1,

          flexDirection: "row",
          alignItems: "center",
          gap: 15,
          paddingHorizontal: 20,
          borderRadius: 10,
        }}
      >
        <Icon />
        <Texto>{texto}</Texto>
      </LinearGradient>
    </Container>
  );
}
