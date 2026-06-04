import dotenv from "dotenv";
dotenv.config();

export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_DELAY_MS = 1000;

export const VOTING_OPTIONS = [
  {
    id: "arvore",
    name: "arvore",
    image:
      "https://img.freepik.com/free-photo/lavender-field-sunset-near-valensole_268835-3910.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    id: "orangutango",
    name: "orangutango",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS92eisuWOx3tEjeW14mT9ACVgXDwIRBGtnww&s",
  },
  {
    id: "homem_sentado",
    name: "homem_sentado",
    image:
      "https://images.unsplash.com/photo-1526779259212-939e64788e3c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW1hZ2VucyUyMGdyYXR1aXRhc3xlbnwwfHwwfHx8MA%3D%3D",
  },
];

export const VOTES_COLLECTION = "votes";

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
