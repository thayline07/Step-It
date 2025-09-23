import styled from "styled-components/native";

export const Container = styled.View`
  margin: 10px 15px;
  display: flex;
  flex-direction: row;
  align-content: center;
  gap: 16px;
`;

export const ContainerTexto = styled.View``;

export const CabecalhoTitulo = styled.Text`
  color: ${({ theme }) => theme.colors.texto};
  font-size: 20px;
  font-family: ${({ theme }) => theme.fonts.semiBold};
`;

export const CabecalhoSubtitulo = styled.Text`
  color: ${({ theme }) => theme.colors.texto};
  font-size: 14px;
`;

export const Button = styled.TouchableOpacity`
  padding: 8px;
  border-radius: 24px;
  margin-top: 7px;
  background-color: ${({ theme }) => theme.colors.botao_theme.background};
  border: 0.5px solid ${({ theme }) => theme.colors.botao_theme.borda};
  margin-left: auto;
`;

export const Image = styled.Image`
  margin-top: 7px;
  width: 40px;
  height: 40px;
  align-self: flex-start;
`;
