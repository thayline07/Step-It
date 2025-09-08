import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  align-items: center;
  margin-top: 70px;
`;

export const Texto = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.login.texto};
  font-size: 16px;
  margin: 10px 20px 60px 20px;
  text-align: center;
`;

export const Form = styled.View`
  display: flex;
  margin-top: 15px;
  /* margin-bottom: 30px; */
`;
