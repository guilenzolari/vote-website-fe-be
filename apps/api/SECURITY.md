# Security Guide - Vote API

## 🔐 Implementações de Segurança Atuais

### 1. **Bindings de Tempo (Temporal Binding)**
O endpoint POST `/vote` valida se a votação está dentro da janela permitida:
- Início: `VOTING_START_TIME`
- Fim: `VOTING_END_TIME`
- Resposta: `400` (não começou) ou `403` (encerrada)

### 2. **IP Hashing com Salt (LGPD Compliance)**
```typescript
hash = SHA256(IP + SALT)
```
- ✅ Não armazenamos IPs em texto plano
- ✅ Impossível reverter hash para IP original
- ✅ Salt deve ser complexo e confidencial

### 3. **Rate Limiting por IP**
- Limite: 5 requisições por 60 segundos (configurável)
- Persistência: In-memory (não precisa de DB)
- Headers informativos para o cliente

### 4. **Input Validation**
- `optionId`: string não-vazia obrigatória
- `captchaToken`: string não-vazia obrigatória
- Rejeita payloads malformados com `400`

### 5. **CORS Restritivo**
- Whitelist de origens: `CORS_ORIGIN` env var
- Credentials habilitadas apenas para origens autorizadas

### 6. **Security Headers**
```
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
X-Frame-Options: DENY
Content-Security-Policy: [configured]
Referrer-Policy: strict-origin-when-cross-origin
```

### 7. **Tratamento de Erros**
- ✅ Produção: mensagens genéricas
- ✅ Desenvolvimento: stack traces completos
- ✅ Nunca vaza informação sensível

### 8. **Server-Side Validation**
- Nunca confiar em dados do cliente
- Timestamp do servidor é a verdade absoluta
- Validação de estado antes de qualquer ação

---

## 🚨 Próximos Passos - Segurança

### Prioridade 1: reCAPTCHA v2
```typescript
// Implementar em validateCaptcha.ts
const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
  method: 'POST',
  body: new URLSearchParams({
    secret: RECAPTCHA_SECRET_KEY,
    response: captchaToken
  })
});

if (!response.success || response.score < THRESHOLD) {
  throw new InvalidCaptchaError('Bot detected');
}
```

**Benefícios:**
- Bloqueia bots automatizados
- Desafio invisível para usuários humanos
- Integração com Google

**Arquivo:** `src/middlewares/validateCaptcha.ts` (stub existente)

### Prioridade 2: Database Persistence
Atualmente usando in-memory store. Migrar para Firebase Firestore:

```typescript
// Novo arquivo: src/config/firebase.ts
import admin from 'firebase-admin';

const db = admin.firestore();

// Em VoteDataService
const voteRef = db.collection('votes');
await voteRef.add({
  optionId,
  ipHash,
  userAgent,
  timestamp,
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});
```

**Benefícios:**
- Persistência real
- Sincronização em tempo real
- Backup automático

### Prioridade 3: VPN/Proxy Detection
```typescript
// Novo arquivo: src/utils/geocheck.ts
import axios from 'axios';

export async function checkIfVPN(ip: string) {
  // Usar API como ipqualityscore.com ou abuseipdb.com
  const response = await axios.get(`https://api.ipqualityscore.com/api/json/ip/${ip}`, {
    params: { key: IPQS_KEY }
  });
  
  return response.data.is_vpn || response.data.is_proxy;
}

// Usar em rateLimit.ts
if (await checkIfVPN(clientIP)) {
  throw new Error('VPN/Proxy detected');
}
```

### Prioridade 4: Geolocation Blocking
```typescript
// Bloquear votações de regiões específicas
export const BLOCKED_COUNTRIES = ['KP', 'IR']; // ISO-3166

async function checkGeolocation(ip: string) {
  const geo = await getGeolocation(ip);
  if (BLOCKED_COUNTRIES.includes(geo.country_code)) {
    throw new Error(`Voting not allowed from ${geo.country_name}`);
  }
}
```

### Prioridade 5: Logging & Monitoring
```typescript
// src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Uso
logger.warn('[ANOMALY] Multiple votes from same IP', {
  ipHash,
  count,
  timestamp
});
```

### Prioridade 6: JWT Authentication para Admin
```typescript
// Proteger endpoints administrativos
const adminRoutes = Router();
adminRoutes.use(authenticateJWT);
adminRoutes.get('/results/detailed', AdminController.getDetailedResults);
```

### Prioridade 7: Database Transactions
```typescript
// Garantir consistência atomicidade
const batch = db.batch();
batch.set(voteRef, voteData);
batch.update(counterRef, { count: FieldValue.increment(1) });
await batch.commit();
```

### Prioridade 8: Data Retention Policy
```typescript
// Deletar dados após período de retenção
export async function cleanupOldVotes(retentionDays = 90) {
  const cutoffDate = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
  await db.collection('votes')
    .where('createdAt', '<', new Date(cutoffDate))
    .get()
    .then(snap => snap.docs.forEach(doc => doc.ref.delete()));
}
```

---

## 🛡️ Checklist de Segurança pré-Deploy

- [ ] `IP_SALT` alterado para valor aleatório complexo
- [ ] `CORS_ORIGIN` configurado apenas com domínios confiáveis
- [ ] `NODE_ENV=production` em produção
- [ ] reCAPTCHA habilitado e testado
- [ ] Database configurado com credentials seguros
- [ ] Logs centralizados (CloudLogging, Sentry, etc)
- [ ] HTTPS/TLS habilitado
- [ ] Rate limiting testado com ferramentas como `ab` ou `vegeta`
- [ ] Teste de penetração básico realizado
- [ ] Backup automático configurado

---

## 📊 Monitoramento de Segurança

### Alertas Automáticos
Configurar alertas para:
- Taxa de erro > 5% por minuto
- Rate limit triggered > 100x por minuto
- Mesma opção votada > 1000x em 5 minutos
- Votação de múltiplas regiões geográficas em < 1s

### Logs Críticos
```
[SECURITY] Invalid captcha attempt - IP: {hash}
[SECURITY] Rate limit exceeded - IP: {hash}, Requests: {count}/{limit}
[SECURITY] Voting attempted outside window - IP: {hash}, Time: {offset}s
[SECURITY] Suspicious pattern detected - {details}
```

---

## 🔄 Rotação de Segurança

### Diária
- Revisar logs de erro
- Checar alertas

### Semanal
- Revisar IP hashes suspeitos
- Analisar padrões de votação

### Mensal
- Rotacionar `IP_SALT`
- Atualizar dependências
- Testar disaster recovery

### Trimestral
- Teste de penetração
- Auditoria de segurança
- Atualizar políticas
