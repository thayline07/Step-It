import { db } from "./../../firebaseConfig"; // ← Importar db do seu config
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  orderBy,
  limit,
} from "firebase/firestore";

// Buscar dados do Usuário por ID
export async function buscarUsuarioPorId(userId) {
  try {
    const userDocRef = doc(db, "usuario", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return { success: true, data: { id: userDoc.id, ...userDoc.data() } };
    } else {
      return { success: false, error: "user-not-found" };
    }
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error);
    return { success: false, error: error.code };
  }
}

// Buscar usuários por nome
export async function buscarUsuariosPorNome(nome) {
  try {
    const usuariosRef = collection(db, "usuario");
    const q = query(usuariosRef, where("nome", "==", nome));

    const querySnapshot = await getDocs(q);
    const usuarios = [];

    querySnapshot.forEach((doc) => {
      usuarios.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return { success: true, data: usuarios };
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return { success: false, error: error.code };
  }
}

// Buscar usuários por email
export async function buscarUsuarioPorEmail(email) {
  try {
    const usuariosRef = collection(db, "usuario");
    const q = query(usuariosRef, where("email", "==", email));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        success: true,
        data: { id: doc.id, ...doc.data() },
      };
    } else {
      return { success: false, error: "user-not-found" };
    }
  } catch (error) {
    return { success: false, error: error.code };
  }
}

export async function buscarUsuarioPorTelefone(telefone) {
  try {
    const usuariosRef = collection(db, "usuario");
    const q = query(usuariosRef, where("telefone", "==", telefone));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        success: true,
        data: { id: doc.id, ...doc.data() },
      };
    } else {
      return { success: false, error: "user-not-found" };
    }
  } catch (error) {
    return { success: false, error: error.code };
  }
}
