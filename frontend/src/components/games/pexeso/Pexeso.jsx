import React from "react";
import usePexeso from "../../../hooks/games/usePexeso";
import useGameSession from "../../../hooks/useGameSession";
import useAsync from "../../../hooks/useAsync";
import PageLoading from "../../loading/PageLoading";
import FlipCard from "./FlipCard";
import EndGameScreen from "../EndGameScreen";

const Pexeso = ({ gameId }) => {
  const { getGame } = useGameSession(gameId);
  const { data, isLoading, error } = useAsync(getGame);
  const {
    // card lists
    cards,
    matchedIds,
    flippedIds,
    // methods
    markFlipped,
    // score
    moves,
    // final
    finalScore,
    bestScore,
    isFinished,
    // loading
    isSaving,
    isChecking,
    isPreviewing,
  } = usePexeso(data);

  const checkIsFlipped = (card) => {
    return flippedIds.includes(card.id) || matchedIds.has(card.matchId);
  };

  if (isLoading || isSaving) return <PageLoading />;
  if (error) {
    console.error(error);
    return null;
  }

  if (isFinished)
    return <EndGameScreen bestScore={bestScore} currentScore={finalScore} />;

  return (
    <section className="flex flex-col items-center">
      <h2 className="text-3xl font-bold text-[#642f37] mb-6 min-h-[40px]">
        {isPreviewing ? "Zapamätaj si kartičky!" : "Nájdi páry!"}
      </h2>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <FlipCard
            key={`${card.id}${card.matchId}`}
            data={card}
            isFlipped={isPreviewing || checkIsFlipped(card)}
            onClick={() => markFlipped(card)}
          />
        ))}
      </div>
    </section>
  );
};

export default Pexeso;
