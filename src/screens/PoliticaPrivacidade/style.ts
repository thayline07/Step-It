import styled from "styled-components/native";

export const Subtitulo = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.texto};
  width: 90%;
  margin-left: 10%;
  font-weight: 600;
`;

export const Texto = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.texto};
  align-self: center;
  text-align: justify;
  width: 90%;
  margin-bottom: 10px;
`;
