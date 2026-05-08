export interface VoteRecordDB {
  id?: string;
  optionId: string;
  ipHash: string;
  createdAt: number;
  votedAt?: Date;
}
