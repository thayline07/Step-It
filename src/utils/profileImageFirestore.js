import { db, auth } from "../../firebaseConfig";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

/**
 *export const obterFotoPerfilFirestore = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'usuario', userId));rificar    const userDoc = await getDoc(doc(db, 'usuario', userId));e criar documento do usuário se não existir
 */
export const verificarECriarUsuario = async (userId) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Usuário não está autenticado");
    }

    const userRef = doc(db, "usuario", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.log("🆕 Criando documento do usuário...");
      await setDoc(userRef, {
        uid: userId,
        email: currentUser.email || "",
        nome:
          currentUser.displayName ||
          currentUser.email?.split("@")[0] ||
          "Usuário",
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
      });
      console.log("✅ Documento do usuário criado!");
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Erro ao verificar/criar usuário:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Selecionar e processar imagem (versão Firestore - sem Storage)
 */
export const selecionarImagem = async () => {
  try {
    // Solicitar permissão para acessar a galeria
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      throw new Error("Permissão para acessar galeria negada");
    }

    // Opções do seletor de imagem
    const options = {
      allowsEditing: true,
      aspect: [1, 1], // Quadrado para foto de perfil
      quality: 0.5, // Qualidade reduzida para Base64
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
 * Converter imagem para Base64 otimizado
 */
export const converterImagemParaBase64 = async (imageUri) => {
  try {
    console.log("🔄 Redimensionando e otimizando imagem...");

    // Redimensionar imagem para economizar espaço
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        { resize: { width: 300, height: 300 } }, // Tamanho fixo para foto de perfil
      ],
      {
        compress: 0.7, // Compressão para reduzir tamanho
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true, // Retornar em Base64
      }
    );

    if (!manipulatedImage.base64) {
      throw new Error("Falha ao converter imagem para Base64");
    }

    console.log("✅ Imagem convertida:", {
      tamanho: manipulatedImage.base64.length,
      dimensoes: `${manipulatedImage.width}x${manipulatedImage.height}`,
    });

    return {
      success: true,
      base64: manipulatedImage.base64,
      uri: manipulatedImage.uri,
    };
  } catch (error) {
    console.error("❌ Erro ao converter imagem:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Salvar foto de perfil no Firestore (Base64)
 */
export const salvarFotoPerfilFirestore = async (userId, base64Image) => {
  try {
    console.log("💾 Salvando foto no Firestore...");

    // Verificar se o usuário está autenticado
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Usuário não está autenticado");
    }

    if (userId !== currentUser.uid) {
      throw new Error("Não é possível alterar foto de outro usuário");
    }

    // Verificar tamanho do Base64 (Firestore tem limite de 1MB por campo)
    const base64Size = base64Image.length;
    console.log("📊 Tamanho do Base64:", base64Size);

    if (base64Size > 1000000) {
      // ~1MB
      throw new Error("Imagem muito grande. Reduza a qualidade.");
    }

    // Verificar se o documento do usuário existe
    const userRef = doc(db, "usuario", userId);
    const userDoc = await getDoc(userRef);

    const dadosFoto = {
      fotoPerfil: `data:image/jpeg;base64,${base64Image}`,
      fotoPerfilTipo: "base64",
      dataAtualizacao: new Date(),
    };

    if (userDoc.exists()) {
      // Documento existe - apenas atualizar foto, preservando outros dados
      console.log("📝 Atualizando documento existente...");
      await updateDoc(userRef, dadosFoto);
    } else {
      // Documento não existe - criar com dados básicos
      console.log("🆕 Criando novo documento do usuário...");

      // Usar nome do displayName ou primeira parte do email
      const nomeUsuario =
        currentUser.displayName ||
        currentUser.email?.split("@")[0] ||
        "Usuário";
      console.log("📋 Criando documento com nome:", nomeUsuario);

      await setDoc(userRef, {
        ...dadosFoto,
        uid: userId,
        email: currentUser.email || "",
        nome: nomeUsuario,
        dataCriacao: new Date(),
      });
    }

    console.log("✅ Foto salva no Firestore com sucesso!");

    return {
      success: true,
      dataURL: `data:image/jpeg;base64,${base64Image}`,
    };
  } catch (error) {
    console.error("❌ Erro ao salvar no Firestore:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Função principal para trocar foto de perfil (versão Firestore)
 */
export const trocarFotoPerfilFirestore = async (userId) => {
  try {
    console.log("📸 Iniciando processo de troca de foto (versão Firestore)...");

    // 0. Verificar e criar documento do usuário se necessário
    const verificacaoResult = await verificarECriarUsuario(userId);
    if (!verificacaoResult.success) {
      return verificacaoResult;
    }

    // 1. Selecionar imagem
    const selecaoResult = await selecionarImagem();
    if (!selecaoResult.success) {
      return selecaoResult;
    }

    // 2. Converter para Base64 otimizado
    const base64Result = await converterImagemParaBase64(selecaoResult.uri);
    if (!base64Result.success) {
      return base64Result;
    }

    // 3. Salvar no Firestore
    const saveResult = await salvarFotoPerfilFirestore(
      userId,
      base64Result.base64
    );

    if (saveResult.success) {
      return {
        success: true,
        message: "Foto de perfil atualizada com sucesso!",
        dataURL: saveResult.dataURL,
      };
    }

    return saveResult;
  } catch (error) {
    console.error("❌ Erro no processo completo:", error);
    return {
      success: false,
      message: "Erro inesperado ao trocar foto de perfil",
    };
  }
};

/**
 * Obter foto de perfil do Firestore
 */
export const obterFotoPerfilFirestore = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "usuario", userId));
    const userData = userDoc.data();

    if (userData?.fotoPerfil) {
      return {
        success: true,
        photoURL: userData.fotoPerfil,
        tipo: userData.fotoPerfilTipo || "base64",
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
