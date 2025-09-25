import { auth, db } from "./../../firebaseConfig";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

import {
  buscarUsuariosPorNome,
  buscarUsuarioPorEmail,
  buscarUsuarioPorTelefone,
} from "../utils/buscarUsuario";

export async function registrar(nome, email, password, telefone, pisos) {
  try {
    // 1. VERIFICAR SE JÁ EXISTE USUÁRIO COM O MESMO EMAIL
    const emailExistente = await buscarUsuarioPorEmail(email);
    if (emailExistente.success) {
      throw new Error("auth/email-already-in-use");
      return;
    }

    // 2. VERIFICAR SE JÁ EXISTE USUÁRIO COM O MESMO NOME
    const nomeExistente = await buscarUsuariosPorNome(nome);
    if (nomeExistente.success && nomeExistente.data.length > 0) {
      throw new Error("auth/username-already-in-use");
      return;
    }

    // 3. VERIFICAR SE JÁ EXISTE USUÁRIO COM O MESMO TELEFONE
    const telefoneExistente = await buscarUsuarioPorTelefone(telefone);
    if (telefoneExistente.success) {
      throw new Error("auth/phone-already-in-use");
      return;
    }

    // 4. SE PASSOU EM TODAS AS VALIDAÇÕES, CRIAR O USUÁRIO
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // 5. Obtém o UID do usuário recém-criado
    const userId = user.uid;

    // 6. Cria um novo documento no Firestore com o mesmo UID
    const userDocRef = doc(db, "usuario", userId);

    // 7. Adiciona os dados personalizados ao documento
    await setDoc(userDocRef, {
      nome: nome,
      email: email,
      telefone: telefone,
      pisos: pisos,
      data_cadastro: new Date(),
    });

    console.log("Usuário registrado com sucesso e dados extras adicionados.");
    return { success: true, user: user };
  } catch (error) {
    console.error("Erro ao registrar o usuário:", error.message);

    // Retornar diferentes tipos de erro
    if (error.message === "auth/email-already-in-use") {
      return { success: false, error: "email-already-exists" };
    } else if (error.message === "auth/username-already-in-use") {
      return { success: false, error: "username-already-exists" };
    } else if (error.message === "auth/phone-already-in-use") {
      return { success: false, error: "phone-already-exists" };
    } else {
      return { success: false, error: error.code || "registration-failed" };
    }
  }
}

// Função de login (adicionar após a função registrar)
export async function logar(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("Login realizado com sucesso:", userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Erro ao fazer login:", error.code);
    return { success: false, error: error.code };
  }
}

// Função de logout
export async function deslogar() {
  try {
    await signOut(auth);
    console.log("Usuário deslogado com sucesso");
    return { success: true };
  } catch (error) {
    console.error("Erro ao fazer logout:", error.code);
    return { success: false, error: error.code };
  }
}

// Função para monitorar estado de autenticação
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// Função para resetar senha (opcional)
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.code };
  }
}

// Função para pegar usuário atual
export function getCurrentUser() {
  return auth.currentUser;
}

export async function fetchUserData() {
  // 1. Verifica se há um usuário logado
  const user = auth.currentUser;

  if (user) {
    // 2. Obtém o UID do usuário
    const userId = user.uid;

    // 3. Busca o documento no Firestore com o mesmo UID
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // 4. Se o documento existir, obtém os dados
      const userData = userDocSnap.data();
      return userData;
    } else {
      console.log("Nenhum documento encontrado para este usuário.");
      return null;
    }
  } else {
    console.log("Nenhum usuário logado.");
    return null;
  }
}

// // Exemplo de uso
// const floorsString = "piso1_id,piso2_id";
// registerUserWithExtraData(
//   "usuario@example.com",
//   "senhaSegura123",
//   "João Silva",
//   "11987654321",
//   floorsString
// );
