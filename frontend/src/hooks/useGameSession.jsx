import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import useRequireAuth from "./useRequireAuth";
import useApiMutation from "./useApiMutation";

const resolveBestScore = async (mutateAsync, score) => {
  try {
    const response = await mutateAsync(score);
    return Math.round(response?.best_score * 100) / 100;
  } catch {
    return score;
  }
};

const useGameSession = (gameId, snapshotId) => {
  const { isAuthenticated } = useAuth();
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [bestScore, setBestScore] = useState(null);

  const requireAuthOrRedirect = useRequireAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["game", gameId, snapshotId],
    queryFn: () =>
      snapshotId
        ? api.versions.info(gameId, snapshotId)
        : api.games.byId(gameId),
    enabled: Boolean(gameId),
  });

  const updateStatsMutation = useApiMutation(
    (score) => api.games.updateStats(gameId, score),
    { errorMessage: "Nepodarilo sa uložiť skóre." },
  );

  const finishGame = async (score) => {
    if (requireAuthOrRedirect()) return;

    setFinalScore(score);
    setBestScore(score);
    setIsFinished(true);
    setBestScore(await resolveBestScore(updateStatsMutation.mutateAsync, score));
  };

  return {
    data,
    isLoading,
    error,
    isSaving: updateStatsMutation.isPending,
    isFinished,
    isAuthenticated,
    finalScore,
    bestScore,
    finishGame,
    requireAuthOrRedirect,
  };
};

export default useGameSession;
