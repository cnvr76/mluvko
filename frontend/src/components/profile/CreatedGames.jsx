import React from "react";
import { Link } from "react-router-dom";
import useCreatedGames from "../../hooks/profile/useCreatedGames";

const CreatedGames = () => {
  const {
    myGames,
    isLoading,
    selectedVersions,
    selectVersion,
    handleInitDraft,
    handleSubmitForReview,
    handleArchiveGame: archiveGame,
    handleDeleteGame: deleteGame,
  } = useCreatedGames();

  const handleArchiveGame = (gameId) => {
    const isConfirmed = window.confirm(
      "Naozaj chcete archivovať túto hru? Hra zmizne zo stránky a stane sa neviditeľnou pre používateľov.",
    );
    if (isConfirmed) archiveGame(gameId);
  };

  const handleDeleteGame = (gameId) => {
    const isConfirmed = window.confirm(
      "Naozaj chcete vymazať túto hru? Táto akcia je nenávratná a vymaže všetky jej verzie.",
    );
    if (isConfirmed) deleteGame(gameId);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-extrabold drop-shadow">
          Moje vytvorené hry
        </h2>

        <div
          className="
            rounded-panel
            bg-white/30
            backdrop-blur-xl
            border border-white/40
            shadow-panel
            p-10
            text-center
            text-text
            font-semibold
          "
        >
          Načítavam vaše hry...
        </div>
      </div>
    );
  }
  if (myGames.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-extrabold drop-shadow">
            Moje vytvorené hry
          </h2>

          <button
            onClick={handleInitDraft}
            className="
            px-5 py-2.5
            rounded-xl
            bg-accent
            hover:bg-accent-hover
            text-white
            font-bold
            transition-all duration-200
          "
          >
            + Nová hra
          </button>
        </div>

        <div
          className="
          rounded-panel
          bg-white/30
          backdrop-blur-xl
          border border-white/40
          p-10
          text-center
          text-text
        "
        >
          <p className="text-xl font-bold mb-2">
            Zatiaľ nemáte vytvorené žiadne hry
          </p>

          <p className="opacity-70 mb-6">
            Vytvorte svoju prvú logopedickú hru.
          </p>

          <button
            onClick={handleInitDraft}
            className="
            px-6 py-3
            rounded-xl
            bg-accent
            hover:bg-accent-hover
            text-white
            font-bold
            transition-all duration-200
          "
          >
            + Vytvoriť hru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-extrabold drop-shadow">
          Moje vytvorené hry
        </h2>

        <button
          onClick={handleInitDraft}
          className="
            px-5 py-2.5
            rounded-xl
            bg-accent
            hover:bg-accent-hover
            text-white
            font-bold
            shadow-accent
            transition-all duration-200
          "
        >
          + Nová hra
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {myGames.map((game) => {
          const selectedSnapshotId = selectedVersions[game.id];

          const currentVersion = game.versions.find(
            (v) => v.id === selectedSnapshotId,
          );

          if (!currentVersion) return null;

          return (
            <div
              key={game.id}
              className="
                p-4
                border border-text/40
                rounded-lg
                shadow-sm
                bg-white
              "
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
                    onChange={(e) => selectVersion(game.id, e.target.value)}
                    className="
                      border border-text/50
                      rounded-lg
                      p-2
                      text-sm
                      bg-white
                      text-text
                    "
                  >
                    {[...game.versions]
                      .sort((a, b) => b.version - a.version)
                      .map((v) => (
                        <option
                          key={v.id}
                          value={v.id}
                          style={{
                            backgroundColor: "var(--color-surface)",
                            color: "var(--color-text)",
                          }}
                        >
                          v{v.version} - {v.status.toUpperCase()}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {currentVersion.status === "rejected" && (
                <div
                  className="
                    mt-3
                    p-3
                    bg-red-50
                    text-red-700
                    text-sm
                    border border-red-200
                    rounded-lg
                  "
                >
                  <strong>Zamietnuté:</strong> {currentVersion.admin_feedback}
                </div>
              )}

              {currentVersion.status === "published" && (
                <div className="mt-3 text-green-600 text-sm font-semibold">
                  Táto verzia je aktuálne zverejnená na stránke.
                </div>
              )}

              {currentVersion.status === "published" &&
                currentVersion.admin_feedback && (
                  <div
                    className="
                      mt-3
                      p-3
                      bg-blue-50
                      text-blue-700
                      text-sm
                      border border-blue-200
                      rounded-lg
                    "
                  >
                    <strong>Dôvod rollbacku:</strong>{" "}
                    {currentVersion.admin_feedback}
                  </div>
                )}

              <div className="flex gap-2 mt-4 pt-3 border-t border-text/40 justify-end">
                <Link
                  to={`/games/${game.id}/${currentVersion.game_type}?snapshot=${currentVersion.id}`}
                  className="
                    px-4 py-2
                    rounded-xl
                    bg-accent-soft
                    hover:bg-accent-soft-hover
                    text-white
                    font-semibold
                    transition-all duration-200
                  "
                >
                  Hrať
                </Link>

                <Link
                  to={`/games/${game.id}/edit?snapshot=${currentVersion.id}`}
                  className="
                    px-5 py-2
                    rounded-xl
                    bg-yellow
                    hover:bg-yellow-hover
                    text-white
                    font-semibold
                    transition-all duration-200
                  "
                >
                  Upraviť
                </Link>

                {(currentVersion.status === "draft" ||
                  currentVersion.status === "rejected" ||
                  currentVersion.status === "archived") && (
                  <button
                    onClick={() => handleSubmitForReview(game.id)}
                    className="
                      px-6 py-2
                      rounded-xl
                      bg-lavender
                      hover:bg-lavender-hover
                      text-white
                      font-semibold
                      transition-all duration-200
                    "
                  >
                    Poslať na schválenie
                  </button>
                )}

                {currentVersion.status === "published" && (
                  <button
                    onClick={() => handleArchiveGame(game.id)}
                    className="
                      px-6 py-2
                      rounded-xl
                      bg-blue
                      hover:bg-blue-hover
                      text-white
                      font-semibold
                      transition-all duration-200
                    "
                  >
                    Archivovať
                  </button>
                )}

                <button
                  onClick={() => handleDeleteGame(game.id)}
                  className="
                    px-5 py-2
                    rounded-xl
                    bg-danger-bg
                    hover:bg-danger-bg-hover
                    text-danger
                    font-semibold
                    transition-all duration-200
                  "
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
