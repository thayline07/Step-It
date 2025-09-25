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

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { buscarUsuarioPorId } from "../../utils/buscarUsuario";
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
  const { user } = useAuth(); // Pegar dados do usuário logado
  const [usuarioDados, setUsuarioDados] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

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

  // Buscar dados do usuário quando o componente montar
  useEffect(() => {
    async function carregarDadosUsuario() {
      if (user?.uid) {
        setLoadingUser(true);

        const resultado = await buscarUsuarioPorId(user.uid);

        if (resultado.success) {
          setUsuarioDados(resultado.data);
        } else {
          console.error("❌ Erro ao buscar usuário:", resultado.error);
          setUsuarioDados(null);
        }

        setLoadingUser(false);
      }
    }

    carregarDadosUsuario();
  }, [user?.uid]);

  switch (tipo) {
    case "PRINCIPAL":
      return (
        <Container>
          <Image source={require("./../../assets/perfil.png")} />
          <ContainerTexto>
            <CabecalhoTitulo>Olá, {usuarioDados?.nome}</CabecalhoTitulo>
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
