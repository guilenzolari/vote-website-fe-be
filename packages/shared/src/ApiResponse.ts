export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  timestamp: number;
}

export interface ApiError {
  code:
    | "RATE_LIMIT_EXCEEDED"
    | "INVALID_CAPTCHA"
    | "VOTING_CLOSED"
    | "VOTING_NOT_STARTED"
    | "INVALID_INPUT"
    | "INTERNAL_ERROR";
  message: string;
  statusCode: number;
}
