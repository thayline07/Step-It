import { Fundo } from "../../components/fundo";
import { Cabecalho } from "../../components/Cabecalho";

import { Logo } from "../../components/Logo";
import { LoginTitle } from "../../components/LoginTitle";

import { Subtitulo, Texto } from "./style";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScrollView } from "react-native-gesture-handler";
import { View } from "react-native";

type RootParamList = {
  App: { screen: string };
};

export function PoliticaPrivacidade() {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  function voltar() {
    navigation.goBack();
  }
  return (
    <Fundo>
      <Cabecalho tipo="QUATERNARIO" funcao={voltar} />
      <View
        style={{
          position: "absolute",
          left: 100,
        }}
      >
        <Logo />
      </View>
      <ScrollView
        style={{ flex: 1, marginTop: 100, marginBottom: 50 }}
        showsHorizontalScrollIndicator={false}
      >
        <LoginTitle text="Políticas de Privacidade" />
        <Texto>
          A Step It tem o compromisso de proteger a privacidade e os dados
          pessoais de seus usuários, clientes e parceiros. Esta Política de
          Privacidade descreve como coletamos, utilizamos, armazenamos,
          compartilhamos e protegemos suas informações, em conformidade com a
          Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).
        </Texto>
        <Subtitulo>1. INFORMAÇÕES COLETADAS</Subtitulo>
        <Texto>
          1.1. Dados fornecidos pelo usuário Nome, e-mail, telefone e demais
          informações de contato; Dados de cadastro em nosso site ou aplicativo.
        </Texto>
        <Texto>
          1.2. Dados de uso Informações sobre a utilização dos pisos
          inteligentes, como passos, tempo de uso e energia gerada; Localização
          aproximada (quando autorizada); Registros de acesso e interações com o
          aplicativo e site.
        </Texto>
        <Texto>
          1.3. Dados técnicos Endereço de IP, tipo de dispositivo, sistema
          operacional, cookies e logs de navegação.
        </Texto>
        <Subtitulo>2. FINALIDADES DO TRATAMENTO</Subtitulo>
        <Texto>
          Os dados pessoais coletados poderão ser utilizados para: Fornecer e
          operar os serviços da Step It; Monitorar e apresentar relatórios sobre
          a geração de energia; Melhorar a experiência do usuário e personalizar
          conteúdos; Desenvolver e aprimorar nossos produtos e tecnologias;
          Cumprir obrigações legais e regulatórias; Enviar comunicações
          institucionais, de marketing ou promocionais (quando autorizado).
        </Texto>
        <Subtitulo>3. COMPARTILHAMENTO DE DADOS</Subtitulo>
        <Texto>
          A Step It não comercializa dados pessoais. O compartilhamento poderá
          ocorrer apenas em situações como: Com parceiros e prestadores de
          serviços essenciais para a operação; Com autoridades públicas, em
          cumprimento de obrigações legais; Com consentimento expresso do
          usuário.
        </Texto>
        <Subtitulo>4. ARMAZENAMENTO E SEGURANÇA</Subtitulo>
        <Texto>
          Os dados são armazenados em servidores seguros, localizados no Brasil
          ou no exterior; Utilizamos medidas técnicas e administrativas
          adequadas para proteger os dados contra acessos não autorizados,
          perdas ou usos indevidos; As informações serão mantidas somente pelo
          período necessário ao cumprimento das finalidades descritas nesta
          Política ou conforme exigência legal.
        </Texto>
        <Subtitulo>5. DIREITOS DO TITULAR DE DADOS</Subtitulo>
        <Texto>
          Em conformidade com a LGPD, o usuário tem direito a: Confirmar a
          existência de tratamento de seus dados; Solicitar acesso, correção,
          atualização ou exclusão de suas informações; Solicitar portabilidade
          dos dados a outro fornecedor de serviços; Revogar o consentimento a
          qualquer momento. As solicitações podem ser feitas pelo canal de
          contato informado no item 8.
        </Texto>
        <Subtitulo>6. COOKIES E TECNOLOGIAS DE RASTREAMENTO</Subtitulo>
        <Texto>
          O site e o aplicativo da Step It podem utilizar cookies e tecnologias
          similares para melhorar a navegação, medir desempenho e oferecer
          conteúdos personalizados; O usuário pode gerenciar suas preferências
          de cookies diretamente em seu navegador.
        </Texto>
        <Subtitulo>7. ALTERAÇÕES NA POLÍTICA DE PRIVACIDADE</Subtitulo>
        <Texto>
          Esta Política poderá ser atualizada periodicamente para refletir
          mudanças em nossos serviços, exigências legais ou regulatórias.
          Recomendamos a leitura periódica deste documento.
        </Texto>
        <Subtitulo>8. CANAL DE CONTATO</Subtitulo>

        <Texto>
          Para dúvidas, solicitações ou exercício dos direitos de titular de
          dados, entre em contato com nosso Encarregado de Proteção de Dados
          (DPO): pisostepit@gmail.com Step It – Transformando passos em energia
          limpa, com segurança e transparência.
        </Texto>
      </ScrollView>
    </Fundo>
  );
}
