import styled from "styled-components/native";
import { PencilIcon } from "phosphor-react-native";

export const Container = styled.View`
  flex: 1;
  align-items: center;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.perfil.titulo};
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 24px;
`;

export const Imagem = styled.Image`
  width: 141px;
  height: 141px;
  border-radius: 70px;
  margin-bottom: 10px;
`;

export const ContainerIcon = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.cor_bolinha};
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  position: absolute;
  top: 145px;
  left: 220px;
  shadow-color: #000;
  shadow-offset: 1px 1px;
  shadow-opacity: 1;
  shadow-radius: 10px;
  elevation: 4;
`;

export const Icon = styled(PencilIcon)`
  color: ${({ theme }) => theme.colors.texto};
`;

export const Usuario = styled.Text`
  color: ${({ theme }) => theme.colors.texto};
  font-family: ${({ theme }) => theme.fonts.semiBold};
  font-size: 24px;
  margin-bottom: 15px;
`;

export const Link = styled.TouchableOpacity`
  align-self: center;
`;

export const LinkTexto = styled.Text`
  color: #10a3ff;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 14px;
  text-decoration: underline;
`;
