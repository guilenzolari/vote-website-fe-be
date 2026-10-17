# Vote API - Reality Show Voting System

Backend API for a reality show voting system, with security controls and voting window validation.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## 📋 Endpoints

### 1. GET `/api/vote/config`

Returns the voting configuration and current status.

**Response:**

```json
{
  "data": {
    "serverTime": 1715103600000,
    "startAt": 1715103600000,
    "endAt": 1715110800000,
    "status": "ACTIVE",
    "title": "Reality Show Voting 2026",
    "options": [
      { "id": "option1", "name": "Candidate A" },
      { "id": "option2", "name": "Candidate B" }
    ]
  },
  "timestamp": 1715103600000
}
```

### 2. POST `/api/vote/vote`

Records a vote for an option.

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

**Possible errors:**

- `400 Bad Request` - Invalid input or voting has not started
- `403 Forbidden` - Voting has ended
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### 3. GET `/api/vote/results`

Returns the voting results (unavailable until voting ends).

**Response (after voting ends):**

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

## 🔒 Security

### 1. **Voting window validation**

- `POST /vote` validates whether voting is within the configured time window.
- The client and server clocks need to be synchronized.
- `serverTime` is used to prevent client clock manipulation.

### 2. **Rate limiting**

- 5 requests per IP every 60 seconds (configurable through `.env`).
- IP addresses are hashed with a salt for LGPD compliance.
- Informational headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.

### 3. **IP hashing with salt**

```typescript
hash(IP + SALT); // SHA-256
```

- IP addresses are never stored in plain text.
- The salt should be changed regularly in production.
- Prevents tracking individual IP addresses.

### 4. **Security headers**

- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `X-Frame-Options: DENY`
- `Content-Security-Policy` for reCAPTCHA
- `Referrer-Policy: strict-origin-when-cross-origin`

### 5. **Input validation**

- All inputs are validated before processing.
- Generic error messages are returned in production.

### 6. **CORS**

- Configurable through `CORS_ORIGIN` (supports multiple origins).
- Credentials are enabled for requests from allowed origins.

## 🛡️ Additional security measures (roadmap)

### Future implementation - High priority

1. **reCAPTCHA v2 integration**
   - Validate the token against the Google API.
   - Implement a fallback in case of failure.
   - Make the score threshold configurable.

2. **Database integration (Firebase/Firestore)**

   ```typescript
   // Expected structure
   votes/{docId}
     - optionId: string
     - ipHash: string
     - userAgent: string
     - timestamp: number
   ```

3. **Geolocation blocking**
   - Block votes from specific regions.
   - Reject known VPNs/proxies.

4. **User-agent analysis**
   - Detect simulated bots.
   - Alert on suspicious patterns.

### Future implementation - Medium priority

5. **Logging and monitoring**
   - Structured logs (JSON).
   - Alerts for anomalies.
   - Real-time statistics dashboard.

6. **Database redundancy**
   - Automatic replication.
   - Periodic backups.
   - Point-in-time recovery.

7. **API authentication**
   - JWT for administrative operations.
   - Separate rate limits by tier.

### Future implementation - Low priority

8. **Blockchain verification** (optional)
   - Record a results hash on the blockchain.
   - Provide proof of data integrity.

9. **Multi-language support**
   - Error messages in multiple languages.

## 📊 Monitoring

### Health check

```bash
curl http://localhost:3001/health
```

### Log metrics

The logs include:

- Requests with timestamps.
- Errors with stack traces.
- Rate limit triggers.
- Voting validation.

### Vote log example

```
[2026-05-07T18:00:00Z] POST /api/vote/vote
  IP Hash: a1b2c3d4...
  Option: option1
  Status: 201
  Rate Limit: 2/5
```

## ⚙️ Configuration

### Critical variables

- `VOTING_START_TIME` and `VOTING_END_TIME` - Must use ISO 8601 format.
- `IP_SALT` - Must be complex and protected in production.
- `NODE_ENV` - Determines whether error stack traces are shown.

### Optional variables

- `RECAPTCHA_ENABLED` - Enable reCAPTCHA validation.
- `FIRESTORE_ENABLED` - Enable Firestore persistence.

## 🚀 Deployment

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

- Check `VOTING_START_TIME` in `.env`.
- Synchronize the server clock.

### "Rate limit exceeded"

- Check `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_MS`.
- Different IPs should have separate rate limits.

### CORS error

- Add the frontend origin to `CORS_ORIGIN`.
- Separate multiple origins with commas.

## 📝 Technical roadmap

- [ ] Implement reCAPTCHA v2.
- [ ] Integrate Firebase Firestore.
- [ ] Add metrics and observability.
- [ ] Administrative dashboard.
- [ ] Alerting system.
- [x] OpenAPI/Swagger documentation (available at `/api-docs`).
- [ ] Automated tests.
- [ ] CI/CD pipeline.

## 📄 License

ISC
