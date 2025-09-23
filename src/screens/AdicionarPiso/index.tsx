import { Fundo } from "../../components/fundo";
import { Cabecalho } from "../../components/Cabecalho";
import { LoginTitle } from "../../components/LoginTitle";
import { InputForm } from "../../components/Input";
import { BotaoLogar } from "../../components/BotaoLogar";
import { Logo } from "../../components/Logo";

import { Container, ContainerForm } from "./styles";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootParamList = {
  App: { screen?: string };
};

export function AdicionarPiso() {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();

  function voltar() {
    return navigation.goBack();
  }
  return (
    <Fundo>
      <Cabecalho tipo="QUATERNARIO" funcao={voltar} />
      <Container>
        <LoginTitle text="Adicionar Piso" />
        <ContainerForm>
          <InputForm
            title="Nome do Piso"
            placeholder="Insira o nome do piso"
            icon="senha"
          />
          <InputForm
            title="Código do piso"
            placeholder="Insira o código do piso"
            icon="key"
          />
        </ContainerForm>
        <BotaoLogar
          text="Adicionar Piso"
          onPress={() => navigation.navigate("App", { screen: "Perfil" })}
          style={{ marginBottom: 50 }}
        />
        <Logo />
      </Container>
    </Fundo>
  );
}
