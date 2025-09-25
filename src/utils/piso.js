import { CodesandboxLogoIcon } from "phosphor-react-native";
import { db } from "../../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
  query,
  where,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

/**
 * Adiciona um piso ao array de pisos do usuário
 * @param {string} usuarioId - ID do usuário
 * @param {string} pisoId - ID do piso a ser adicionado
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export async function adicionarPiso(usuarioId, pisoId, nomePiso) {
  try {
    // Verificar se o usuário existe
    const userDocRef = doc(db, "usuario", usuarioId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return { success: false, error: "Usuário não encontrado" };
    }

    const pisoDocRef = doc(db, "piso", pisoId);
    const pisoDoc = await getDoc(pisoDocRef);

    if (!pisoDoc.exists()) {
      return { success: false, error: "Código inválido!" };
    }

    // Verificar se o piso já está na lista do usuário
    const userData = userDoc.data();
    const pisosAtuais = userData.pisos || [];

    const pisoExistente = pisosAtuais.find((piso) => {
      const idPiso = piso.split(", ")[1];
      return idPiso === pisoId;
    });

    if (pisoExistente) {
      return { success: false, error: "Este piso já foi adicionado!" };
    }

    // Adicionar o piso ao array
    await updateDoc(userDocRef, {
      pisos: arrayUnion(`${nomePiso}, ${pisoId}`),
    });

    return { success: true, message: "Piso adicionado com sucesso" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Remove um piso do array de pisos do usuário
 * @param {string} usuarioId - ID do usuário
 * @param {string} pisoId - ID do piso a ser removido
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export async function removerPiso(usuarioId, pisoId, pisoInfo) {
  try {
    const userDocRef = doc(db, "usuario", usuarioId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return { success: false, error: "Usuário não encontrado" };
    }

    const pisoDocRef = doc(db, "piso", pisoId);

    // Verificar se o piso está na lista do usuário
    const userData = userDoc.data();
    const pisosAtuais = userData.pisos || [];
    const nomePiso = pisoInfo.split(", ")[0];

    const pisoEncontrado = pisosAtuais.find((piso) => {
      const idPiso = piso.split(", ")[1];

      return idPiso === pisoId;
    });

    if (!pisoEncontrado) {
      return {
        success: false,
        error: "Piso não encontrado na lista do usuário",
      };
    }

    // Remover o piso do array
    await updateDoc(userDocRef, {
      pisos: arrayRemove(pisoInfo),
    });

    return { success: true, message: "Piso removido com sucesso" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Lista todos os IDs dos pisos do usuário
 * @param {string} usuarioId - ID do usuário
 * @returns {Promise<{success: boolean, data?: string[], error?: string}>}
 */
export async function listarPisos(usuarioId) {
  try {
    const userDocRef = doc(db, "usuario", usuarioId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return { success: false, error: "Usuário não encontrado" };
    }

    const userData = userDoc.data();
    const pisos = userData.pisos || [];

    const pisoDocs = await Promise.all(
      pisos.map(async (pisoId) => {
        const pisoDocRef = doc(db, "piso", pisoId);
        const pisoDoc = await getDoc(pisoDocRef);
        return pisoDoc.data() || {};
      })
    );

    console.log(`📋 Usuário ${usuarioId} tem ${pisos.length} pisos`);
    return { success: true, data: pisos };
  } catch (error) {
    console.error("❌ Erro ao listar pisos do usuário:", error);
    return { success: false, error: error.message };
  }
}
