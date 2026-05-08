import "express";

declare module "express" {
  export interface Request {
    votingWindow?: {
      startTime: number;
      endTime: number;
      currentTime: number;
    };
  }
}
