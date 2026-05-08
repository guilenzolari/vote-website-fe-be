import express, { Request, Response, NextFunction } from "express";
import { ApiResponse } from "@vote-website/shared";
import { VoteError } from "../errors/VoteError";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const timestamp = Date.now();

  //TODO: salvar o log de erros em um serviço externo

  // Log do error
  console.error("[Error]", {
    name: err.name,
    message: err.message,
    code: err.code,
    statusCode: err.statusCode,
    stack: err.stack,
    timestamp,
  });

  // Handle VoteError
  if (err instanceof VoteError) {
    const response: ApiResponse<null> = {
      error: err.toApiError(),
      timestamp,
    };
    return res.status(err.statusCode).json(response);
  }

  // Handle validation errors
  if (err.name === "ValidationError" || err.validation) {
    const response: ApiResponse<null> = {
      error: {
        code: "INVALID_INPUT",
        message: err.message || "Validation error",
        statusCode: 400,
      },
      timestamp,
    };
    return res.status(400).json(response);
  }

  // Default error response
  const response: ApiResponse<null> = {
    error: {
      code: "INTERNAL_ERROR",
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : err.message,
      statusCode: 500,
    },
    timestamp,
  };

  return res.status(500).json(response);
}
