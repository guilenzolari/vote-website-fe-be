import { useEffect, useState, useCallback } from "react";
import type { VoteConfigResponse } from "@vote-website/shared";
import { getConfig } from "../services/api";

export interface VotationStatusState extends VoteConfigResponse {
  timeOffset: number; // diferença entre server time e local time em ms
  currentTime: number; // tempo atual do cliente sincronizado com o servidor
}

export const useVotationStatus = () => {
  const [status, setStatus] = useState<VotationStatusState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca a configuração inicial do servidor
  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const config = await getConfig();

      // Calcula o offset de tempo entre o cliente e o servidor
      const localTime = Date.now();
      const serverTime = config.serverTime;
      const timeOffset = serverTime - localTime;

      setStatus({
        ...config,
        timeOffset,
        currentTime: serverTime,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch voting status",
      );
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Roda uma vez para montar o setInterval
  useEffect(() => {
    fetchConfig();

    // Roda atualizando o currentTime a cada segundo
    // para manter o relógio sincronizado com o servidor
    const interval = setInterval(() => {
      setStatus((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          currentTime: Date.now() + prev.timeOffset,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchConfig]);

  return {
    votationConfig: status,
    loading,
    error,
    refetch: fetchConfig,
  };
};
