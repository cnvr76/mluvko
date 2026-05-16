import GamesSelectionSection from "../components/games/GamesSelectionSection";
import { api, AgeGroups } from "../services/api";
import { useLoaderData } from "react-router-dom";
import { preloadImage } from "../hooks/useImagePreloader";
import { useMemo } from "react";
import GameCard from "../components/shared/GameCard";

export const gamesLoaderFactory = (ageGroup) => async () => {
  const bgImage =
    ageGroup === AgeGroups.JUNIOR
      ? "/images/gamepage_2_4_background.png"
      : "/images/gamepage_5_6_background.png";

  const [data] = await Promise.all([
    api.getGamesFor(ageGroup),
    preloadImage(bgImage),
  ]);

  return { data, backgroundImage: bgImage };
};

const GamesPage = () => {
  const { data, backgroundImage } = useLoaderData();

  const games = useMemo(() => {
    const list = data ?? [];
    return [...list].sort((a, b) => {
      if (a.preview_image_url && !b.preview_image_url) return -1;
      if (!a.preview_image_url && b.preview_image_url) return 1;
      return 0;
    });
  }, [data]);

  return (
    <GamesSelectionSection backgroundImage={backgroundImage}>
      {games?.map((game, _) => (
        <GameCard key={game.id} data={game} />
      ))}
    </GamesSelectionSection>
  );
};

export default GamesPage;
