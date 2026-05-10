# Vote API - Reality Show Voting System

API backend para sistema de votação de Reality Show com segurança e validação de janela temporal.

## 🚀 Quick Start

### Instalação

```bash
npm install
```

### Variáveis de Ambiente

Copiar `.env.example` para `.env` e preencher os valores:

```bash
cp .env.example .env
```

### Desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Produção

```bash
npm start
```

## 📋 Endpoints

### 1. GET `/api/vote/config`

Retorna configuração de votação e status atual.

**Response:**

```json
{
  "data": {
    "serverTime": 1715103600000,
    "startAt": 1715103600000,
    "endAt": 1715110800000,
    "status": "ACTIVE",
    "title": "Votação Reality Show 2026",
    "options": [
      { "id": "option1", "name": "Candidato A" },
      { "id": "option2", "name": "Candidato B" }
    ]
  },
  "timestamp": 1715103600000
}
```

### 2. POST `/api/vote/vote`

Registra um voto para uma opção.

**Request:**

```json
{
  "optionId": "option1",
  "captchaToken": "token-from-recaptcha"
}
```

**Response (201):**

```json
{
  "data": {
    "message": "Vote recorded successfully",
    "voteCount": 1
  },
  "timestamp": 1715103600000
}
```

**Erros Possíveis:**

- `400 Bad Request` - Input inválido ou votação não começou
- `403 Forbidden` - Votação encerrada
- `429 Too Many Requests` - Rate limit excedido
- `500 Internal Server Error` - Erro no servidor

### 3. GET `/api/vote/results`

Retorna resultados da votação (bloqueado até encerramento).

**Response (após votação encerrar):**

```json
{
  "data": {
    "results": {
      "option1": 150,
      "option2": 120,
      "option3": 200
    },
    "status": "FINISHED"
  },
  "timestamp": 1715110800000
}
```

## 🔒 Segurança

### 1. **Validação de Janela Temporal**

- Endpoint POST `/vote` valida se a votação está no intervalo configurado
- Cliente e servidor precisam estar sincronizados
- `serverTime` é utilizado para evitar burlas de relógio do cliente

### 2. **Rate Limiting**

- 5 requisições por IP a cada 60 segundos (configurável via `.env`)
- IP é hasheado com salt para LGPD compliance
- Headers informativos: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### 3. **IP Hash com Salt**

```typescript
hash(IP + SALT); // SHA-256
```

- Nunca armazenamos IPs em texto plano
- Salt deve ser alterado regularmente em produção
- Impede rastreamento de IPs individuais

### 4. **Headers de Segurança**

- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `X-Frame-Options: DENY`
- `Content-Security-Policy` para reCAPTCHA
- `Referrer-Policy: strict-origin-when-cross-origin`

### 5. **Validação de Entrada**

- Todos os inputs são validados antes do processamento
- Mensagens de erro genéricas em produção

### 6. **CORS**

- Configurável via `CORS_ORIGIN` (múltiplas origens suportadas)
- Credentials habilitadas para requests de origem autorizada

## 🛡️ Extras de Segurança (Roadmap)

### Implementação Futura - Prioridade Alta

1. **reCAPTCHA v2 Integration**
   - Validar token contra Google API
   - Implementar fallback em caso de falha
   - Threshold de score configurável

2. **Database Integration (Firebase/Firestore)**

   ```typescript
   // Estrutura esperada
   votes/{docId}
     - optionId: string
     - ipHash: string
     - userAgent: string
     - timestamp: number
   ```

3. **Geolocation Blocking**
   - Bloquear votações de regiões específicas
   - Rejeitar VPNs/Proxies conhecidos

4. **User-Agent Analysis**
   - Detectar bots simulados
   - Alertas para padrões suspeitos

### Implementação Futura - Prioridade Média

5. **Logging & Monitoring**
   - Logs estruturados (JSON)
   - Alertas para anomalias
   - Dashboard de estatísticas em tempo real

6. **Database Redundancy**
   - Replicação automática
   - Backup periódico
   - Point-in-time recovery

7. **API Authentication**
   - JWT para operações administrativas
   - Rate limiting separado por tier

### Implementação Futura - Prioridade Baixa

8. **Blockchain Verification** (opcional)
   - Registrar hash de resultados no blockchain
   - Prova de integridade dos dados

9. **Multi-language Support**
   - Mensagens de erro em múltiplos idiomas

## 📊 Monitoramento

### Health Check

```bash
curl http://localhost:3001/health
```

### Métricas com Logs

Os logs incluem:

- Requisições com timestamp
- Erros com stack trace
- Rate limit triggers
- Validação de votação

### Exemplo de Log de Voto

```
[2026-05-07T18:00:00Z] POST /api/vote/vote
  IP Hash: a1b2c3d4...
  Option: option1
  Status: 201
  Rate Limit: 2/5
```

## ⚙️ Configuração

### Variáveis Críticas

- `VOTING_START_TIME` e `VOTING_END_TIME` - DEVE estar em ISO 8601
- `IP_SALT` - Deve ser complexo e protegido em produção
- `NODE_ENV` - Define se mostrar stack traces de erro

### Variáveis Opcionais

- `RECAPTCHA_ENABLED` - Ativar validação de reCAPTCHA
- `FIRESTORE_ENABLED` - Ativar persistência no Firestore

## 🚀 Deploy

### Vercel

```bash
vercel deploy
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### "Voting has not started yet"

- Verificar `VOTING_START_TIME` no `.env`
- Sincronizar relógio do servidor

### "Rate limit exceeded"

- Verificar `RATE_LIMIT_MAX_REQUESTS` e `RATE_LIMIT_WINDOW_MS`
- Diferentes IPs devem ter rate limits separados

### CORS Error

- Adicionar origem do frontend em `CORS_ORIGIN`
- Separar múltiplas origens com vírgula

## 📝 Roadmap Técnico

- [ ] Implementar reCAPTCHA v2
- [ ] Integrar Firebase Firestore
- [ ] Adicionar métricas e observabilidade
- [ ] Dashboard administrativo
- [ ] Sistema de alertas
- [ ] Documentação OpenAPI/Swagger
- [ ] Testes automatizados
- [ ] CI/CD pipeline

## 📄 Licença

ISC
