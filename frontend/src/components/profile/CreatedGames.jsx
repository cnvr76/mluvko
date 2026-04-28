import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

const CreatedGames = () => {
  const [myGames, setMyGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersions, setSelectedVersions] = useState({});
  const navigate = useNavigate();

  const fetchMyGames = async () => {
    setLoading(true);
    try {
      const data = await api.getMyCreatedGames();
      setMyGames(data || []);

      const initialSelected = {};
      (data || []).forEach((game) => {
        if (game.versions && game.versions.length > 0) {
          initialSelected[game.id] = game.versions[game.versions.length - 1].id;
        }
      });
      setSelectedVersions(initialSelected);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGames();
  }, []);

  const handleInitDraft = async () => {
    try {
      const data = await api.initDraft();
      navigate(`/games/${data.game_id}/edit?snapshot=${data.snapshot_id}`);
    } catch (error) {
      alert("Chyba pri vytváraní hry");
    }
  };

  const handleSubmitForReview = async (gameId) => {
    try {
      await api.submitForReview(gameId);
      fetchMyGames();
    } catch (error) {
      alert("Chyba pri odosielaní");
    }
  };

  const handleDeleteGame = async (gameId) => {
    const isConfirmed = window.confirm(
      "Naozaj chcete vymazať túto hru? Táto akcia je nenávratná a vymaže všetky jej verzie."
    );
    if (!isConfirmed) return;

    try {
      await api.deleteGame(gameId);
      fetchMyGames(); // Обновляем список игр после удаления
    } catch (error) {
      alert("Nepodarilo sa vymazať hru.");
    }
  };

  if (loading) return <div>Načítavam vaše hry...</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Moje vytvorené hry</h2>
        <button
          onClick={handleInitDraft}
          className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
        >
          + Nová hra
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {myGames.map((game) => {
          const selectedSnapshotId = selectedVersions[game.id];
          const currentVersion = game.versions.find(
            (v) => v.id === selectedSnapshotId
          );

          if (!currentVersion) return null;

          return (
            <div
              key={game.id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{currentVersion.name}</h3>
                  <p className="text-sm text-gray-500">
                    Vytvorené:{" "}
                    {new Date(currentVersion.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-600">
                    Verzia:
                  </span>
                  <select
                    value={selectedSnapshotId}
                    onChange={(e) =>
                      setSelectedVersions((prev) => ({
                        ...prev,
                        [game.id]: e.target.value,
                      }))
                    }
                    className="border rounded p-1 text-sm bg-gray-50"
                  >
                    {game.versions.map((v) => (
                      <option key={v.id} value={v.id}>
                        v{v.version} - {v.status.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {currentVersion.status === "rejected" && (
                <div className="mt-3 p-2 bg-red-50 text-red-700 text-sm border border-red-200 rounded">
                  <strong>Zamietnuté:</strong> {currentVersion.admin_feedback}
                </div>
              )}
              {currentVersion.status === "published" && (
                <div className="mt-3 text-green-600 text-sm font-semibold">
                  Táto verzia je aktuálne zverejnená na stránke.
                </div>
              )}

              <div className="flex gap-2 mt-4 pt-3 border-t justify-end">
                <Link
                  to={`/games/${game.id}/${currentVersion.game_type}?snapshot=${currentVersion.id}`}
                  className="..."
                >
                  Hrať
                </Link>

                {/* Кнопка "Удалить" / "Архивировать" может быть здесь */}

                <Link
                  to={`/games/${game.id}/edit?snapshot=${currentVersion.id}`}
                  className="px-4 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm font-medium"
                >
                  Upraviť
                </Link>

                {(currentVersion.status === "draft" ||
                  currentVersion.status === "rejected") && (
                  <button
                    onClick={() => handleSubmitForReview(game.id)}
                    className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
                  >
                    Poslať na schválenie
                  </button>
                )}

                <button
                  onClick={() => handleDeleteGame(game.id)}
                  className="px-4 py-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm font-medium"
                >
                  Vymazať
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreatedGames;
