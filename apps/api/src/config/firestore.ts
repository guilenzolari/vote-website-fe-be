import "dotenv/config";
import { Firestore } from "@google-cloud/firestore";
import { log } from "../utils/logger";

const projectId = process.env.GOOGLE_CLOUD_PROJECT;
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;

if (!projectId) {
  throw new Error("GOOGLE_CLOUD_PROJECT is not defined");
}

export const db = emulatorHost
  ? new Firestore({
      projectId,
      host: emulatorHost,
      ssl: false,
      credentials: {
        client_email: "local-emulator@example.com",
        private_key: "{}",
      } as any,
      customCredentials: {
        createAuthHeader: () =>
          Promise.resolve({ Authorization: "Bearer owner" }),
      } as any,
    })
  : new Firestore({
      projectId,
    });

log.debug(`[Firestore Setup] Conectando ao projeto: ${projectId}`);
if (emulatorHost) {
  log.debug(`[Firestore Setup] 🤖 MODO EMULADOR ATIVO: ${emulatorHost}`);
} else {
  log.debug(`[Firestore Setup] ☁️ MODO PRODUÇÃO ATIVO (NUVEM)`);
}
