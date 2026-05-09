import { Request, Response, NextFunction } from "express";
import { InvalidInputError } from "../errors/VoteError";
import { VoteDTO } from "@vote-website/shared";

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
