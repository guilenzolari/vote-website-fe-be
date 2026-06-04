import { VotingStatus } from "./VotingStatus";

export interface VoteConfigResponse {
  serverTime: number; // timestamp milisegundos
  startAt: number; // timestamp milisegundos
  endAt: number; // timestamp milisegundos
  status: VotingStatus;
  options: CandidateVoteOption[] | undefined;
}

export interface CandidateVoteOption {
  id: string;
  name: string;
  image?: string;
}
