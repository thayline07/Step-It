import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { useTheme } from "styled-components/native";
import { CaretDownIcon } from "phosphor-react-native";

const BUTTON_WIDTH = 111;
const BUTTON_HEIGHT = 36;

export function PickerSelect({
  value,
  setValue,
  items = [],
  styleWrapper = {},
}: {
  value: string;
  setValue: (v: string) => void;
  items: { label: string; value: string }[];
  styleWrapper?: object;
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  // Alterna menu
  const toggle = () => setOpen((s) => !s);

  // Seleciona opção e fecha
  const onSelect = (val: string) => {
    setValue(val);
    setOpen(false);
  };

  return (
    <View
      style={[
        { position: "absolute", top: 12, right: 12, width: BUTTON_WIDTH },
        styleWrapper,
      ]}
    >
      {/* botão */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggle}
        style={[
          styles.button,
          {
            backgroundColor:
              theme?.colors?.relatorios?.background_icone_data ??
              "rgba(0,0,0,0.4)",
            borderColor:
              theme?.colors?.relatorios?.borda_icone_data ??
              "rgba(255,255,255,0.15)",
            height: BUTTON_HEIGHT,
            width: BUTTON_WIDTH,
          },
        ]}
      >
        <Text
          numberOfLines={1}
          style={{ color: theme.colors.texto, fontSize: 14, marginLeft: 15 }}
        >
          {value}
        </Text>
        <CaretDownIcon size={16} color={theme.colors.texto} />
      </TouchableOpacity>

      {/* overlay que fecha ao tocar fora */}
      {open && (
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.overlay}>
            {/* menu posicionado abaixo do botão */}
            <View
              style={{
                position: "absolute",
                borderRadius: 8,
                borderWidth: 0.5,
                paddingVertical: 6,
                paddingHorizontal: 6,
                // sombra (iOS/Android)
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 8,
                right: 10,
                top: BUTTON_HEIGHT,
                width: BUTTON_WIDTH, // ligeiramente maior que botão, ajuste se quiser
                backgroundColor: theme.colors.cor_bolinha,
                borderColor:
                  theme?.colors?.relatorios?.borda?.[0] ??
                  "rgba(255,255,255,0.12)",
              }}
            >
              {items.map((it) => (
                <TouchableOpacity
                  key={it.value}
                  onPress={() => onSelect(it.value)}
                  activeOpacity={0.7}
                  style={styles.item}
                >
                  <Text
                    style={{
                      color: theme.colors.texto,
                      fontSize: 14,
                      textAlign: "left",
                    }}
                  >
                    {it.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 10,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: -10, // compensa o width extra do dropdown
    left: -1000, // ocupa a tela inteira para capturar toque fora (ajusta se necessário)
    bottom: -1000,
  },
  item: {
    paddingVertical: 8,
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginVertical: 4,
    borderBottomWidth: 0.5,
  },
});
