import { Request, Response, NextFunction } from "express";
import { ApiResponse, VoteConfigResponse } from "@vote-website/shared";
import {
  getVotingStatus,
  getStartTime,
  getEndTime,
  getServerTime,
  getVotingOptions,
  countVotesByIPHash,
  recordVote,
  getDBResults,
} from "../services/voteDataService";
import { extractClientIP, hashIP } from "../utils/ipHash";
import { getMaxVotesPerIP } from "../utils/constants";
import { ApiError } from "../../../../packages/shared/src/ApiResponse";

// GET /config
export const getConfig = (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = getVotingStatus();
    const startAt = getStartTime();
    const endAt = getEndTime();
    const serverTime = getServerTime();
    const options = getVotingOptions();

    const response: ApiResponse<VoteConfigResponse> = {
      data: {
        serverTime,
        startAt,
        endAt,
        status,
        options,
      },
      timestamp: serverTime,
    };

    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

// POST /vote
export const postVote = (req: Request, res: Response, next: NextFunction) => {
  try {
    const serverTime = getServerTime();
    const { optionId } = (req as any).validatedData;
    const ipSalt = process.env.IP_SALT;
    if (!ipSalt) throw new Error("IP_SALT environment variable is not defined");
    const clientIP = extractClientIP(req);
    const ipHash = hashIP(clientIP, ipSalt);
    const maxVotesPerIP = getMaxVotesPerIP();

    // Checa se o IP já atingiu o limite de votos permitido
    const voteCount = countVotesByIPHash(ipHash);
    if (voteCount >= maxVotesPerIP) {
      return res.status(400).json({
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: `This IP has already voted ${voteCount} times (max: ${maxVotesPerIP} per minute)`,
          statusCode: 400,
        },
        timestamp: serverTime,
      });
    }

    recordVote({
      optionId,
      ipHash,
      createdAt: serverTime,
    });

    const response: ApiResponse<{ message: string; optionId: string }> = {
      data: {
        message: "Vote recorded successfully",
        optionId,
      },
      timestamp: serverTime,
    };

    return res.status(201).json(response);
  } catch (error) {
    return next(error);
  }
};

// GET /results bloqueado até o fim da votação por middleware
export const getResults = (req: Request, res: Response, next: NextFunction) => {
  try {
    const timestamp = Date.now();
    const status = getVotingStatus();
    const endAt = getEndTime();

    const results = getDBResults();
    const response: ApiResponse<{ results: any; status: string }> = {
      data: {
        results,
        status,
      },
      timestamp,
    };

    return res.json(response);
  } catch (error) {
    return next(error);
  }
};
