import styled, { css } from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { CurrencyCircleDollarIcon } from "phosphor-react-native";

export const Subtitle = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.titulo};
    font-family: ${theme.fonts.regular};
  `}
  font-size: 16px;
  line-height: 20px;
  margin-top: 20px;
  align-self: center;
`;

export const CardContainer = styled(LinearGradient)`
  width: 367px;
  height: 215px;
  border-radius: 20px;
  align-self: center;
  margin-top: 75px;
  /* box-shadow: 1px 40px 1px rgba(255, 255, 255, 1); */
`;

export const CardTitle = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.titulo_card};
    font-family: ${theme.fonts.semiBold};
  `}
  font-size: 17px;
`;

export const CardDate = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.texto_card};
    font-family: ${theme.fonts.regular};
  `}
  font-size: 13px;
`;

export const CardValue = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.titulo};
    font-family: ${theme.fonts.bold};
  `}
  font-size: 25px;
  margin: 10px 15px 0 15px;
`;

export const CardTexto = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.texto_card};
    font-family: ${theme.fonts.regular};
  `}
  font-size: 14px;
  margin: 0 15px;
`;

export const CardLinha = styled.View`
  border-bottom-width: 0.182px;
  ${({ theme }) => css`
    border-bottom-color: ${theme.colors.borda_card};
  `}
  margin: 20px 15px 0 15px;
`;

export const CardIconContainer = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${({ theme }) => theme.colors.cor_bolinha};
  align-items: center;
  justify-content: center;
`;

export const CardIcon = styled(CurrencyCircleDollarIcon)`
  width: 14px;
`;

export const CardEconomia = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.titulo_card};
    font-family: ${theme.fonts.semiBold};
  `}
  font-size: 20px;
  margin: 0 15px;
`;
