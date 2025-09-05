import React, { useEffect } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { Logo } from "../../components/Logo";

import { View } from "./styles";
import { Fundo } from "../../components/fundo/index";

type RootStackParamList = {
  Login: undefined;
};

export function Inicial() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Login");
    }, 4000);
  }, []);

  return (
    <Fundo>
      <View>
        <Logo />
      </View>
    </Fundo>
  );
}
