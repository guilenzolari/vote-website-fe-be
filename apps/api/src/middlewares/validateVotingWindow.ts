import { Request, NextFunction, Response } from "express";
import { VotingClosedError, VotingNotStartedError } from "../errors/VoteError";
import { getVotingWindow } from "../utils/constants";

export function validateVotingWindow(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const currentTime = Date.now();
    const { startTime, endTime } = getVotingWindow();

    if (currentTime < startTime) {
      throw new VotingNotStartedError(
        `Voting will start at ${new Date(startTime).toISOString()}`,
      );
    }

    if (currentTime > endTime) {
      throw new VotingClosedError(
        `Voting ended at ${new Date(endTime).toISOString()}`,
      );
    }

    // Se estiver dentro da janela de votação, continua para o próximo middleware/controlador
    next();
  } catch (error) {
    // Em caso de erro, passa para o middleware de tratamento de erros
    next(error);
  }
}
