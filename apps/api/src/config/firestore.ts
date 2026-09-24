import "dotenv/config";
import { Firestore } from "@google-cloud/firestore";
import { log } from "../utils/logger";

const projectId = process.env.GOOGLE_CLOUD_PROJECT;
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON; // Nova variável opcional

if (!projectId) {
  throw new Error("GOOGLE_CLOUD_PROJECT is not defined");
}

let dbConfig: any = { projectId };

if (emulatorHost) {
  dbConfig = {
    projectId,
    host: emulatorHost,
    ssl: false,
    credentials: {
      client_email: "local-emulator@example.com",
      private_key: "{}",
    },
    customCredentials: {
      createAuthHeader: () =>
        Promise.resolve({ Authorization: "Bearer owner" }),
    },
  };
} else if (serviceAccountJson) {
  // Se estiver em produção e passamos o JSON via variável de ambiente
  dbConfig = {
    projectId,
    credentials: JSON.parse(serviceAccountJson),
  };
}

export const db = new Firestore(dbConfig);

log.debug(`[Firestore Setup] Conectando ao projeto: ${projectId}`);
if (emulatorHost) {
  log.debug(`[Firestore Setup] 🤖 MODO EMULADOR ATIVO: ${emulatorHost}`);
} else {
  log.debug(`[Firestore Setup] ☁️ MODO PRODUÇÃO ATIVO (NUVEM)`);
}
