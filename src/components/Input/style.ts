import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { TextInputProps } from "react-native";

export const Container = styled.View`
  margin: 10px 0 4px 0;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.regular};
  margin-bottom: 3px;
  color: ${({ theme }) => theme.colors.login.texto};
`;

export const Gradient = styled(LinearGradient)`
  width: 346px;
  height: 48px;
  border-radius: 10px;
`;

export const Input = styled.TextInput<TextInputProps>`
  width: 346px;
  padding-left: 50px;
  height: 48px;
  border-radius: 10px;
  background-color: rgba(115, 115, 115, 0.15);
`;

export const IconContainer = styled.View`
  position: absolute;
  left: 12px;
  top: 12px;
  z-index: 2;
`;
