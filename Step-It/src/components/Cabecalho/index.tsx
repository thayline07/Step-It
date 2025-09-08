import { useTheme } from "styled-components/native";
import { useThemeContext } from "../../theme/ThemeProvider";
import {
  Button,
  Container,
  Image,
  ContainerTexto,
  CabecalhoTitulo,
  CabecalhoSubtitulo,
} from "./styles";
import { SunIcon, MoonIcon, ArrowLeftIcon } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";
// import { ThemeProvider } from "./../../theme/ThemeProvider";

type tipoCabecalho = "PRINCIPAL" | "SECUNDARIO" | "TERCIARIO" | "QUATERNARIO";
type iconType = "CLARO" | "ESCURO";

export function Cabecalho({
  tipo,
  funcao,
}: {
  tipo: tipoCabecalho;
  funcao?: () => void;
}) {
  const theme = useTheme();
  const currentTheme = useThemeContext();

  const { toggleTheme } = useThemeContext();

  function renderIcon() {
    switch (currentTheme.themeName) {
      case "dark":
        return <SunIcon size={24} color={theme.colors.login.icone} />;
      case "light":
        return <MoonIcon size={24} color={theme.colors.login.icone} />;
      default:
        return null;
    }
  }

  switch (tipo) {
    case "PRINCIPAL":
      return (
        <Container>
          <Image source={require("./../../assets/perfil.png")} />
          <ContainerTexto>
            <CabecalhoTitulo>Olá, Ana Lua</CabecalhoTitulo>
            <CabecalhoSubtitulo>
              Quantos passos você deu hoje?
            </CabecalhoSubtitulo>
          </ContainerTexto>
          <Button onPress={toggleTheme}>{renderIcon()}</Button>
        </Container>
      );
    case "SECUNDARIO":
      return (
        <Container>
          <Image source={require("./../../assets/perfil.png")} />
          <Button onPress={toggleTheme}>{renderIcon()}</Button>
        </Container>
      );
    case "TERCIARIO":
      return (
        <Container>
          <Container></Container>
          <Button onPress={toggleTheme}>{renderIcon()}</Button>
        </Container>
      );
    case "QUATERNARIO":
      return (
        <Container>
          <TouchableOpacity onPress={funcao}>
            <ArrowLeftIcon
              style={{ marginTop: 16 }}
              size={24}
              color={theme.colors.login.icone}
            />
          </TouchableOpacity>
          {/* <Button onPress={toggleTheme}>{renderIcon()}</Button> */}
        </Container>
      );
  }
}
