import { VotingStatus, VoteRecordDB } from "@vote-website/shared";
import {
  getVotingWindow,
  VOTING_OPTIONS,
  VOTES_COLLECTION,
} from "../utils/constants";
import { db } from "../config/firestore";

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

export const getVotingOptions = async () => {
  return VOTING_OPTIONS;
};

export const recordVote = async (
  vote: Omit<VoteRecordDB, "id">,
): Promise<string> => {
  // Cria uma referência com ID gerado automaticamente pelo Firestore
  const voteRef = db.collection(VOTES_COLLECTION).doc();

  const newVote: VoteRecordDB = {
    ...vote,
    id: voteRef.id, // Usa o ID gerado pelo Firestore
    timestamp: Date.now(),
  };

  await voteRef.set(newVote); // Salva o voto com o ID e timestamp
  return voteRef.id; // Retorna o ID do voto registrado
};

export const getDBResults = async (): Promise<{ [key: string]: number }> => {
  const options = await getVotingOptions();
  const results: { [key: string]: number } = {};

  await Promise.all(
    options.map(async (option) => {
      const snapshot = await db
        .collection(VOTES_COLLECTION)
        .where("optionId", "==", option.id)
        .count()
        .get();

      results[option.id] = snapshot.data().count; // snapshot.size retorna o número de documentos que correspondem à consulta
    }),
  );

  return results;
};
