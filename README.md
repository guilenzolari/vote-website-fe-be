# Vote Website

A voting website built as a TypeScript monorepo. It includes a React frontend, an Express API, and a shared package of types and data contracts. Votes are stored in Google Cloud Firestore, and vote submissions are protected with Cloudflare Turnstile.

## Project structure

```text
apps/
  api/       Express voting API
  web/       React frontend built with Vite
packages/
  shared/    Types and contracts shared by the frontend and API
```

## Requirements

- Node.js 20 or later
- npm
- A Google Cloud Firestore project, Firestore emulator, or Google Cloud application default credentials
- A Cloudflare Turnstile site key and secret key for voting

## Getting started

Install dependencies from the repository root:

```bash
npm install
```

Create local environment files from the examples:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Configure the environment variables described below before starting the application. In particular, set `VITE_API_URL` to `http://localhost:3001/api/vote` to match the API's default port, and provide a valid Turnstile site key in the frontend configuration.

Build the shared package and API:

```bash
npm run build
```

Start the API and frontend in separate terminals from the repository root:

```bash
npm run dev:be
```

```bash
npm run dev:fe
```

The API listens on `http://localhost:3001` by default. Vite serves the frontend at `http://localhost:5173` by default.

Open the interactive API documentation at [http://localhost:3001/api-docs](http://localhost:3001/api-docs) while the API is running.

## Environment variables

### API (`apps/api/.env`)

| Variable | Description |
| --- | --- |
| `NODE_ENV` | Runtime environment, for example `development` or `production`. |
| `PORT` | API port. Defaults to `3001`. |
| `GOOGLE_CLOUD_PROJECT` | **Required.** Google Cloud project ID used by Firestore. |
| `FIRESTORE_EMULATOR_HOST` | Optional Firestore emulator address, such as `localhost:8080`. When set, the API connects to the emulator instead of the cloud service. |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Optional service account JSON, either inline or as an absolute file path. If omitted, the Firestore client uses Application Default Credentials when connecting to Google Cloud. |
| `VOTING_START_TIME` | **Required.** Voting start time in ISO 8601 format. |
| `VOTING_END_TIME` | **Required.** Voting end time in ISO 8601 format. |
| `MAX_VOTES_PER_IP` | Included in the example environment file, but not currently enforced by the API. |
| `IP_SALT` | **Required for vote submissions.** Salt used when hashing client IP addresses for vote storage and rate limiting. |
| `RATE_LIMIT_WINDOW_MS` | **Required for vote submissions.** Rate-limit window in milliseconds. |
| `RATE_LIMIT_MAX_REQUESTS` | **Required for vote submissions.** Maximum requests allowed per rate-limit window. |
| `RECAPTCHA_ENABLED` | Set to `false` to skip server-side Turnstile verification; otherwise the API verifies submissions with Cloudflare. |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key used for server-side verification. |
| `CORS_ORIGIN` | Comma-separated list of allowed frontend origins, for example `http://localhost:5173`. |
| `LOG_LEVEL` | Logging level used by the API. |

The voting options are currently defined in the API source code.

### Frontend (`apps/web/.env`)

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | API base URL, including the `/api/vote` prefix, for example `http://localhost:3001/api/vote`. |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key used by the browser widget. |

The frontend requires a Turnstile token to submit a vote even when server-side Turnstile verification is disabled. A valid site key must therefore be configured to use the voting interface.

## API endpoints

The API is mounted at `/api/vote`:

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Returns the API health status. |
| `GET` | `/api/vote/config` | Returns the voting status, schedule, server time, and options while voting is active. |
| `POST` | `/api/vote/vote` | Submits a vote. The JSON body must include `optionId` and `captchaToken`. |
| `GET` | `/api/vote/results` | Returns vote counts after the voting period has ended. This endpoint currently has no administrator authentication. |

Voting status is determined from `VOTING_START_TIME` and `VOTING_END_TIME`. Vote records are stored in the Firestore `votes` collection.

## Build and lint

Build the shared package and API:

```bash
npm run build
```

Build the frontend:

```bash
npm run build --workspace=apps/web
```

Lint the frontend:

```bash
npm run lint --workspace=apps/web
```

The root and API `test` scripts are placeholders and do not currently run a test suite.

## Docker

The repository includes a Dockerfile for building and running the API. The container listens on port `3001`; provide the API environment variables and Firestore credentials through your container runtime.
