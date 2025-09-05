import styled from "styled-components/native";

export const Title = styled.Text`
  font-size: 32px;
  padding: 16px;
  font-family: ${({ theme }) => theme.fonts.semiBold};
  color: ${({ theme }) => theme.colors.texto};
`;
