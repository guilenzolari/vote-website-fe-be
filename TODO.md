# TODO - Reality Show Voting App

---

### 🛠️ Etapa 0: Fundações e Definições (Spikes)

- ✅ Spike Monorepo: Configurar workspace básico (NPM/Yarn Workspaces ou Turborepo).
- ✅ Spike Captcha: Registrar chaves no Google reCAPTCHA v2.
- ✅ Definição de Banco: Usar o Google Cloud

---

### 🏗️ Etapa 1: Arquitetura do Monorepo e Shared Types

- ✅ Configurar `packages/shared` para interfaces (ex: `VoteDTO`, `VotaConfig`).
- ✅ Configurar `apps/web` (React + Vite + Tailwind).
- ✅ Configurar `apps/api` (Node.js + TypeScript).
- ✅ Validar compartilhamento de tipos entre Front e Back.
- ✅ **Shared Constants**: Definir intervalos de tempo e Enums de estado (`BEFORE`, `DURING`, `AFTER`).
- ⚠️ Remover node_modules do repo remoto
- ✅ Instalar firestone pra usar o Google Cloud -> `npm install @google-cloud/firestore`

---

### ⚙️ Etapa 2: Backend & Regras de Negócio (API)

- **Modelagem & Segurança de Dados**:
  - Criar Schema de Voto (opção, timestamp, hash de IP com Salt, user-agent).
  - Implementar lógica de `hash(IP + SALT)` para conformidade com LGPD.
- **Sincronização de Estado**:
  - Criar endpoint `GET /config` (retorna `serverTime`, `startAt`, `endAt` e `status` calculado).
- **Endpoint de Votação (`POST /vote`)**:
  - 🛡️ Middleware: Validar Token reCAPTCHA.
  - 🛡️ Middleware: Rate Limit (5 votos/min por IP Hash).
  - 🛡️ **Validação de Janela Temporal**: Rejeitar votos com `400 Bad Request` se o servidor estiver fora do horário `startAt`/`endAt`.
- **Endpoint de Resultado**: `GET /results` (bloqueado com 403 até o timestamp de encerramento).

---

### 🎨 Etapa 3: Interface do Usuário (Frontend)

- **Gerenciamento de Estado Temporal**:
  - Criar Hook `useVotationStatus` para buscar `/config`.
  - Calcular `timeOffset` (Server Time vs Local Time) para evitar burlas no relógio do PC.
  - Implementar um `setInterval` (1s) para atualizar a UI em tempo real sem novos requests.
- **Fluxo de Telas (Maquininha de Estados)**:
  - 🕒 **Tela 1: Aguardando**: Contagem regressiva ativa (bloquear botão de voto).
  - 🗳️ **Tela 2: Votação Ativa**:
    - Renderizar opções de candidatos. ✅
    - Refinar logos dos patrocinadores. 🟡
    - Widget reCAPTCHA integrado ao botão de submissão.
  - 🎉 **Tela 3: Sucesso**: Feedback visual pós-voto e botão "Votar Novamente" (respeitando rate limit).
  - 🚫 **Tela 4: Encerrada**: Exibição dos resultados e mensagem de conclusão.
- **Tratamento de Erros**:
  - Toasts/Alertas para: "Votação ainda não começou", "Votação encerrada" e "Muitos pedidos (Rate Limit)".

---

### 🚀 Etapa 4: Deploy e Finalização

- **Configuração de Ambiente**:
  - Definir `.env` (Secrets do Banco, Captcha, Datas e `IP_SALT`).
- **Deploy**:
  - Backend (Vercel/Supabase) + Frontend (Vercel).
- **Compliance & Stress**:
  - Implementar banner de cookies/dados técnicos (Requisito 9).
  - **Teste de Stress**: Simular concorrência e validar se o Rate Limit bloqueia o IP corretamente.
  - **Security Audit**: Verificar se os tempos de expiração e segredos estão protegidos.

---

### 📝 Notas de Implementação

- **Segurança**: Nunca confiar no `new Date()` do cliente para liberar o voto. O backend é o juiz final.
- **UX**: Garantir que o estado "Encerrado" no Front aconteça exatamente quando o Back parar de aceitar votos.
