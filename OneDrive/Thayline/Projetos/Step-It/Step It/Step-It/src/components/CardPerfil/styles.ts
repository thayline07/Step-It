import styled from "styled-components/native";
import { LinearGradient, LinearGradientProps } from "react-native-svg";

export const Container = styled.TouchableOpacity`
  width: 329px;
  height: 76px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin-bottom: 10px;
`;

export const Texto = styled.Text`
  color: ${({ theme }) => theme.colors.texto};
  font-family: ${({ theme }) => theme.fonts.semiBold};
  font-size: 18px;
`;
