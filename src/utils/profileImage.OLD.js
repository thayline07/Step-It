import { storage, db, auth } from "../../firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

/**
 * Selecionar imagem da galeria ou câmera
 */
export const selecionarImagem = async () => {
  try {
    // Solicitar permissão para acessar a galeria
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      throw new Error("Permissão para acessar galeria negada");
    }

    // Opções do seletor de imagem (usando apenas as opções essenciais)
    const options = {
      allowsEditing: true,
      aspect: [1, 1], // Quadrado para foto de perfil
      quality: 0.8, // Reduzir qualidade para economizar espaço
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled && result.assets[0]) {
      return {
        success: true,
        uri: result.assets[0].uri,
        type: result.assets[0].type,
        fileName: result.assets[0].fileName || `profile_${Date.now()}.jpg`,
      };
    }

    return { success: false, message: "Seleção cancelada" };
  } catch (error) {
    console.error("Erro ao selecionar imagem:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Fazer upload da imagem para Firebase Storage
 */
export const uploadImagemPerfil = async (userId, imageUri) => {
  try {
    console.log("📤 Iniciando upload da imagem de perfil...");
    console.log("🔍 Detalhes:", {
      userId,
      imageUri: imageUri.substring(0, 50) + "...",
    });

    // Verificar se o usuário está autenticado
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Usuário não está autenticado");
    }

    console.log("✅ Usuário autenticado:", currentUser.uid);

    // Verificar se os parâmetros são válidos
    if (!userId || !imageUri) {
      throw new Error("UserID e ImageURI são obrigatórios");
    }

    // Verificar se o userId corresponde ao usuário logado
    if (userId !== currentUser.uid) {
      throw new Error("Não é possível alterar foto de outro usuário");
    }

    // Converter URI para blob com verificação
    console.log("🔄 Convertendo imagem para blob...");
    const response = await fetch(imageUri);

    if (!response.ok) {
      throw new Error(`Erro ao buscar imagem: ${response.status}`);
    }

    const blob = await response.blob();
    console.log("📊 Blob criado:", { size: blob.size, type: blob.type });

    // Verificar tamanho do arquivo (máximo 5MB)
    if (blob.size > 5 * 1024 * 1024) {
      throw new Error("Imagem muito grande. Máximo permitido: 5MB");
    }

    // Referência do arquivo no Storage
    const imageName = `profile_${userId}_${Date.now()}.jpg`;
    const imageRef = ref(storage, `usuarios/perfil/${imageName}`);

    console.log("📁 Referência criada:", `usuarios/perfil/${imageName}`);

    // Upload do arquivo
    console.log("⬆️ Fazendo upload...");
    const snapshot = await uploadBytes(imageRef, blob);
    console.log("📤 Upload realizado, obtendo URL...");

    // Obter URL de download
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("✅ Upload concluído:", downloadURL);

    return {
      success: true,
      downloadURL,
      imageName,
    };
  } catch (error) {
    console.error("❌ Erro detalhado no upload:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    // Mapear erros específicos do Firebase
    let userMessage = "Erro desconhecido ao fazer upload da imagem";

    if (error.code === "storage/unauthorized") {
      userMessage =
        "Sem permissão para fazer upload. Verifique se está logado.";
    } else if (error.code === "storage/canceled") {
      userMessage = "Upload cancelado";
    } else if (error.code === "storage/unknown") {
      userMessage =
        "Erro de conexão. Verifique sua internet e tente novamente.";
    } else if (error.message.includes("fetch")) {
      userMessage = "Erro ao processar a imagem selecionada";
    }

    return {
      success: false,
      message: userMessage,
      technicalError: error.message,
    };
  }
};

/**
 * Atualizar foto de perfil no documento do usuário
 */
export const atualizarFotoPerfil = async (userId, downloadURL, imageName) => {
  try {
    console.log("📝 Atualizando documento do usuário...");

    // Buscar dados atuais do usuário para deletar foto antiga
    const userDoc = await getDoc(doc(db, "usuarios", userId));
    const userData = userDoc.data();

    // Deletar foto antiga se existir
    if (userData?.fotoPerfilNome && userData.fotoPerfilNome !== "default") {
      try {
        const oldImageRef = ref(
          storage,
          `usuarios/perfil/${userData.fotoPerfilNome}`
        );
        await deleteObject(oldImageRef);
        console.log("🗑️ Foto antiga deletada");
      } catch (deleteError) {
        console.warn(
          "⚠️ Erro ao deletar foto antiga (pode não existir):",
          deleteError
        );
      }
    }

    // Atualizar documento com nova foto
    const userRef = doc(db, "usuarios", userId);
    await updateDoc(userRef, {
      fotoPerfil: downloadURL,
      fotoPerfilNome: imageName,
      dataAtualizacao: new Date(),
    });

    console.log("✅ Documento atualizado com sucesso");

    return {
      success: true,
      downloadURL,
    };
  } catch (error) {
    console.error("❌ Erro ao atualizar documento:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Função principal para trocar foto de perfil
 */
export const trocarFotoPerfil = async (userId) => {
  try {
    console.log("📸 Iniciando processo de troca de foto...");

    // 1. Selecionar imagem
    const selecaoResult = await selecionarImagem();
    if (!selecaoResult.success) {
      return selecaoResult;
    }

    // 2. Upload da imagem
    const uploadResult = await uploadImagemPerfil(userId, selecaoResult.uri);
    if (!uploadResult.success) {
      return uploadResult;
    }

    // 3. Atualizar documento do usuário
    const updateResult = await atualizarFotoPerfil(
      userId,
      uploadResult.downloadURL,
      uploadResult.imageName
    );

    if (updateResult.success) {
      return {
        success: true,
        message: "Foto de perfil atualizada com sucesso!",
        downloadURL: uploadResult.downloadURL,
      };
    }

    return updateResult;
  } catch (error) {
    console.error("❌ Erro no processo completo:", error);
    return {
      success: false,
      message: "Erro inesperado ao trocar foto de perfil",
    };
  }
};

/**
 * Obter URL da foto de perfil do usuário
 */
export const obterFotoPerfil = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "usuarios", userId));
    const userData = userDoc.data();

    if (userData?.fotoPerfil) {
      return {
        success: true,
        photoURL: userData.fotoPerfil,
      };
    }

    return {
      success: false,
      message: "Usuário não possui foto de perfil",
    };
  } catch (error) {
    console.error("Erro ao buscar foto de perfil:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};
