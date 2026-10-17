# Security Guide - Vote API

## 🔐 Current security implementations

### 1. **Time binding (temporal binding)**

The `POST /vote` endpoint validates that voting is within the allowed window:

- Start: `VOTING_START_TIME`
- End: `VOTING_END_TIME`
- Response: `400` (voting has not started) or `403` (voting has ended)

### 2. **IP hashing with salt (LGPD compliance)**

```typescript
hash = SHA256(IP + SALT)
```

- ✅ IP addresses are not stored in plain text.
- ✅ The hash cannot be reversed to recover the original IP address.
- ✅ The salt should be complex and confidential.

### 3. **Rate limiting by IP**

- Limit: 5 requests per 60 seconds (configurable).
- Storage: In memory (no database required).
- Informational headers are provided to the client.

### 4. **Input validation**

- `optionId`: required, non-empty string.
- `captchaToken`: required, non-empty string.
- Malformed payloads are rejected with `400`.

### 5. **Restrictive CORS**

- Origin whitelist: `CORS_ORIGIN` environment variable.
- Credentials are enabled only for allowed origins.

### 6. **Security headers**

```
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
X-Frame-Options: DENY
Content-Security-Policy: [configured]
Referrer-Policy: strict-origin-when-cross-origin
```

### 7. **Error handling**

- ✅ Production: generic messages.
- ✅ Development: full stack traces.
- ✅ Sensitive information is never exposed.

### 8. **Server-side validation**

- Never trust client data.
- The server timestamp is the source of truth.
- Validate the state before performing any action.

---

## 🚨 Security next steps

### Priority 1: reCAPTCHA v2

```typescript
// Implement in validateCaptcha.ts
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

**Benefits:**

- Blocks automated bots.
- Invisible challenge for human users.
- Google integration.

**File:** `src/middlewares/validateCaptcha.ts` (existing stub)

### Priority 2: Database persistence

The current implementation uses an in-memory store. Migrate to Firebase Firestore:

```typescript
// New file: src/config/firebase.ts
import admin from 'firebase-admin';

const db = admin.firestore();

// In VoteDataService
const voteRef = db.collection('votes');
await voteRef.add({
  optionId,
  ipHash,
  userAgent,
  timestamp,
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});
```

**Benefits:**

- Persistent storage.
- Real-time synchronization.
- Automatic backups.

### Priority 3: VPN/proxy detection

```typescript
// New file: src/utils/geocheck.ts
import axios from 'axios';

export async function checkIfVPN(ip: string) {
  // Use an API such as ipqualityscore.com or abuseipdb.com
  const response = await axios.get(`https://api.ipqualityscore.com/api/json/ip/${ip}`, {
    params: { key: IPQS_KEY }
  });

  return response.data.is_vpn || response.data.is_proxy;
}

// Use in rateLimit.ts
if (await checkIfVPN(clientIP)) {
  throw new Error('VPN/Proxy detected');
}
```

### Priority 4: Geolocation blocking

```typescript
// Block votes from specific regions
export const BLOCKED_COUNTRIES = ['KP', 'IR']; // ISO-3166

async function checkGeolocation(ip: string) {
  const geo = await getGeolocation(ip);
  if (BLOCKED_COUNTRIES.includes(geo.country_code)) {
    throw new Error(`Voting not allowed from ${geo.country_name}`);
  }
}
```

### Priority 5: Logging and monitoring

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

// Usage
logger.warn('[ANOMALY] Multiple votes from same IP', {
  ipHash,
  count,
  timestamp
});
```

### Priority 6: JWT authentication for administrators

```typescript
// Protect administrative endpoints
const adminRoutes = Router();
adminRoutes.use(authenticateJWT);
adminRoutes.get('/results/detailed', AdminController.getDetailedResults);
```

### Priority 7: Database transactions

```typescript
// Ensure atomic consistency
const batch = db.batch();
batch.set(voteRef, voteData);
batch.update(counterRef, { count: FieldValue.increment(1) });
await batch.commit();
```

### Priority 8: Data retention policy

```typescript
// Delete data after the retention period
export async function cleanupOldVotes(retentionDays = 90) {
  const cutoffDate = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
  await db.collection('votes')
    .where('createdAt', '<', new Date(cutoffDate))
    .get()
    .then(snap => snap.docs.forEach(doc => doc.ref.delete()));
}
```

---

## 🛡️ Pre-deployment security checklist

- [ ] Change `IP_SALT` to a complex random value.
- [ ] Configure `CORS_ORIGIN` with trusted domains only.
- [ ] Set `NODE_ENV=production` in production.
- [ ] Enable and test reCAPTCHA.
- [ ] Configure the database with secure credentials.
- [ ] Centralize logs (Cloud Logging, Sentry, etc.).
- [ ] Enable HTTPS/TLS.
- [ ] Test rate limiting with tools such as `ab` or `vegeta`.
- [ ] Perform a basic penetration test.
- [ ] Configure automatic backups.

---

## 📊 Security monitoring

### Automated alerts

Configure alerts for:

- Error rate > 5% per minute.
- Rate limit triggered > 100 times per minute.
- Same option voted for > 1,000 times in 5 minutes.
- Votes from multiple geographic regions in < 1 second.

### Critical logs

```
[SECURITY] Invalid captcha attempt - IP: {hash}
[SECURITY] Rate limit exceeded - IP: {hash}, Requests: {count}/{limit}
[SECURITY] Voting attempted outside window - IP: {hash}, Time: {offset}s
[SECURITY] Suspicious pattern detected - {details}
```

---

## 🔄 Security rotation

### Daily

- Review error logs.
- Check alerts.

### Weekly

- Review suspicious IP hashes.
- Analyze voting patterns.

### Monthly

- Rotate `IP_SALT`.
- Update dependencies.
- Test disaster recovery.

### Quarterly

- Perform a penetration test.
- Conduct a security audit.
- Update policies.
