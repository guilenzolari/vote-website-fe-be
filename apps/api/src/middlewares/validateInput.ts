import { Request, Response, NextFunction } from "express";
import { InvalidInputError } from "../errors/VoteError";
import { VoteDTO } from "@vote-website/shared";

export function validateVoteInput(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { optionId, captchaToken, votedAt } = req.body as VoteDTO;

    if (!optionId || typeof optionId !== "string") {
      throw new InvalidInputError("optionId is required and must be a string");
    }

    if (optionId.trim().length === 0) {
      throw new InvalidInputError("optionId cannot be empty");
    }

    if (!captchaToken || typeof captchaToken !== "string") {
      throw new InvalidInputError(
        "captchaToken is required and must be a string",
      );
    }

    if (captchaToken.trim().length === 0) {
      throw new InvalidInputError("captchaToken cannot be empty");
    }

    if (!votedAt || !(votedAt instanceof Date) || isNaN(votedAt.getTime())) {
      throw new InvalidInputError(
        "votedAt is required and must be a valid date",
      );
    }

    (req as any).validatedData = {
      optionId: optionId.trim(),
      captchaToken: captchaToken.trim(),
      votedAt: votedAt,
    };

    next();
  } catch (error) {
    next(error);
  }
}
