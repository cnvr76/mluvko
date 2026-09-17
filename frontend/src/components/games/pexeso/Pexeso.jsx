import React from "react";
import usePexeso from "../../../hooks/games/usePexeso";
import useGameSession from "../../../hooks/useGameSession";
import PageLoading from "../../loading/PageLoading";
import FlipCard from "./FlipCard";
import EndGameScreen from "../EndGameScreen";
import useMediaReady from "../../../hooks/useMediaReady";
import { previewUrl } from "../../../utils/pendingMedia";
import { APP_BACKGROUND, PEXESO_CARD_BACK } from "../../../constants/media";

const Pexeso = ({ gameId, snapshotId }) => {
  const { data, isLoading, error, ...session } = useGameSession(gameId, snapshotId);
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
    isPreviewing,
  } = usePexeso(data, session);

  const isMediaReady = useMediaReady(
    [
      APP_BACKGROUND,
      PEXESO_CARD_BACK,
      ...(data?.config_data?.cards ?? []).map((card) =>
        previewUrl(card.animal_image_url),
      ),
    ],
    !isLoading && !error,
  );

  const checkIsFlipped = (card) => {
    return flippedIds.includes(card.id) || matchedIds.has(card.matchId);
  };

  if (error) {
    console.error(error);
    return null;
  }
  if (isLoading || isSaving || !isMediaReady) return <PageLoading />;

  if (isFinished)
    return <EndGameScreen bestScore={bestScore} currentScore={finalScore} />;

  const boardPlacement = isPreviewing
    ? "col-span-full justify-self-center"
    : "col-span-2 justify-self-center xl:col-span-1 xl:col-start-2 xl:row-start-1";

  return (
    <section className="w-full flex justify-center">
      <div className="w-[min(90vw,40rem)] xl:w-full grid grid-cols-2 xl:grid-cols-[1fr_auto_1fr] items-center gap-x-4 xl:gap-x-10 gap-y-2">
        {isPreviewing ? (
          <h2 className="col-span-full text-center text-fluid-3xl font-bold text-text">
            Zapamätaj si kartičky!
          </h2>
        ) : (
          <>
            <h2 className="text-fluid-3xl xl:text-fluid-5xl font-bold text-text xl:col-start-1 xl:row-start-1 xl:justify-self-end">
              Nájdi páry!
            </h2>
            <h2 className="text-fluid-3xl xl:text-fluid-5xl font-bold text-text whitespace-nowrap justify-self-end xl:col-start-3 xl:row-start-1 xl:justify-self-start">
              Pohybov: {moves}
            </h2>
          </>
        )}

        <div
          className={`${boardPlacement} w-[min(90vw,40rem)] grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4`}
        >
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
