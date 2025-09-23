import { Title } from "./styles";
import { useTheme } from "styled-components/native";

export function LoginTitle({ text }: { text: string }) {
  const theme = useTheme();

  return (
    <Title
      style={{
        textShadowColor: theme.colors.login.sombra_title,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 20,
      }}
    >
      {text}
    </Title>
  );
}
