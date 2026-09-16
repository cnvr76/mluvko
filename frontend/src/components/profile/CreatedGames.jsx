import React from "react";
import { Link } from "react-router-dom";
import useCreatedGames from "../../hooks/profile/useCreatedGames";
import ActionButton from "../shared/ActionButton";
import PanelHeader from "./PanelHeader";
import Notice from "../shared/Notice";
import { actionButtonClass } from "../shared/actionButtonClass";

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
        <PanelHeader title="Moje vytvorené hry" />

        <div
          className="
            surface-glass rounded-card
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
        <PanelHeader title="Moje vytvorené hry">
          <button
            onClick={handleInitDraft}
            className="btn-pill bg-accent-soft hover:bg-accent-hover text-white font-bold shadow-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <i className="fa-solid fa-plus fa-fw" aria-hidden="true" />
            Nová hra
          </button>
        </PanelHeader>

        <div
          className="
          surface-glass rounded-card
          p-8
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
            className="btn-pill bg-accent hover:bg-accent-hover text-white font-bold shadow-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <i className="fa-solid fa-plus fa-fw" aria-hidden="true" />
            Vytvoriť hru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PanelHeader title="Moje vytvorené hry">
        <button
          onClick={handleInitDraft}
          className="btn-pill bg-accent hover:bg-accent-hover text-white font-bold shadow-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <i className="fa-solid fa-plus fa-fw" aria-hidden="true" />
          Nová hra
        </button>
      </PanelHeader>

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
              className="surface-glass bg-white/40 rounded-card p-4"
            >
              <div className="flex flex-wrap gap-3 justify-between items-start">
                <div>
                  <h3 className="text-fluid-lg font-bold">
                    {currentVersion.name}
                  </h3>

                  <p className="text-fluid-sm text-text/60">
                    Vytvorené:{" "}
                    {new Date(currentVersion.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-fluid-sm font-semibold text-text/60">
                    Verzia:
                  </span>

                  <select
                    value={selectedSnapshotId}
                    onChange={(e) => selectVersion(game.id, e.target.value)}
                    className="field rounded-full w-auto py-2 text-fluid-sm"
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
                <div className="mt-3">
                  <Notice tone="danger" title="Zamietnuté">
                    {currentVersion.admin_feedback}
                  </Notice>
                </div>
              )}

              {currentVersion.status === "published" && (
                <div className="mt-3">
                  <Notice tone="success">
                    Táto verzia je aktuálne zverejnená na stránke.
                  </Notice>
                </div>
              )}

              {currentVersion.status === "published" &&
                currentVersion.admin_feedback && (
                  <div className="mt-3">
                    <Notice tone="info" title="Dôvod rollbacku">
                      {currentVersion.admin_feedback}
                    </Notice>
                  </div>
                )}

              <div className="flex flex-wrap gap-2 mt-4 justify-end">
                <Link
                  to={`/games/${game.id}/${currentVersion.game_type}?snapshot=${currentVersion.id}`}
                  aria-label="Hrať"
                  title="Hrať"
                  className={actionButtonClass("accentSoft")}
                >
                  <i className="fa-solid fa-play fa-fw" aria-hidden="true" />
                </Link>

                <Link
                  to={`/games/${game.id}/edit?snapshot=${currentVersion.id}`}
                  aria-label="Upraviť"
                  title="Upraviť"
                  className={actionButtonClass("yellow")}
                >
                  <i className="fa-solid fa-pen fa-fw" aria-hidden="true" />
                </Link>

                {(currentVersion.status === "draft" ||
                  currentVersion.status === "rejected" ||
                  currentVersion.status === "archived") && (
                  <ActionButton
                    icon="fa-paper-plane"
                    label="Poslať na schválenie"
                    tone="lavender"
                    onClick={() => handleSubmitForReview(game.id)}
                  />
                )}

                {currentVersion.status === "published" && (
                  <ActionButton
                    icon="fa-box-archive"
                    label="Archivovať"
                    tone="blue"
                    onClick={() => handleArchiveGame(game.id)}
                  />
                )}

                <ActionButton
                  icon="fa-trash"
                  label="Vymazať hru"
                  tone="danger"
                  onClick={() => handleDeleteGame(game.id)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreatedGames;
