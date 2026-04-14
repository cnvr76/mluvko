import { useCallback, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const useGameSession = (gameId) => {
  const { isAuthenticated } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [bestScore, setBestScore] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const getGame = useCallback(() => api.getGameById(gameId), [gameId]);

  const requireAuthRedirect = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/auth?type=login", {
        state: { from: location },
        replace: true,
      });
      return true;
    }
    return false;
  }, [isAuthenticated, navigate, location]);

  const finishGame = useCallback(
    async (score) => {
      if (requireAuthRedirect()) return;

      setIsSaving(true);
      setFinalScore(score);
      setBestScore(score);
      setIsFinished(true);
      try {
        const response = await api.updateStats(gameId, score);
        setBestScore(Math.round(response?.best_score * 100) / 100);
      } catch (error) {
        console.error("Failed to update game score:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [gameId]
  );

  return {
    isSaving,
    isFinished,
    isAuthenticated,
    finalScore,
    bestScore,
    getGame,
    finishGame,
    requireAuthOrRedirect: requireAuthRedirect,
  };
};

export default useGameSession;
