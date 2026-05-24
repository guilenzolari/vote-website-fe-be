import "dotenv/config";
import { Firestore } from "@google-cloud/firestore";
import { log } from "../utils/logger";

const projectId = process.env.GOOGLE_CLOUD_PROJECT || "demo-reality-show";
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;

export const db = new Firestore({
  projectId,
  ...(emulatorHost && {
    host: emulatorHost,
    ssl: false,
    // CRUCIAL: Impede o SDK de bater na nuvem buscando metadados/OAuth reais
    credentials: {
      client_email: "local-emulator@example.com",
      private_key: "{}", // Chave fictícia vazia para o emulador aceitar
    },
    // Força o gRPC interno do Google a aceitar conexões inseguras (HTTP puro do emulador)
    customCredentials: {
      createAuthHeader: () =>
        Promise.resolve({ Authorization: "Bearer owner" }),
    } as any,
  }),
});

log.debug(`[Firestore Setup] Conectando ao projeto: ${projectId}`);
if (emulatorHost) {
  log.debug(`[Firestore Setup] 🤖 MODO EMULADOR ATIVO: ${emulatorHost}`);
} else {
  log.debug(`[Firestore Setup] ☁️ MODO PRODUÇÃO ATIVO (NUVEM)`);
}
