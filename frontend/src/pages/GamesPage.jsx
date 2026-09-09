import GamesSelectionSection from "../components/games/GamesSelectionSection";
import { api, AgeGroups } from "../services/api";
import { useQuery } from "@tanstack/react-query";
import GameCard from "../components/shared/GameCard";
import PageLoading from "../components/loading/PageLoading";
import useMediaReady from "../hooks/useMediaReady";
import { previewUrl } from "../utils/pendingMedia";
import {
  GAMES_JUNIOR_BACKGROUND,
  GAMES_MIDDLE_BACKGROUND,
  GAME_CARD_FALLBACK,
} from "../constants/media";

const backgroundFor = (ageGroup) =>
  ageGroup === AgeGroups.JUNIOR
    ? GAMES_JUNIOR_BACKGROUND
    : GAMES_MIDDLE_BACKGROUND;

const GamesPage = ({ ageGroup }) => {
  const backgroundImage = backgroundFor(ageGroup);

  const { data, isLoading } = useQuery({
    queryKey: ["games", ageGroup],
    queryFn: () => api.games.forAgeGroup(ageGroup),
  });

  const games = [...(data ?? [])].sort((a, b) => {
    if (a.preview_image_url && !b.preview_image_url) return -1;
    if (!a.preview_image_url && b.preview_image_url) return 1;
    return 0;
  });

  const isMediaReady = useMediaReady(
    [
      backgroundImage,
      ...games.map(
        (game) => previewUrl(game.preview_image_url) || GAME_CARD_FALLBACK,
      ),
    ],
    !isLoading,
  );

  if (isLoading || !isMediaReady) return <PageLoading />;

  return (
    <GamesSelectionSection backgroundImage={backgroundImage}>
      {games.map((game) => (
        <GameCard key={game.id} data={game} />
      ))}
    </GamesSelectionSection>
  );
};

export default GamesPage;
