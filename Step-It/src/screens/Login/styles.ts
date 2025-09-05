import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  align-items: center;
  margin-top: 80px;
`;

export const Form = styled.View`
  display: flex;
  margin-top: 15px;
  margin-bottom: 30px;
`;

export const TrocarSenha = styled.TouchableOpacity`
  color: ${({ theme }) => theme.colors.login.senha};
  margin-bottom: 60px;
`;
