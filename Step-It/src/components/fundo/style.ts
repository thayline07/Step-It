import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_principal};
`;

export const Gradient = styled(LinearGradient)`
  flex: 1;
`;
