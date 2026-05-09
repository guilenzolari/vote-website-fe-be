import express from "express";
import cors from "cors";
import "dotenv/config";
import voteRoutes from "./routes/voteRoutes";
import { securityHeaders } from "./middlewares/securityHeaders";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

// Diz ao expressa pra interpretar o corpo das requisições como JSON
app.use(express.json());
// Permite que a API entenda dados enviados via formulários HTML tradicionais
// (embora hoje em dia usemos mais JSON, é uma boa prática manter para compatibilidade).
app.use(express.urlencoded({ extended: true }));

// CORS
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000").split(
  ",",
);
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
);

// Security headers
// Aplica p middleware de segurança dos headers em todas as respostas inclusive erros
app.use(securityHeaders);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Routes
app.use("/api/vote", voteRoutes);

// 404 handler captura tentativa de acesso a rotas que não existem
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} not found`,
      statusCode: 404,
    },
    timestamp: Date.now(),
  });
});

// Error handler precisa ser o último middleware registrado para capturar erros de todos os anteriores
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Vote API running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV && process.env.NODE_ENV != "production") {
    console.log(
      `📝 Voting window: ${process.env.VOTING_START_TIME} to ${process.env.VOTING_END_TIME}`,
    );
  }
});
