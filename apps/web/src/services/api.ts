import type {
  ApiResponse,
  VoteConfigResponse,
  VoteDTO,
} from "@vote-website/shared";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getConfig = async (): Promise<VoteConfigResponse> => {
  if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined");

  const response = await fetch(`${API_BASE_URL}/config`);
  if (!response.ok) {
    throw new Error(`Failed to fetch config: ${response.statusText}`);
  }

  const data: ApiResponse<VoteConfigResponse> = await response.json();
  if (!data.data) {
    throw new Error("Invalid response data");
  }

  return data.data;
};

export const postVote = async (
  vote: VoteDTO,
): Promise<{ optionId: string; message: string }> => {
  if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined");

  const response = await fetch(`${API_BASE_URL}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vote),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ApiResponse<null>;
    if (errorData.error) {
      throw errorData.error;
    }
    throw new Error(`Failed to submit vote: ${response.statusText}`);
  }

  const data: ApiResponse<{ message: string; optionId: string }> =
    await response.json();
  if (!data.data) {
    throw new Error("Invalid response data");
  }

  return data.data;
};

export const getResults = async (): Promise<{
  results: any;
  status: string;
}> => {
  if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined");

  const response = await fetch(`${API_BASE_URL}/results`);
  if (!response.ok) {
    const errorData = (await response.json()) as ApiResponse<null>;
    if (errorData.error) {
      throw errorData.error;
    }
    throw new Error(`Failed to fetch results: ${response.statusText}`);
  }

  const data: ApiResponse<{ results: any; status: string }> =
    await response.json();
  if (!data.data) {
    throw new Error("Invalid response data");
  }

  return data.data;
};
