const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Vote API",
    version: "1.0.0",
    description:
      "API for retrieving voting configuration, submitting votes, and viewing results after voting ends.",
  },
  servers: [{ url: "/", description: "Current API host" }],
  tags: [
    { name: "Health", description: "API availability" },
    { name: "Voting", description: "Voting configuration and submissions" },
    { name: "Results", description: "Results available after voting ends" },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Check API health",
        responses: {
          "200": {
            description: "The API is running.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status", "timestamp"],
                  properties: {
                    status: { type: "string", example: "ok" },
                    timestamp: { type: "integer", format: "int64" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/vote/config": {
      get: {
        tags: ["Voting"],
        summary: "Get voting configuration",
        description:
          "Returns the server time, voting schedule, current status, and voting options when voting is active.",
        responses: {
          "200": {
            description: "Voting configuration.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["data", "timestamp"],
                  properties: {
                    data: {
                      type: "object",
                      required: ["serverTime", "startAt", "endAt", "status"],
                      properties: {
                        serverTime: { type: "integer", format: "int64" },
                        startAt: { type: "integer", format: "int64" },
                        endAt: { type: "integer", format: "int64" },
                        status: {
                          type: "string",
                          enum: ["UPCOMING", "ACTIVE", "FINISHED"],
                        },
                        options: {
                          type: "array",
                          items: { $ref: "#/components/schemas/VoteOption" },
                        },
                      },
                    },
                    timestamp: { type: "integer", format: "int64" },
                  },
                },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/vote/vote": {
      post: {
        tags: ["Voting"],
        summary: "Submit a vote",
        description:
          "Submits a vote during the configured voting window. Requests are rate limited and require a valid voting option and Turnstile token.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/VoteRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Vote recorded.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["data", "timestamp"],
                  properties: {
                    data: { $ref: "#/components/schemas/VoteSubmission" },
                    timestamp: { type: "integer", format: "int64" },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "403": { $ref: "#/components/responses/VotingUnavailable" },
          "429": { $ref: "#/components/responses/RateLimitExceeded" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/vote/results": {
      get: {
        tags: ["Results"],
        summary: "Get voting results",
        description:
          "Returns vote counts after voting ends. This endpoint currently has no administrator authentication.",
        responses: {
          "200": {
            description: "Final vote counts.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["data", "timestamp"],
                  properties: {
                    data: { $ref: "#/components/schemas/VotingResults" },
                    timestamp: { type: "integer", format: "int64" },
                  },
                },
              },
            },
          },
          "403": { $ref: "#/components/responses/VotingNotFinished" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
  },
  components: {
    schemas: {
      VoteOption: {
        type: "object",
        required: ["id", "name"],
        properties: {
          id: { type: "string", example: "arvore" },
          name: { type: "string", example: "arvore" },
          image: { type: "string", format: "uri" },
        },
      },
      VoteRequest: {
        type: "object",
        required: ["optionId", "captchaToken"],
        properties: {
          optionId: {
            type: "string",
            description: "ID of one of the configured voting options.",
            example: "arvore",
          },
          captchaToken: {
            type: "string",
            description: "Cloudflare Turnstile token.",
          },
        },
      },
      VoteSubmission: {
        type: "object",
        required: ["message", "optionId"],
        properties: {
          message: { type: "string", example: "Vote recorded successfully" },
          optionId: { type: "string", example: "arvore" },
        },
      },
      VotingResults: {
        type: "object",
        required: ["results", "status"],
        properties: {
          results: {
            type: "object",
            additionalProperties: { type: "integer" },
            example: { arvore: 12, orangotango: 8, homem_sentado: 5 },
          },
          status: {
            type: "string",
            enum: ["UPCOMING", "ACTIVE", "FINISHED"],
          },
        },
      },
      ApiError: {
        type: "object",
        required: ["code", "message", "statusCode"],
        properties: {
          code: {
            type: "string",
            enum: [
              "RATE_LIMIT_EXCEEDED",
              "INVALID_CAPTCHA",
              "VOTING_CLOSED",
              "VOTING_NOT_STARTED",
              "INVALID_INPUT",
              "INTERNAL_ERROR",
              "VOTING_NOT_FINISHED",
            ],
          },
          message: { type: "string" },
          statusCode: { type: "integer" },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["error", "timestamp"],
        properties: {
          error: { $ref: "#/components/schemas/ApiError" },
          timestamp: { type: "integer", format: "int64" },
        },
      },
    },
    responses: {
      BadRequest: {
        description: "Invalid vote data or Turnstile token.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      VotingUnavailable: {
        description: "Voting has not started or has already ended.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      VotingNotFinished: {
        description: "Results are not available until voting has ended.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      RateLimitExceeded: {
        description: "The request limit for this client has been exceeded.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      InternalError: {
        description: "An unexpected server error occurred.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
    },
  },
} as const;

export default openApiSpec;
