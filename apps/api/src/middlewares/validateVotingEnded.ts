import { Request, NextFunction, Response } from "express";
import { VotingNotFinishedError } from "../errors/VoteError";
import { getVotingWindow } from "../utils/constants";

// TODO: colocar o uso de passowrd para acessar endpoints administrativos

export function validateVotingEnded(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const currentTime = Date.now();
    const { startTime, endTime } = getVotingWindow();

    if (currentTime < endTime) {
      throw new VotingNotFinishedError(
        `Voting will end at ${new Date(endTime).toISOString()}`,
      );
    }
    next();
  } catch (error) {
    next(error);
  }
}
