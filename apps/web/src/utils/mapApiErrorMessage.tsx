import type { ApiError } from "@vote-website/shared";
import interfaceData from "../assets/interface.json";

export const mapApiErrorMessage = (
  error: ApiError | string | null | undefined,
): string => {
  const toastMessages = interfaceData.toastMessages as Record<string, string>;

  if (!error) {
    return "Erro desconhecido. Tente novamente mais tarde.";
  }

  if (typeof error === "string") {
    return error;
  }

  const messageFromCode = toastMessages[error.code];
  if (messageFromCode) {
    return messageFromCode;
  }

  return error.message || "Erro desconhecido. Tente novamente mais tarde.";
};
