const PREFIX = "mluvko:pending-score:";

export const savePendingScore = (gameId, score) => {
  try {
    sessionStorage.setItem(`${PREFIX}${gameId}`, String(score));
  } catch {
    return;
  }
};

export const readPendingScores = () => {
  try {
    return Object.keys(sessionStorage)
      .filter((key) => key.startsWith(PREFIX))
      .map((key) => ({
        key,
        gameId: key.slice(PREFIX.length),
        score: Number(sessionStorage.getItem(key)),
      }))
      .filter(({ score }) => Number.isFinite(score));
  } catch {
    return [];
  }
};

export const clearPendingScore = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch {
    return;
  }
};
