import { Fundo } from "../../components/fundo";
import { Cabecalho } from "../../components/Cabecalho";
import { LoginTitle } from "../../components/LoginTitle";

import { Container } from "./styles";
import { FlatList } from "react-native";
import { CardPiso } from "./../../components/CardPiso";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootParamList = {
  Relatorio: { id: string };
};

export function ListaPisosRelatorio() {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const pisos = [
    { id: "xxx123", nome: "Sala de Estar" },
    { id: "xxx456", nome: "Cozinha" },
    { id: "xxx789", nome: "Quarto" },
    { id: "xxx101", nome: "Banheiro" },
  ];

  return (
    <Fundo>
      <Cabecalho tipo="SECUNDARIO" />
      <Container>
        <LoginTitle text="Relatórios" />
        <FlatList
          data={pisos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CardPiso
              onPress={() => navigation.navigate("Relatorio", { id: item.id })}
              id={item.id}
              nome={item.nome}
              type="PRINCIPAL"
            />
          )}
        />
      </Container>
    </Fundo>
  );
}
