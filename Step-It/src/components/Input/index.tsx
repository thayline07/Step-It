import { Container, IconContainer, Gradient, Title, Input } from "./style";
import { useTheme } from "styled-components/native";
import {
  EnvelopeSimpleIcon,
  PhoneIcon,
  UserIcon,
  LockIcon,
  KeyIcon,
} from "phosphor-react-native";

type iconType = "user" | "email" | "senha" | "telefone" | "key";

export function InputForm({
  title,
  placeholder,
  icon,
}: {
  title?: string;
  placeholder: string;
  icon: iconType;
}) {
  const theme = useTheme();

  function renderIcon() {
    switch (icon) {
      case "email":
        return (
          <EnvelopeSimpleIcon size={24} color={theme.colors.login.icone} />
        );
      case "senha":
        return <LockIcon size={24} color={theme.colors.login.icone} />;
      case "telefone":
        return <PhoneIcon size={24} color={theme.colors.login.icone} />;
      case "user":
        return <UserIcon size={24} color={theme.colors.login.icone} />;
      case "key":
        return <KeyIcon size={24} color={theme.colors.login.icone} />;
      default:
        return null;
    }
  }

  return (
    <Container>
      {title && <Title>{title}</Title>}
      <Gradient
        colors={[theme.colors.login.input[0], theme.colors.login.input[1]]}
      >
        <IconContainer>{renderIcon()}</IconContainer>
        <Input
          placeholderTextColor={theme.colors.login.texto_input}
          placeholder={placeholder}
        />
      </Gradient>
    </Container>
  );
}
