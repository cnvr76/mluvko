import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";

const FAVORITES_KEY = ["games", "favorite"];

const useFavoriteGames = () => {
  const queryClient = useQueryClient();
  const { data: games = [], isLoading } = useQuery({
    queryKey: FAVORITES_KEY,
    queryFn: api.games.favorite,
  });

  const handleFavoriteToggle = (gameId, isNowFavorite) => {
    if (!isNowFavorite) {
      queryClient.setQueryData(FAVORITES_KEY, (prev) =>
        (prev ?? []).filter((game) => game.id !== gameId),
      );
    }
  };

  return { games, isLoading, handleFavoriteToggle };
};

export default useFavoriteGames;
