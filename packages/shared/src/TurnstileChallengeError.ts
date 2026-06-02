export const TurnstileErrorCode = {
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  INVALID_TOKEN: "INVALID_TOKEN",
  MISSING_TOKEN: "MISSING_TOKEN",
  VERIFICATION_FAILED: "VERIFICATION_FAILED",
  NETWORK_ERROR: "NETWORK_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export type TurnstileErrorCode =
  (typeof TurnstileErrorCode)[keyof typeof TurnstileErrorCode];
