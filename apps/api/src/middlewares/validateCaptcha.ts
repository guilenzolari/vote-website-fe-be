import { Request, Response, NextFunction } from "express";
import { InvalidCaptchaError } from "../errors/VoteError";
import { log } from "../utils/logger";

export async function validateCaptcha(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (process.env.RECAPTCHA_ENABLED === "false") {
      log.debug("reCAPTCHA validation skipped (disabled in env)");
      return next();
    }

    const { captchaToken } = (req as any).validatedData;

    if (!captchaToken) {
      throw new InvalidCaptchaError("captchaToken is required");
    }

    // TODO: Implementar a validação real do token com a API do Google reCAPTCHA
    // Por enquanto, vamos apenas simular a validação, assumindo que qualquer token não vazio é válidos
    if (captchaToken.trim().length === 0) {
      throw new InvalidCaptchaError("Invalid captcha token format");
    }

    log.debug("captcha validation passed (mock)");
    next();
  } catch (error) {
    next(error);
  }
}
