import { TurnstileErrorCode } from "@vote-website/shared";
import { log } from "../utils/logger";

/**
 * Response from Cloudflare's Turnstile verification endpoint
 */
interface CloudflareVerificationResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  error_codes?: string[];
  "error-codes"?: string[]; // Alternative format
}

/**
 * Verifies a Turnstile token against Cloudflare's verification endpoint
 * Server-side verification is critical for security
 *
 * @param token - The Turnstile token from the client
 * @param remoteIp - The client's IP address (for rate limiting context)
 * @returns Promise with verification result and any error information
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp: string | null,
): Promise<{
  success: boolean;
  errorCode?: TurnstileErrorCode;
  errorMessage?: string;
}> {
  // Validate token format
  if (!token || typeof token !== "string" || token.trim().length === 0) {
    log.error(
      "warn",
      "verifyTurnstileToken",
      "Missing or invalid token format",
    );
    return {
      success: false,
      errorCode: TurnstileErrorCode.MISSING_TOKEN,
      errorMessage: "Turnstile token is required",
    };
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    log.error(
      "error",
      "verifyTurnstileToken",
      "TURNSTILE_SECRET_KEY environment variable is not set",
    );
    return {
      success: false,
      errorCode: TurnstileErrorCode.UNKNOWN_ERROR,
      errorMessage: "Server configuration error",
    };
  }

  try {
    // Call Cloudflare's verification endpoint
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
          remoteip: remoteIp, // Optional but recommended for rate limiting
        }),
      },
    );

    if (!response.ok) {
      log.error(
        "error",
        "verifyTurnstileToken",
        `Cloudflare API error: ${response.status} ${response.statusText}`,
      );
      return {
        success: false,
        errorCode: TurnstileErrorCode.VERIFICATION_FAILED,
        errorMessage: "Failed to verify token",
      };
    }

    const data = (await response.json()) as CloudflareVerificationResponse;

    if (data.success) {
      log.info(
        "verifyTurnstileToken",
        `Token verified successfully for IP: ${remoteIp}`,
      );
      return { success: true };
    }

    // Token verification failed, extract error codes
    const errorCodes = data.error_codes || data["error-codes"] || [];
    const errorCode = mapCloudflareErrorCode(errorCodes[0]);

    log.error(
      "warn",
      "verifyTurnstileToken",
      `Token verification failed for IP ${remoteIp}: ${errorCodes.join(", ")}`,
    );

    return {
      success: false,
      errorCode,
      errorMessage: `Verification failed: ${errorCodes.join(", ")}`,
    };
  } catch (error) {
    log.error(
      "error",
      "verifyTurnstileToken",
      `Network error during verification: ${error instanceof Error ? error.message : String(error)}`,
    );
    return {
      success: false,
      errorCode: TurnstileErrorCode.NETWORK_ERROR,
      errorMessage: "Network error during verification",
    };
  }
}

/**
 * Maps Cloudflare error codes to our internal error codes
 */
function mapCloudflareErrorCode(cfErrorCode?: string): TurnstileErrorCode {
  if (!cfErrorCode) {
    return TurnstileErrorCode.UNKNOWN_ERROR;
  }

  // Cloudflare error codes mapping
  // Reference: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
  switch (cfErrorCode) {
    case "missing-input-secret":
    case "invalid-input-secret":
      return TurnstileErrorCode.UNKNOWN_ERROR; // Server-side issue, don't expose
    case "missing-input-response":
    case "invalid-input-response":
      return TurnstileErrorCode.INVALID_TOKEN;
    case "invalid-widget-id":
    case "invalid-parsed-json":
    case "bad-request":
      return TurnstileErrorCode.INVALID_TOKEN;
    case "timeout-or-duplicate":
      return TurnstileErrorCode.TOKEN_EXPIRED;
    case "internal-error":
      return TurnstileErrorCode.VERIFICATION_FAILED;
    default:
      return TurnstileErrorCode.UNKNOWN_ERROR;
  }
}
