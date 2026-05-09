import { Router } from "express";
import { getConfig, postVote, getResults } from "../controllers/voteController";
import { validateVotingEnded } from "../middlewares/validateVotingEnded";
import { validateVotingWindow } from "../middlewares/validateVotingWindow";
import { rateLimit } from "../middlewares/rateLimit";
import { validateVoteInput } from "../middlewares/validateInput";
import { validateCaptcha } from "../middlewares/validateCaptcha";

const router = Router();

// Obtém as configs e os dados do candidato da votação
router.get("/config", getConfig);

// Salva o dado do foto
router.post(
  "/vote",
  rateLimit,
  validateVotingWindow,
  validateVoteInput,
  validateCaptcha,
  postVote,
);

// Obtém o resultado final
// TODO: implementar autenticação de admin
router.get("/results", validateVotingEnded, getResults);

export default router;
