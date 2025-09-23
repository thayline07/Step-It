import { Fundo } from "../../components/fundo";
import { Cabecalho } from "../../components/Cabecalho";
import { LoginTitle } from "../../components/LoginTitle";
import { InputForm } from "../../components/Input";
import { BotaoLogar } from "../../components/BotaoLogar";
import { Logo } from "../../components/Logo";

import { Container, ContainerForm } from "./styles";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  App: { screen?: string };
};

export function EditarNome() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  function voltar() {
    return navigation.goBack();
  }

  return (
    <Fundo>
      <Cabecalho tipo="QUATERNARIO" funcao={voltar} />
      <Container>
        <LoginTitle text="Editar Nome" />
        <ContainerForm>
          <InputForm
            title="Nome"
            placeholder="Insira o novo nome"
            icon="user"
          />
        </ContainerForm>
        <BotaoLogar
          text="Salvar"
          onPress={() => navigation.navigate("App", { screen: "Perfil" })}
          style={{ marginBottom: 50 }}
        />
        <Logo />
      </Container>
    </Fundo>
  );
}
