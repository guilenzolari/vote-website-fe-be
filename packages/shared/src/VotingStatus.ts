export const VotingStatus = {
  UPCOMING: "UPCOMING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
} as const;

export type VotingStatus = (typeof VotingStatus)[keyof typeof VotingStatus];
