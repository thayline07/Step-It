import React, { useEffect } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Animated } from "react-native";

import { View, Text, StyleSheet } from "react-native";
import { Image } from "./styles";
import { Fundo } from "../../components/fundo/index";

export function Inicial() {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp>();

  const opacity = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        navigation.navigate("CriarConta");
      });
    }, 4000);
  }, []);

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <Fundo>
        <Image source={require("./../../assets/logo.png")} />
      </Fundo>
    </Animated.View>
  );
}
