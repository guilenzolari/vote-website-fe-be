import { ApiError } from "@vote-website/shared";

export class VoteError extends Error {
  public statusCode: number;
  public code: string;

  constructor(
    message: string,
    code: ApiError["code"],
    statusCode: number = 400,
  ) {
    super(message);
    this.name = "VoteError";
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, VoteError.prototype);
  }

  toApiError(): ApiError {
    return {
      code: this.code as any,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

// Specific error classes for better type safety
export class RateLimitError extends VoteError {
  constructor(message: string = "Too many requests") {
    super(message, "RATE_LIMIT_EXCEEDED", 429);
  }
}

export class InvalidCaptchaError extends VoteError {
  constructor(message: string = "Invalid captcha token") {
    super(message, "INVALID_CAPTCHA", 400);
  }
}

export class VotingClosedError extends VoteError {
  constructor(message: string = "Voting is closed") {
    super(message, "VOTING_CLOSED", 403);
  }
}

export class VotingNotFinishedError extends VoteError {
  constructor(message: string = "Voting has not finished yet") {
    super(message, "VOTING_NOT_FINISHED", 403);
  }
}

export class VotingNotStartedError extends VoteError {
  constructor(message: string = "Voting has not started yet") {
    super(message, "VOTING_NOT_STARTED", 403);
  }
}

export class InvalidInputError extends VoteError {
  constructor(message: string = "Invalid input") {
    super(message, "INVALID_INPUT", 400);
  }
}

export class InternalError extends VoteError {
  constructor(message: string = "Internal server error") {
    super(message, "INTERNAL_ERROR", 500);
  }
}
