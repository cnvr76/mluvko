import { useCallback, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import useRequireAuth from "./useRequireAuth";
import useApiMutation from "./useApiMutation";
import { savePendingScore } from "../utils/pendingScore";

const submitScore = async (mutateAsync, score) => {
  try {
    const response = await mutateAsync(score);
    return { best: Math.round(response?.best_score * 100) / 100, saved: true };
  } catch {
    return { best: score, saved: false };
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
  const updateStats = updateStatsMutation.mutateAsync;

  const hasFinishedRef = useRef(false);

  const showResult = useCallback((score, best) => {
    hasFinishedRef.current = true;
    setFinalScore(score);
    setBestScore(best);
    setIsFinished(true);
  }, []);

  const finishGame = useCallback(
    async (score) => {
      if (hasFinishedRef.current) return;

      showResult(score, score);

      if (!isAuthenticated) {
        savePendingScore(gameId, score);
        return;
      }

      const { best, saved } = await submitScore(updateStats, score);
      setBestScore(best);
      if (saved) {
        toast.success(`Výsledok ${score} sme uložili k vášmu profilu.`);
      }
    },
    [gameId, isAuthenticated, showResult, updateStats],
  );

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
