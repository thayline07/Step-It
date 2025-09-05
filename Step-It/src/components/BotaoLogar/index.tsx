import { useTheme } from "styled-components/native";
import { ContainerGradient, Container, Texto } from "./style";
import { TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
  text: string;
};

export function BotaoLogar({ text, ...props }: Props) {
  const theme = useTheme();
  return (
    <Container {...props}>
      <ContainerGradient
        colors={[
          theme.colors.login.botao_background[0],
          theme.colors.login.botao_background[1],
        ]}
      >
        <Texto>{text}</Texto>
      </ContainerGradient>
    </Container>
  );
}
