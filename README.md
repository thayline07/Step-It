# ⚡ Step It

> Transformando passos em energia — e dados.

## 🧠 Sobre o projeto

O **Step It** é um sistema completo de geração e monitoramento de energia a partir do movimento humano.  
A proposta é simples e inovadora: **cada passo dado sobre o piso gera energia elétrica**, que pode ser monitorada em tempo real por meio de um aplicativo.

O projeto foi desenvolvido como parte de uma apresentação estilo *Shark Tank*, com foco em **sustentabilidade, inovação tecnológica e impacto urbano**.

---

## 🚀 Funcionalidades

- 🔐 Autenticação de usuários  
- ⚡ Monitoramento de geração de energia em tempo real  
- 📊 Visualização de dados (diário, semanal, mensal)  
- ➕ Cadastro de múltiplos pisos/dispositivos  
- 📈 Gráficos de geração e economia  
- 🌱 Estimativa de impacto ambiental  

---

## ⚙️ Tecnologias utilizadas

### 📱 Mobile
- React Native  

### 🔥 Backend / Infraestrutura
  - Firebase  
  - Authentication  
  - Firestore (banco de dados)  
  - Storage  

### 🌐 Integração com hardware
- ESP32  
- Sensores de corrente e tensão  
- Envio de dados via requisição HTTP  

---

## 🔧 Como funciona

O sistema é composto por três partes principais:

### 1️⃣ Piso gerador de energia

Ao pisar no piso:

- Uma **barra dentada** é acionada  
- Isso movimenta um conjunto de **engrenagens**  
- As engrenagens acionam um **motor elétrico**, que funciona como gerador  
- A energia gerada é convertida e medida  

---

### 2️⃣ Captura e envio de dados

- Sensores medem **corrente e tensão**  
- Um **ESP32** coleta esses dados  
- Os dados são enviados para o backend via internet  

---

### 3️⃣ Aplicativo

- O app recebe os dados do Firebase  
- Exibe em forma de gráficos e relatórios  
- Permite acompanhar geração em tempo real  

---

## 🏗️ Arquitetura do sistema


- Usuário pisa no piso
- **↓**
- Sistema mecânico gera energia
- **↓**
- Sensores medem os dados
- **↓**
- ESP32 envia via HTTP
- **↓**
- Firebase (backend)
- **↓**
- Aplicativo React Native
- **↓**
- Dashboard e gráficos


---

## 🌱 Impacto e proposta

O Step It foi criado para atuar em locais com grande circulação de pessoas, como:

- escolas  
- estações de transporte  
- hospitais  
- empresas  
- espaços públicos  

### Benefícios:

- ⚡ Geração de energia limpa  
- 💰 Redução de custos energéticos  
- 📊 Coleta de dados de fluxo de pessoas  
- 🌍 Incentivo à sustentabilidade  

---

## 💡 Diferenciais

- Integração entre **hardware + app**  
- Monitoramento em tempo real  
- Uso de **materiais reaproveitados**  
- Independente de condições climáticas (diferente de energia solar)  
- Aplicação em ambientes internos e externos  

---

## 📌 Status do projeto

🚧 Protótipo funcional desenvolvido   

---

## 👩‍💻 Autoria

Projeto desenvolvido por equipe técnica no IFRS, com participação de:

**Thayline Inês Simioni**  
Desenvolvimento do aplicativo e integração de dados

---

## 📫 Contato

📧 thaylinesimioni@gmail.com
