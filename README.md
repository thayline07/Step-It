# ⚡ Step It
### Transformando passos em energia — e dados

Sistema completo de geração e monitoramento de energia a partir do movimento humano.

O **Step It** integra hardware e software para transformar passos em energia elétrica e permitir o acompanhamento da geração em tempo real por meio de um aplicativo mobile.

---

# 📱 Visualização do aplicativo

## 📥 Baixar o aplicativo (APK)

Teste o aplicativo diretamente no seu celular (Android):

👉 **Download do APK**  
https://expo.dev/accounts/thayline07/projects/Step-It/builds/8a9e09af-20e1-455f-8d15-7fdc22eed95b

---

## 🎨 Interface do aplicativo

<p align="center">
  <img src="./mockup.png" width="40%">
</p>

O aplicativo foi desenvolvido com foco em:

- visual moderno
- leitura rápida de dados
- experiência intuitiva
- modo claro e modo escuro
- acompanhamento em tempo real da geração de energia

---

# 💡 Sobre o projeto

O **Step It** foi desenvolvido como um projeto de inovação tecnológica inspirado em soluções sustentáveis para cidades inteligentes.

A ideia é simples:

Pessoas caminham sobre pisos especiais instalados em locais com grande circulação e cada passo gera energia elétrica que pode ser monitorada em um aplicativo.

Locais ideais para uso:

- escolas
- universidades
- estações de transporte
- empresas
- hospitais
- espaços públicos

---

# ⚙️ Como funciona o piso gerador

O sistema físico utiliza um mecanismo mecânico que converte o movimento do passo em energia elétrica.

### Funcionamento:

1. Quando uma pessoa pisa no piso, uma estrutura mecânica se movimenta  
2. Esse movimento ativa uma **barra dentada**  
3. A barra dentada gira um conjunto de **engrenagens**  
4. As engrenagens acionam um **motor elétrico** que funciona como gerador  
5. A energia gerada é convertida e medida por sensores  
6. Os dados são enviados para o sistema  

Esse processo ocorre rapidamente e pode ser repetido milhares de vezes por dia em locais com alto fluxo de pessoas.

---

# 🔌 Coleta de dados do sistema

Para monitorar a energia gerada, o sistema utiliza:

- ESP32  
- Sensores de corrente  
- Sensores de tensão  

O ESP32 coleta os dados e envia para o backend.

### Fluxo de dados:

Piso → Sensores → ESP32 → Firebase → Aplicativo


---

# 📊 O que o aplicativo mostra

O aplicativo permite que o usuário acompanhe:

- Energia gerada no dia  
- Histórico de geração  
- Gráficos de desempenho  
- Economia estimada  
- Dispositivos cadastrados  

### Funcionalidades principais:

- criação de conta  
- login seguro  
- cadastro de pisos  
- monitoramento em tempo real  
- visualização de gráficos  
- estimativa de economia energética  

---

# 🛠️ Tecnologias utilizadas

## 📱 Mobile
- React Native  
- JavaScript  
- Expo  

## 🔥 Backend
- Firebase Authentication → autenticação de usuários  
- Firebase Firestore → banco de dados em tempo real  
- Firebase Storage → armazenamento  

## 🌐 Hardware
- ESP32  
- Sensores de corrente  
- Sensores de tensão  

## 🧰 Ferramentas
- Git  
- GitHub  
- Figma (design da interface)  

---

# 🏗️ Arquitetura do sistema

O projeto segue uma arquitetura distribuída baseada em eventos:

Piso → Sensores → ESP32 → Firebase → App React Native

- O hardware gera os dados  
- O ESP32 envia os dados via HTTP  
- O Firebase armazena e distribui  
- O app consome e exibe em tempo real  

---

# 🚀 Instalação do projeto

## Pré-requisitos

- Node.js  
- npm ou yarn  
- Expo CLI  

---

## Clonar repositório

```bash
git clone https://github.com/thayline07/step-it.git
cd step-it
```

---

## Instalar Dependências

```bash
npm install
```
---

## Rodar Projeto

```bash
npx expo start
```

---

# 📡 Exemplo de dados recebidos do hardware

```bash
{
  "tensao": 120,
  "corrente": 10,
  "id_piso": "***************",
  "timestamp": "2026-01-01T10:00:00Z"
}
```

Esses dados são enviados pelo ESP32 e armazenados no Firebase.

---

#🌱 Impacto do projeto

O objetivo do Step It é incentivar soluções sustentáveis e inteligentes para cidades modernas.

## Benefícios:

- Energia limpa
- Uso de energia gerada pelo movimento humano
- Monitoramento inteligente
- Conscientização ambiental

---

#👩‍💻 Autores

## Thayline Inês Simioni
Planejamento e desenvolvimento do aplicativo
📧 thaylinesimioni@gmail.com

## Enzo Gabriel Pagotto Tedesco
Planejamento do aplicativo e planejamento e desenvolvimento do sistema físico
📧
