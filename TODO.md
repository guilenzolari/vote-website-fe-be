# TODO

---

### 🛠️ Etapa 0: Fundações e Definições (Spikes)

- Spike Infraestrutura: Testar latência de Vercel Serverless Functions vs Supabase Edge Functions para evitar cold start.
  ✅ Spike Monorepo: Configurar workspace básico (NPM/Yarn Workspaces ou Turborepo) -> Workspaces -> projeto simples
- ✅ Spike Captcha: Registrar chaves no Google reCAPTCHA (v2 ou v3) e testar integração básica -> usar reCAPTCHA v2 (caixa de seleção "Não sou um robô")
- Definição de Banco: Criar cluster gratuito no MongoDB Atlas ou instância no Supabase (PostgreSQL).

---

### 🏗️ Etapa 1: Arquitetura do Monorepo e Shared Types

- Configurar pasta `packages/shared` para interfaces TypeScript (ex: `VoteDTO`, `VotaConfig`).
  ✅ Configurar `apps/web` (React + Vite + Tailwind).
  ✅ Configurar `apps/api` (Node.js + TypeScript).
- Validar compartilhamento de tipos entre Front e Back.

---

### ⚙️ Etapa 2: Backend & Regras de Negócio (API)

- Modelagem: Criar Schema de Voto (opção, timestamp, hash de IP, user-agent).
- Lógica de Período: Implementar trava de data/horário (início e fim) no servidor.
- Segurança (Rate Limit): Configurar limite de 5 votos/min por IP.
- Integração Captcha: Middleware para validar o token do reCAPTCHA vindo do front.
- Endpoint de Votação: `POST /vote` com todas as validações acima.
- Endpoint de Resultado: `GET /results` (bloqueado até o encerramento da votação).

---

### 🎨 Etapa 3: Interface do Usuário (Frontend)

- UI Base: Layout de página única responsivo.
- Estado da Votação:
  - Tela de "Aguardando Início" (com contagem regressiva).
  - Tela de "Votação Ativa" (opções e botão de votar).
  - Tela de "Votado com Sucesso" (feedback).
  - Tela de "Votação Encerrada" (exibição de resultados).
- Integração reCAPTCHA: Widget visual ou execução invisível no clique do botão.
- Tratamento de Erros: Exibir alertas para limite de IP ou votação fora do horário.

---

### 🚀 Etapa 4: Deploy e Finalização

- Configuração de Ambiente: Definir `.env` (Secrets do Banco, Captcha e Datas).
- Deploy Backend: Subir na plataforma escolhida (Vercel/Render/Supabase).
- Deploy Frontend: Subir na Vercel.
- Aviso de Dados: Implementar o banner/footer sobre registro de dados técnicos (requisito 9).
- Teste de Stress: Simular múltiplos votos manuais para validar o Rate Limit.
- Verificar se tem problemas de segurança

---

### 📝 Notas de Implementação

**Segurança:** O IP não deve ser salvo "puro" por questões de LGPD; ideal salvar um Hash do IP.
**Performance:** Como o resultado só sai no final, o cálculo pode ser uma agregação simples no banco no momento do encerramento.
