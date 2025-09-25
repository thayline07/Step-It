import styled, { css } from "styled-components/native";
import { TouchableOpacityProps } from "react-native";
import { PlusIcon } from "phosphor-react-native";

export const Container = styled.View`
  flex: 1;
  align-items: center;
`;

export const TitleContainer = styled.View`
  position: absolute;
  top: -50;
  align-items: center;
`;

export const ButtonContainer = styled.TouchableOpacity<TouchableOpacityProps>`
  ${({ theme }) => css`
    background-color: ${theme.colors.perfil.card};
  `};
  width: 329px;
  height: 76px;
  flex-direction: row;
  align-items: center;

  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  margin-bottom: 20px;
  padding: 0px 20px 0 0;
`;

`;`;

export const Icone = styled(PlusIcon).attrs(({ theme }) => ({
  size: 24,
  color: theme.colors.texto,
}))`
  margin-left: 20px;
`;

export const Texto = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.texto};
    font-family: ${theme.fonts.regular};
  `};
  font-size: 20px;
  margin-left: 20px;
`;
