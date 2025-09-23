import styled, { css } from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";

export const Gradient = styled(LinearGradient).attrs({
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  /* flex: 1; */
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 30px;
`;
