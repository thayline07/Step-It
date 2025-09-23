import styled, { css } from "styled-components/native";

export const ContainerPiso = styled.TouchableOpacity`
  ${({ theme }) => css`
    background-color: ${theme.colors.perfil.card};
  `};
  width: 329px;
  height: 76px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  margin-bottom: 7px;
  padding: 0px 20px 0 0;
`;

export const NomePiso = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.texto};
    font-family: ${theme.fonts.regular};
  `};
  font-size: 20px;
  margin-left: 20px;
`;

export const IdPiso = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.texto};
    font-family: ${theme.fonts.regular};
  `};
  font-size: 12px;
  opacity: 0.7;
  margin-left: 20px;
`;
