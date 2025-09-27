# Debug: Correções para Geração Total de Energia

## Problemas Identificados e Corrrigidos:

### 1. **Erro na Query do Firestore** (geracao.js)

**Problema:** A condição WHERE estava mal formada com operador `&&` incorreto

```javascript
// ❌ ERRO:
where(
  "pisoId",
  "==",
  `piso/${pisoId}` && "data_cadastro",
  ">=",
  timestampLimite
);

// ✅ CORRETO:
where("pisoId", "==", `piso/${pisoId}`),
  where("data_cadastro", ">=", timestampLimite);
```

### 2. **Cálculo da Economia Duplicado** (Principal/index.tsx)

**Problema:** A economia estava sendo calculada dentro do loop, multiplicando valores incorretamente

```javascript
// ❌ ERRO:
geracaoResult.data.forEach((registro) => {
  totalKw += kwGerado;
  totalEconomia += totalKw * 0.75; // ❌ Multiplicando o total acumulado
});

// ✅ CORRETO:
// Calcular economia após somar toda a geração
totalEconomia = totalKw * 0.75;
```

### 3. **Logs de Debug Adicionados**

- Adicionados logs para verificar os IDs dos pisos extraídos
- Logs para verificar quantos documentos são encontrados no Firestore
- Debug da estrutura da coleção "geracao"

### 4. **Função Alternativa Criada** (geracaoSimples.js)

- Criada função que busca TODOS os registros (sem filtro de 24h) para debug
- Testa diferentes formatos de pisoId: `piso/${id}` e apenas `${id}`

## Como Testar:

1. **Abra o console/logs do aplicativo** para ver as mensagens de debug
2. **Navegue até a tela Principal**
3. **Verifique os logs:**
   - `🔍 Pisos encontrados:` - deve mostrar array de IDs
   - `🆔 Piso processado:` - deve mostrar como cada piso é extraído
   - `📊 Registros encontrados com piso/${id}:` - quantos documentos foram encontrados
   - `⚡ Piso ${id}: +X kW` - geração de cada piso

## Possíveis Problemas Restantes:

### 1. **Formato do pisoId no Firestore**

Se ainda não funcionar, verifique no Firebase Console como os pisoIds estão armazenados na coleção "geracao". Podem estar em formatos diferentes como:

- `piso/${id}`
- Apenas `${id}`
- `pisos/${id}`
- Referência de documento

### 2. **Campos de corrente/tensão**

Verifique se os campos `corrente` e `tensao` existem nos documentos da coleção "geracao" e se têm os nomes corretos.

### 3. **Filtro de 24h muito restritivo**

A função `geracaoSimples.js` busca TODOS os registros. Se funcionar, o problema pode estar no filtro de data das últimas 24h.

## Próximos Passos:

1. **Testar** com as correções atuais
2. **Verificar os logs** para identificar onde está o problema
3. **Ajustar** conforme necessário baseado nos logs
4. **Voltar para a função com filtro de 24h** depois que funcionar

## Arquivos Modificados:

- ✅ `src/utils/geracao.js` - Correção da query
- ✅ `src/screens/Principal/index.tsx` - Correção do cálculo e logs
- ✅ `src/utils/debugGeracao.js` - Nova função de debug
- ✅ `src/utils/geracaoSimples.js` - Nova função simplificada
