import GamesSelectionSection from "../components/games/GamesSelectionSection";
import { api, AgeGroups } from "../services/api";
import { useQuery } from "@tanstack/react-query";
import { preloadImage } from "../utils/preloadImage";
import GameCard from "../components/shared/GameCard";
import PageLoading from "../components/loading/PageLoading";

const backgroundFor = (ageGroup) =>
  ageGroup === AgeGroups.JUNIOR
    ? "/images/gamepage_2_4_background.png"
    : "/images/gamepage_5_6_background.png";

const GamesPage = ({ ageGroup }) => {
  const backgroundImage = backgroundFor(ageGroup);

  const { data, isLoading } = useQuery({
    queryKey: ["games", ageGroup],
    queryFn: async () => {
      const [games] = await Promise.all([
        api.games.forAgeGroup(ageGroup),
        preloadImage(backgroundImage),
      ]);
      return games;
    },
  });

  if (isLoading) return <PageLoading />;

  const list = data ?? [];
  const games = [...list].sort((a, b) => {
    if (a.preview_image_url && !b.preview_image_url) return -1;
    if (!a.preview_image_url && b.preview_image_url) return 1;
    return 0;
  });

  return (
    <GamesSelectionSection backgroundImage={backgroundImage}>
      {games.map((game) => (
        <GameCard key={game.id} data={game} />
      ))}
    </GamesSelectionSection>
  );
};

export default GamesPage;
