import styled, { css } from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { ChartBarIcon, TrophyIcon } from "phosphor-react-native";

export const Container = styled.View`
  align-items: center;
`;

export const CardGrafico = styled(LinearGradient).attrs({
  start: { x: 1, y: 0 },
  end: { x: 1, y: 1 },
})`
  margin-top: 10px;
  width: 370px;
  height: 449px;
  border-radius: 30px;
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  elevation: 10;
  align-items: center;
`;

export const CabecalhoGrafico = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin: 20px 0 0 20px;
  align-self: flex-start;
`;

export const ContainerIcon = styled(LinearGradient).attrs({})`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 22px;
  border: 0.15px solid #fff;
`;

export const Icon = styled(ChartBarIcon).attrs({
  size: 27,
})`
  color: ${({ theme }) => theme.colors.texto};
`;

export const IconTrofeu = styled(TrophyIcon).attrs({
  size: 27,
})`
  color: ${({ theme }) => theme.colors.texto};
`;

export const Title = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.fonts.semiBold};
    color: ${theme.colors.texto};
  `}
  font-size: 17px;
`;

export const Texto = styled.Text`
  color: ${({ theme }) => theme.colors.relatorios.texto};
  max-width: 330px;
  font-size: 16px;
`;

export const CardEconomia = styled(LinearGradient).attrs({
  start: { x: 1, y: 1 },
  end: { x: 1, y: 0 },
})`
  margin-top: 20px;
  width: 370px;
  height: 250px;
  border-radius: 30px;
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  elevation: 10;
`;

export const Info = styled.View`
  margin: 20px 0 0 20px;
`;

export const Numbers = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.texto};
    font-family: ${theme.fonts.semiBold};
  `}
  font-size: 17px;
`;
