import { VotingStatus, VoteRecordDB } from "@vote-website/shared";
import { getVotingWindow } from "../utils/constants";

// TODO: mover pro firestore
const votingOptions = [
  { id: "option1", name: "Candidato A", image: "/images/candidate-a.jpg" },
  { id: "option2", name: "Candidato B", image: "/images/candidate-b.jpg" },
  { id: "option3", name: "Candidato C", image: "/images/candidate-c.jpg" },
];

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
export const getVotingOptions = () => {
  return votingOptions;
};

//TODO: salvar dados no firestore
export const recordVote = (vote: VoteRecordDB): void => {
  voteRecords.push({
    ...vote,
    id: `vote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  });
};

export const countVotesByIPHash = (ipHash: string): number => {
  return voteRecords.filter((v) => v.ipHash === ipHash).length;
};

//TODO: fazer consulta de verdado no banco pra pegar o resltado
export const getDBResults = () => {
  const results: { [key: string]: number } = {};

  votingOptions.forEach((option) => {
    results[option.id] = voteRecords.filter(
      (v) => v.optionId === option.id,
    ).length;
  });

  return results;
};
