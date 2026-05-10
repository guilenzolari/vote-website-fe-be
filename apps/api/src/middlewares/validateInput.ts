import { Request, Response, NextFunction } from "express";
import { InvalidInputError } from "../errors/VoteError";
import { VoteDTO } from "@vote-website/shared";
import { getVotingOptions } from "../services/voteDataService";

export function validateVoteInput(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { optionId, captchaToken } = req.body as VoteDTO;

    if (!optionId || typeof optionId !== "string") {
      throw new InvalidInputError("optionId is required and must be a string");
    }

    if (optionId.trim().length === 0) {
      throw new InvalidInputError("optionId cannot be empty");
    }

    // Valida se o optionId é uma opção válida
    const validOptions = getVotingOptions();
    const isValidOption = validOptions.some(
      (option) => option.id === optionId.trim(),
    );
    if (!isValidOption) {
      throw new InvalidInputError("optionId is not a valid voting option");
    }

    if (!captchaToken || typeof captchaToken !== "string") {
      throw new InvalidInputError(
        "captchaToken is required and must be a string",
      );
    }

    if (captchaToken.trim().length === 0) {
      throw new InvalidInputError("captchaToken cannot be empty");
    }

    (req as any).validatedData = {
      optionId: optionId.trim(),
      captchaToken: captchaToken.trim(),
    };

    next();
  } catch (error) {
    next(error);
  }
}
