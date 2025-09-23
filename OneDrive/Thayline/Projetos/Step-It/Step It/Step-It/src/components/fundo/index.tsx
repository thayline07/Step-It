import { Container, Gradient } from "./style";
import { useTheme } from "styled-components/native";

interface Props {
  children: React.ReactNode;
}

export function Fundo({ children }: Props) {
  const theme = useTheme();
  return (
    <Container>
      <Gradient
        colors={[
          theme.colors.background_gradient_linear[0],
          theme.colors.background_gradient_linear[1],
        ]}
      >
        {children}
      </Gradient>
    </Container>
  );
}
