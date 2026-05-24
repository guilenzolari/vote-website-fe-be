import { VotingStatus, VoteRecordDB } from "@vote-website/shared";
import { getVotingWindow } from "../utils/constants";
import { VOTING_OPTIONS } from "../utils/candidates";

// TODO: dar push dos dados no banco de dados real
let voteRecords: VoteRecordDB[] = [];

export const getVotingStatus = (): VotingStatus => {
  const currentTime = Date.now();
  const { startTime, endTime } = getVotingWindow();

  if (currentTime < startTime) {
    return VotingStatus.UPCOMING;
  }
  if (currentTime > endTime) {
    return VotingStatus.FINISHED;
  }
  return VotingStatus.ACTIVE;
};

export const getServerTime = (): number => {
  return Date.now();
};

export const getStartTime = (): number => {
  return getVotingWindow().startTime;
};

export const getEndTime = (): number => {
  return getVotingWindow().endTime;
};

// TODO: pegar dados do firestore
export const getVotingOptions = async () => {
  return VOTING_OPTIONS;
};

//TODO: salvar dados no firestore
export const recordVote = (vote: VoteRecordDB): void => {
  voteRecords.push({
    ...vote,
    id: `vote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  });
};

//TODO: fazer consulta de verdado no banco pra pegar o resltado
export const getDBResults = () => {
  const results: { [key: string]: number } = {};

  VOTING_OPTIONS.forEach((option) => {
    results[option.id] = voteRecords.filter(
      (v) => v.optionId === option.id,
    ).length;
  });

  return results;
};
