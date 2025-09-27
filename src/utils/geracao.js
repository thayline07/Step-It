import { db } from "./../../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
  limit,
  doc,
  onSnapshot,
} from "firebase/firestore";

export async function geracaoDiaria(pisoId) {
  try {
    const agora = new Date();
    const vintEQuatroHorasAtras = new Date(
      agora.getTime() - 24 * 60 * 60 * 1000
    );

    const timestampLimite = Timestamp.fromDate(vintEQuatroHorasAtras);

    const geracaoRef = collection(db, "geracao");

    let q = query(
      geracaoRef,

      where("id_piso", "==", pisoId)
    );

    let querySnapshot = await getDocs(q);

    const geracoes = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const dataCadastroSeconds = data?.data_cadastro?.seconds;

      if (dataCadastroSeconds < timestampLimite.seconds) {
        geracoes.push({ id: doc.id, ...data });
      }
    });

    return {
      success: true,
      data: geracoes,
      total: geracoes.length,
      message: `${geracoes.length} gerações encontradas`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Erro ao buscar gerações",
      data: geracoes,
    };
  }
}

// Horários específicos: 00h, 04h, 08h, 12h, 16h, 20h, 24h (00h do próximo dia)
// Função para debugar documentos existentes
export const debugDocumentos = async (pisoId) => {
  try {
    // Query simples sem filtro de data
    const q = query(collection(db, "geracao"), where("id_piso", "==", pisoId));

    const querySnapshot = await getDocs(q);

    querySnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
    });
  } catch (error) {
    console.log(`❌ [DEBUG] Erro:`, error);
  }
};

export const buscarGeracaoDiaria = (pisoId, callback) => {
  // Executar debug primeiro
  debugDocumentos(pisoId);

  const hoje = new Date();
  const inicioHoje = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate(),
    0,
    0,
    0
  );
  const fimHoje = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate(),
    23,
    59,
    59
  );

  // Query simplificada primeiro para testar

  // const q = query(collection(db, "geracao"), where("id_piso", "==", pisoId));

  // Caso queira testar com filtro de data depois:

  const q = query(
    collection(db, "geracao"),
    where("id_piso", "==", pisoId),
    where("data_cadastro", ">=", Timestamp.fromDate(inicioHoje)),
    where("data_cadastro", "<=", Timestamp.fromDate(fimHoje)),
    orderBy("data_cadastro", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    console.log(`📊 [DIÁRIA] Snapshot recebido para piso ${pisoId}:`, {
      tamanho: snapshot.docs.length,
      periodo: `${inicioHoje.toISOString()} até ${fimHoje.toISOString()}`,
    });

    const dadosCompletos = new Array(24).fill(0); // Dados completos (24h)
    let totalDiario = 0;

    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();

      // Verificar diferentes formatos de campo de data
      let dataDocumento = null;
      let energia = 0;

      // Tentar diferentes nomes de campos de data
      if (data.data_cadastro) {
        dataDocumento = data.data_cadastro.toDate();
      } else if (data.timestamp) {
        dataDocumento = data.timestamp.toDate();
      } else if (data.created_at) {
        dataDocumento = data.created_at.toDate();
      } else if (data.date) {
        dataDocumento = data.date.toDate();
      }

      // Tentar diferentes nomes de campos de energia
      if (data.energia_gerada) {
        energia = parseFloat(data.energia_gerada) || 0;
      } else if (data.energia) {
        energia = parseFloat(data.energia) || 0;
      } else if (data.energy) {
        energia = parseFloat(data.energy) || 0;
      } else if (data.value) {
        energia = parseFloat(data.value) || 0;
      } else if (data.amount) {
        energia = parseFloat(data.amount) || 0;
      } else if (data.tensao && data.corrente) {
        // CALCULAR ENERGIA A PARTIR DE TENSÃO E CORRENTE
        const tensao = parseFloat(data.tensao) || 0;
        const corrente =
          parseFloat(data.corrente) || parseFloat(data["corrente "]) || 0; // Note o espaço extra

        // Assumindo 1 hora de funcionamento por medição
        // Potência (W) = Tensão (V) × Corrente (A)
        // Energia (kWh) = Potência (W) × Tempo (h) ÷ 1000
        const potencia = tensao * corrente; // Watts
        energia = (potencia * 1) / 1000; // kWh (assumindo 1 hora)
      }

      if (!dataDocumento) {
        console.log(
          "⚠️ [DIÁRIA] Campo de data não encontrado em:",
          Object.keys(data)
        );
        return;
      }

      if (energia <= 0) {
        console.log(
          "⚠️ [DIÁRIA] Campo de energia não encontrado ou zero em:",
          Object.keys(data)
        );
        return;
      }

      // Filtrar por período mais amplo para incluir dados recentes (últimos 7 dias)
      const seteDiasAtras = new Date(hoje);
      seteDiasAtras.setDate(hoje.getDate() - 7);

      if (dataDocumento >= seteDiasAtras) {
        const hora = dataDocumento.getHours();

        dadosCompletos[hora] += energia;
        totalDiario += energia;
      }
    });

    const mediaSegura = (...valores) => {
      const naoZero = valores.filter((v) => v > 0);
      return naoZero.length > 0
        ? naoZero.reduce((a, b) => a + b) / naoZero.length
        : 0;
    };

    // Agrupar em 7 pontos para o gráfico (intervalos de 4h)
    const dadosGrafico = [
      mediaSegura(dadosCompletos[0], dadosCompletos[1], dadosCompletos[2]), // 00h
      mediaSegura(
        dadosCompletos[3],
        dadosCompletos[4],
        dadosCompletos[5],
        dadosCompletos[6]
      ), // 04h
      mediaSegura(
        dadosCompletos[7],
        dadosCompletos[8],
        dadosCompletos[9],
        dadosCompletos[10]
      ), // 08h
      mediaSegura(dadosCompletos[8], dadosCompletos[9], dadosCompletos[10]), // 08h
      mediaSegura(
        dadosCompletos[11],
        dadosCompletos[12],
        dadosCompletos[13],
        dadosCompletos[14]
      ), // 12h
      mediaSegura(dadosCompletos[12], dadosCompletos[13], dadosCompletos[14]), // 12h
      mediaSegura(
        dadosCompletos[15],
        dadosCompletos[16],
        dadosCompletos[17],
        dadosCompletos[18]
      ), // 16h
      mediaSegura(dadosCompletos[19], dadosCompletos[20], dadosCompletos[21]), // 20h
      mediaSegura(dadosCompletos[22], dadosCompletos[23], dadosCompletos[24]), // ou próximo dia   // 24h (00h)
    ];

    const resultado = {
      grafico: dadosGrafico, // Array[7] para o gráfico
      total: totalDiario, // Número total do dia
      completo: dadosCompletos, // Array[24] se precisar
    };

    callback(resultado);
  });
};

export const buscarGeracaoSemanal = (pisoId, callback) => {
  const hoje = new Date();

  // Calcular início da semana (domingo = 0, segunda = 1...)
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay());
  inicioSemana.setHours(0, 0, 0, 0);

  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(inicioSemana.getDate() + 6);
  fimSemana.setHours(23, 59, 59, 999);

  // Query simplificada para evitar erro de índice
  const q = query(collection(db, "geracao"), where("id_piso", "==", pisoId));

  return onSnapshot(q, (snapshot) => {
    const dadosSemana = new Array(7).fill(0); // Dom=0, Seg=1, ..., Sab=6
    let totalSemanal = 0;

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const dataDocumento = data.data_cadastro.toDate();
      const diaSemana = dataDocumento.getDay();

      let energia = 0;

      // Calcular energia a partir de tensão e corrente
      if (data.energia_gerada) {
        energia = parseFloat(data.energia_gerada) || 0;
      } else if (data.tensao && data.corrente) {
        const tensao = parseFloat(data.tensao) || 0;
        const corrente =
          parseFloat(data.corrente) || parseFloat(data["corrente "]) || 0;
        const potencia = tensao * corrente;
        energia = (potencia * 1) / 1000; // kWh
      }

      // Filtrar manualmente por data (esta semana)
      if (
        dataDocumento >= inicioSemana &&
        dataDocumento <= fimSemana &&
        energia > 0
      ) {
        dadosSemana[diaSemana] += energia;
        totalSemanal += energia;
      }
    });

    callback({
      grafico: dadosSemana, // Array[7] - já são 7 dias
      total: totalSemanal, // Soma da semana inteira
      labels: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    });
  });
};

export const buscarGeracaoMensal = (pisoId, callback) => {
  const hoje = new Date();

  // Primeiro dia do mês
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1, 0, 0, 0);

  // Último dia do mês
  const fimMes = new Date(
    hoje.getFullYear(),
    hoje.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  // Query simplificada para evitar erro de índice
  const q = query(collection(db, "geracao"), where("id_piso", "==", pisoId));

  return onSnapshot(q, (snapshot) => {
    const hoje = new Date();
    const diasNoMes = new Date(
      hoje.getFullYear(),
      hoje.getMonth() + 1,
      0
    ).getDate();
    const dadosCompletos = new Array(diasNoMes).fill(0);
    let totalMensal = 0;

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const dataDocumento = data.data_cadastro.toDate();
      const diaDoMes = dataDocumento.getDate() - 1; // 0-indexed

      let energia = 0;

      // Calcular energia a partir de tensão e corrente
      if (data.energia_gerada) {
        energia = parseFloat(data.energia_gerada) || 0;
      } else if (data.tensao && data.corrente) {
        const tensao = parseFloat(data.tensao) || 0;
        const corrente =
          parseFloat(data.corrente) || parseFloat(data["corrente "]) || 0;
        const potencia = tensao * corrente;
        energia = (potencia * 1) / 1000; // kWh
      }

      // Filtrar manualmente por data (este mês) e validar índice do array
      if (
        dataDocumento >= inicioMes &&
        dataDocumento <= fimMes &&
        diaDoMes >= 0 &&
        diaDoMes < diasNoMes &&
        energia > 0
      ) {
        dadosCompletos[diaDoMes] += energia;
        totalMensal += energia;
      }
    });

    // Pontos específicos: dias 1, 6, 11, 16, 20, 25, 30

    const mediaSegura = (...valores) => {
      const naoZero = valores.filter((v) => v > 0);
      return naoZero.length > 0
        ? naoZero.reduce((a, b) => a + b) / naoZero.length
        : 0;
    };

    const dadosGrafico = [
      mediaSegura(
        dadosCompletos[0],
        dadosCompletos[1],
        dadosCompletos[2],
        dadosCompletos[3],
        dadosCompletos[4]
      ), // 00h
      mediaSegura(
        dadosCompletos[5],
        dadosCompletos[6],
        dadosCompletos[7],
        dadosCompletos[8]
      ), // 04h
      mediaSegura(
        dadosCompletos[9],
        dadosCompletos[10],
        dadosCompletos[11],
        dadosCompletos[12]
      ), // 08h
      mediaSegura(
        dadosCompletos[13],
        dadosCompletos[14],
        dadosCompletos[15],
        dadosCompletos[16]
      ), // 12h
      mediaSegura(
        dadosCompletos[17],
        dadosCompletos[18],
        dadosCompletos[19],
        dadosCompletos[20]
      ), // 16h
      mediaSegura(
        dadosCompletos[21],
        dadosCompletos[22],
        dadosCompletos[23],
        dadosCompletos[24],
        dadosCompletos[25]
      ), // 20h
      mediaSegura(dadosCompletos[26], dadosCompletos[27], dadosCompletos[28]), // 20h
      mediaSegura(dadosCompletos[29], dadosCompletos[30]), // 24h (00h)
    ];

    callback({
      grafico: dadosGrafico, // Array[7] para o gráfico
      total: totalMensal, // Soma do mês inteiro
      labels: ["01", "06", "11", "16", "20", "25", "30"],
      completo: dadosCompletos, // Array completo se precisar
    });
  });
};
