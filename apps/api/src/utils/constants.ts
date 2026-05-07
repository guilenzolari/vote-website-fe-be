import dotenv from "dotenv";
dotenv.config();

export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_DELAY_MS = 1000;

// Voting window validation
export function getVotingWindow() {
  const startTime = process.env.VOTING_START_TIME;
  const endTime = process.env.VOTING_END_TIME;

  if (!startTime || !endTime) {
    throw new Error("VOTING_START_TIME and VOTING_END_TIME must be set");
  }

  return {
    startTime: new Date(startTime).getTime(),
    endTime: new Date(endTime).getTime(),
  };
}

export function getMaxVotesPerIP(): number {
  if (!process.env.MAX_VOTES_PER_IP) {
    throw new Error("MAX_VOTES_PER_IP must be set");
  }
  return parseInt(process.env.MAX_VOTES_PER_IP, 10);
}

export function getRateLimitConfig() {
  if (
    !process.env.RATE_LIMIT_WINDOW_MS ||
    !process.env.RATE_LIMIT_MAX_REQUESTS
  ) {
    throw new Error(
      "RATE_LIMIT_WINDOW_MS and RATE_LIMIT_MAX_REQUESTS must be set",
    );
  }

  return {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10),
  };
}
