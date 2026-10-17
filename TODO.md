# TODO - Reality Show Voting App

---

### 🛠️ Phase 0: Foundations and Definitions (Spikes)

- ✅ Monorepo spike: Set up a basic workspace (NPM/Yarn Workspaces or Turborepo).
- ✅ CAPTCHA spike: Register keys with Google reCAPTCHA v2.
- ✅ Database decision: Use Google Cloud.

---

### 🏗️ Phase 1: Monorepo Architecture and Shared Types

- ✅ Configure `packages/shared` for interfaces (e.g., `VoteDTO`, `VoteConfig`).
- ✅ Configure `apps/web` (React + Vite + Tailwind).
- ✅ Configure `apps/api` (Node.js + TypeScript).
- ✅ Validate type sharing between the frontend and backend.
- ✅ **Shared constants**: Define time ranges and status enums (`BEFORE`, `DURING`, `AFTER`).
- ✅ Remove `node_modules` from the remote repository.
- ✅ Install Firestore for Google Cloud: `npm install @google-cloud/firestore`.

---

### ⚙️ Phase 2: Backend and Business Rules (API)

- **Data modeling and security**:
  - ✅ Create a vote schema (option, timestamp, IP hash with salt, user agent).
  - ✅ Implement `hash(IP + SALT)` logic for LGPD compliance.
- **State synchronization**:
  - ✅ Create the `GET /config` endpoint (returns calculated `serverTime`, `startAt`, `endAt`, and `status`).
- **Voting endpoint (`POST /vote`)**:
  - ✅ Middleware: Validate the reCAPTCHA token — middleware is implemented and active; connecting it to the actual CAPTCHA service remains.
  - ✅ Middleware: Rate limit (5 votes per minute per IP hash).
  - ✅ **Voting window validation**: Reject votes with `400 Bad Request` if the server is outside the `startAt`/`endAt` window.
- **Results endpoint**:
  - ✅ `GET /results` (blocked with `403` until the voting end timestamp).
- **Real persistence (Google Cloud)**:
  - ✅ DAL: Connect `VoteDataService` to Firestore (replace mocks).
- **Access security**:
  - Admin authentication: Password/API key protection for `GET /results` and `GET /all-votes`.
- **Monitoring and availability**:
  - Implement Sentry.io or LogRocket (recommended for code errors).
  - Configure Google Cloud Monitoring (Stackdriver) for infrastructure alerts (high CPU, database unavailable).

---

### 🎨 Phase 3: User Interface (Frontend)

- **Time-based state management**:
  - ✅ Create the `useVotationStatus` hook to fetch `/config`.
  - ✅ Calculate `timeOffset` (server time vs. local time) to prevent client clock manipulation.
  - ✅ Implement a 1-second `setInterval` to update the UI in real time without additional requests.
- **Screen flow (state machine)**:
  - ✅ **Screen 1: Waiting**: Active countdown (disable the voting button).
  - **Screen 2: Voting active**:
    - ✅ Render candidate options.
    - ✅ Refine sponsor logos.
    - ✅ reCAPTCHA widget integrated with the submit button.
  - ✅ **Screen 3: Success**: Post-vote visual feedback and a "Vote Again" button (subject to rate limits).
  - ✅ **Screen 4: Finished**: Display results and a completion message.
- **Error handling**:
  - ✅ Toasts/alerts for errors: "Voting has not started yet", "Voting has ended", and "Too many requests (rate limit)".
  - ✅ Create an error boundary.

---

### 🚀 Phase 4: Deployment and Finalization

- **Environment configuration**:
  - Define `.env` (database secrets, CAPTCHA, dates, and `IP_SALT`).
  - Create a QA environment.
  - Create a production environment.
- **Deployment**:
  - Deploy the backend and frontend to Google Cloud.
- **Compliance and load testing**:
  - Implement a cookies/technical data banner (Requirement 9).
  - **Stress test**: Simulate concurrent requests and verify that the rate limiter blocks the IP correctly.
  - **Security audit**: Verify that expiration times and secrets are protected.
  - **Logging**: Ensure that `console.log` calls are disabled in production.

--
