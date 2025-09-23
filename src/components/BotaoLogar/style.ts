import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";

export const Container = styled.TouchableOpacity`
  width: 229px;
  height: 51px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  align-self: center;
`;

export const ContainerGradient = styled(LinearGradient)`
  width: 229px;
  height: 51px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  align-self: center;
`;

export const Texto = styled.Text`
  color: #fff;
  font-size: 20px;
  font-family: ${({ theme }) => theme.fonts.semiBold};
`;
