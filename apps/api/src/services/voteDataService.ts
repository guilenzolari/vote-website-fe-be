import { VotingStatus, VoteRecordDB } from "@vote-website/shared";
import { getVotingWindow } from "../utils/constants";

// TODO: mover pro firestore
const votingOptions = [
  {
    id: "option1",
    name: "Dinho",
    image:
      "https://img.freepik.com/free-photo/lavender-field-sunset-near-valensole_268835-3910.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    id: "option2",
    name: "Bia Rosa",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS92eisuWOx3tEjeW14mT9ACVgXDwIRBGtnww&s",
  },
  {
    id: "option3",
    name: "Madu",
    image:
      "https://images.unsplash.com/photo-1526779259212-939e64788e3c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW1hZ2VucyUyMGdyYXR1aXRhc3xlbnwwfHwwfHx8MA%3D%3D",
  },
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
