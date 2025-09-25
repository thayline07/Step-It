import { db } from "./../../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
  limit,
} from "firebase/firestore";

export async function geracaoDiaria(pisoId) {
  try {
    const agora = new Date();
    const vintEQuatroHorasAtras = new Date(
      agora.getTime() - 24 * 60 * 60 * 1000
    );

    const timestampLimite = Timestamp.fromDate(vintEQuatroHorasAtras);

    const geracaoRef = collection(db, "geracao");
    const q = query(
      geracaoRef,
      where(
        "pisoId",
        "==",
        `piso/${pisoId}` && "data_cadastro",
        ">=",
        timestampLimite
      ),
      orderBy("data_cadastro", "desc") // Opcional: ordenar por data mais recente
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("📭 Nenhum documento encontrado nas últimas 24h");
      return {
        success: true,
        data: [],
        message: "Nenhuma geração nas últimas 24h",
      };
    }

    // ✅ Processar documentos encontrados
    const geracoes = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Verificar se realmente está dentro de 24h (dupla verificação)
      const dataCadastro = data.data_cadastro.toDate();
      const diferencaHoras = (agora - dataCadastro) / (1000 * 60 * 60);

      if (diferencaHoras <= 24) {
        geracoes.push({
          id: doc.id,
          ...data,
          data_cadastro: dataCadastro, // Converter para Date JavaScript
          horasAtras: diferencaHoras.toFixed(2),
        });
      }
    });

    return {
      success: true,
      data: geracoes,
      total: geracoes.length,
      message: `${geracoes.length} gerações encontradas`,
    };
  } catch (error) {
    console.error("❌ Erro ao buscar gerações:", error);
    return {
      success: false,
      error: error.message || "Erro ao buscar gerações",
    };
  }
}
