import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const fetchBestScore = async (gameId, score) => {
  try {
    const response = await api.games.updateStats(gameId, score);
    return Math.round(response?.best_score * 100) / 100;
  } catch (error) {
    console.error("Failed to update game score:", error);
    return score;
  }
};

const useGameSession = (gameId, snapshotId) => {
  const { isAuthenticated } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [bestScore, setBestScore] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { data, isLoading, error } = useQuery({
    queryKey: ["game", gameId, snapshotId],
    queryFn: () =>
      snapshotId
        ? api.versions.info(gameId, snapshotId)
        : api.games.byId(gameId),
    enabled: Boolean(gameId),
  });

  const requireAuthOrRedirect = () => {
    if (!isAuthenticated) {
      navigate("/auth?type=login", {
        state: { from: location },
        replace: true,
      });
      return true;
    }
    return false;
  };

  const finishGame = async (score) => {
    if (requireAuthOrRedirect()) return;

    setIsSaving(true);
    setFinalScore(score);
    setBestScore(score);
    setIsFinished(true);
    const finalBestScore = await fetchBestScore(gameId, score);
    setBestScore(finalBestScore);
    setIsSaving(false);
  };

  return {
    data,
    isLoading,
    error,
    isSaving,
    isFinished,
    isAuthenticated,
    finalScore,
    bestScore,
    finishGame,
    requireAuthOrRedirect,
  };
};

export default useGameSession;
