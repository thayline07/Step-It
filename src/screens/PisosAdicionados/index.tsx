import { Fundo } from "../../components/fundo";
import { Cabecalho } from "../../components/Cabecalho";
import { CardPiso } from "../../components/CardPiso";
import { LoginTitle } from "../../components/LoginTitle";

import {
  Container,
  Lista,
  TitleContainer,
  ButtonContainer,
  Texto,
  Icone,
} from "./styles";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootParamList = {
  AdicionarPiso: undefined;
};

export function PisosAdicionados() {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();

  function voltar() {
    return navigation.goBack();
  }

  const pisos = [
    { nome: "Piso 1", id: "xxx123" },
    { nome: "Piso 2", id: "xxx124" },
    { nome: "Piso 3", id: "xxx125" },
    // Adicione mais pisos conforme necessário
  ];
  return (
    <Fundo>
      <Cabecalho tipo="QUATERNARIO" funcao={voltar} />
      <Container>
        <TitleContainer>
          <LoginTitle text="Pisos" />
        </TitleContainer>

        <Lista>
          {pisos.map((piso) => (
            <CardPiso
              key={piso.id}
              id={piso.id}
              nome={piso.nome}
              type="SECUNDARIO"
            />
          ))}
        </Lista>
        <ButtonContainer onPress={() => navigation.navigate("AdicionarPiso")}>
          <Icone />
          <Texto>Adicionar Piso</Texto>
        </ButtonContainer>
      </Container>
    </Fundo>
  );
}
