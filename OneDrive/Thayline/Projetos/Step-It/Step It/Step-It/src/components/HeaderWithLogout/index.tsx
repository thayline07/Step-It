import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { signOutUser } from "../../services/auth";
import { useAuth } from "../../contexts/AuthContext";

export function HeaderWithLogout() {
  const { user } = useAuth();

  async function handleLogout() {
    Alert.alert("Sair", "Tem certeza que deseja sair da sua conta?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          const result = await signOutUser();
          if (!result.success) {
            Alert.alert("Erro", "Não foi possível sair da conta");
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Olá, {user?.email}</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  welcomeText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});
