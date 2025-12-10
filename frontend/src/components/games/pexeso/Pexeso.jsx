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
    <section className="w-full flex justify-center px-3 sm:px-6">
      <div className="relative w-fit mx-auto">
        {isPreviewing ? (
          <h2
            className="absolute left-1/2 -translate-x-1/2 -top-10 sm:-top-12
          text-xl sm:text-3xl font-bold text-[#642f37] text-center
          leading-tight whitespace-nowrap"
          >
            Zapamätaj si kartičky!
          </h2>
        ) : (
          <>
            <h2 className="hidden md:block absolute -left-10 top-1/2 -translate-x-full -translate-y-1/2 pr-6 text-5xl font-bold text-[#642f37] leading-tight whitespace-nowrap">
              Nájdi páry!
            </h2>

            <h2 className="hidden md:block absolute -right-10 top-1/2 translate-x-full -translate-y-1/2 pl-6 text-5xl font-bold text-[#642f37] leading-tight whitespace-nowrap">
              Pohybov: {moves}
            </h2>

            {/* телефон  */}
            <div className="md:hidden mb-1 flex items-end justify-between gap-3">
              <h2 className="text-xl font-bold text-[#642f37] leading-tight">
                Nájdi páry!
              </h2>
              <h2 className="text-xl font-bold text-[#642f37] leading-tight whitespace-nowrap">
                Pohybov: {moves}
              </h2>
            </div>
          </>
        )}

        <div className="grid w-fit mx-auto grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4 place-items-center">
          {cards.map((card) => (
            <FlipCard
              key={`${card.id}${card.matchId}`}
              data={card}
              isFlipped={isPreviewing || checkIsFlipped(card)}
              onClick={() => markFlipped(card)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pexeso;
