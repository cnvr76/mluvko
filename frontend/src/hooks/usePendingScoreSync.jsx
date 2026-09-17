import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { clearPendingScore, readPendingScores } from "../utils/pendingScore";

const usePendingScoreSync = () => {
  const { isAuthenticated } = useAuth();
  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || isSyncingRef.current) return;

    const pending = readPendingScores();
    if (pending.length === 0) return;

    isSyncingRef.current = true;

    (async () => {
      for (const { key, gameId, score } of pending) {
        try {
          await api.games.updateStats(gameId, score);
          clearPendingScore(key);
          toast.success(`Výsledok ${score} sme uložili k vášmu profilu.`);
        } catch {
          toast.error("Výsledok sa nepodarilo uložiť, skúsime to nabudúce.");
        }
      }
      isSyncingRef.current = false;
    })();
  }, [isAuthenticated]);
};

export default usePendingScoreSync;
