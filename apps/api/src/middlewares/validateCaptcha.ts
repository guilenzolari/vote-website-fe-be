import { Request, Response, NextFunction } from "express";
import { InvalidCaptchaError } from "../errors/VoteError";
import { verifyTurnstileToken } from "../services/turnstileService";
import { extractClientIp } from "../utils/ipExtractor";
import { log } from "../utils/logger";

export async function validateCaptcha(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (process.env.RECAPTCHA_ENABLED === "false") {
      log.debug("captcha validation skipped (disabled in env)");
      return next();
    }

    const { captchaToken } = (req as any).validatedData;

    if (!captchaToken || typeof captchaToken !== "string") {
      throw new InvalidCaptchaError("captchaToken is required");
    }

    if (captchaToken.trim().length === 0) {
      throw new InvalidCaptchaError("Invalid captcha token format");
    }

    const clientIp = extractClientIp(req);
    const verificationResult = await verifyTurnstileToken(
      captchaToken.trim(),
      clientIp,
    );

    if (!verificationResult.success) {
      log.error(
        "warn",
        "validateCaptcha",
        `Turnstile verification failed: ${verificationResult.errorCode} ${verificationResult.errorMessage ?? ""}`,
      );
      throw new InvalidCaptchaError(
        verificationResult.errorMessage || "Invalid captcha token",
      );
    }

    log.debug("captcha validation passed");
    next();
  } catch (error) {
    next(error);
  }
}
