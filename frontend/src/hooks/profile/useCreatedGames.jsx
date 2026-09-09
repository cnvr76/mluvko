import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import useApiMutation from "../useApiMutation";

const MY_GAMES_KEY = ["games", "my-created"];

const useCreatedGames = () => {
  const navigate = useNavigate();
  const [selectedVersions, setSelectedVersions] = useState({});

  const { data: myGames = [], isLoading } = useQuery({
    queryKey: MY_GAMES_KEY,
    queryFn: api.games.myCreated,
  });

  useEffect(() => {
    const initialSelected = {};
    myGames.forEach((game) => {
      if (game.versions && game.versions.length > 0) {
        // prefer the published version, otherwise fall back to the latest
        // one (highest version number - API order is not guaranteed)
        const publishedVersion = game.versions.find(
          (v) => v.id === game.published_version_id,
        );
        const latestVersion = game.versions.reduce((latest, current) =>
          current.version > latest.version ? current : latest,
        );
        initialSelected[game.id] = (publishedVersion ?? latestVersion).id;
      }
    });
    setSelectedVersions(initialSelected);
  }, [myGames]);

  const selectVersion = (gameId, versionId) => {
    setSelectedVersions((prev) => ({ ...prev, [gameId]: versionId }));
  };

  const initDraftMutation = useApiMutation(api.versions.initDraft, {
    onSuccess: (data) =>
      navigate(`/games/${data.game_id}/edit?snapshot=${data.snapshot_id}`),
    errorMessage: "Chyba pri vytváraní hry",
  });

  const submitMutation = useApiMutation(api.versions.submit, {
    invalidateKey: MY_GAMES_KEY,
    errorMessage: "Chyba pri odosielaní",
  });

  const archiveMutation = useApiMutation(api.versions.archive, {
    invalidateKey: MY_GAMES_KEY,
    errorMessage: "Nepodarilo sa archivovať hru.",
  });

  const deleteMutation = useApiMutation(api.games.delete, {
    invalidateKey: MY_GAMES_KEY,
    errorMessage: "Nepodarilo sa vymazať hru.",
  });

  return {
    myGames,
    isLoading,
    selectedVersions,
    selectVersion,
    handleInitDraft: () => initDraftMutation.mutate(),
    handleSubmitForReview: (gameId) => submitMutation.mutate(gameId),
    handleArchiveGame: (gameId) => archiveMutation.mutate(gameId),
    handleDeleteGame: (gameId) => deleteMutation.mutate(gameId),
  };
};

export default useCreatedGames;
