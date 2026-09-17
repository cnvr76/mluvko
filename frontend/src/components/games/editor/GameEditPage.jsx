import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQueryState } from "nuqs";
import { GameTypes, AgeGroups } from "../../../services/api";
import PexesoConfig from "./PexesoConfig";
import RepeatAfterConfig from "./RepeatAfterConfig";
import FindAndRepeatConfig from "./FindAndRepeatConfig";
import ImageField from "./ImageField";
import useGameEditor from "../../../hooks/games/editor/useGameEditor";
import PageLoading from "../../loading/PageLoading";
import useMediaReady from "../../../hooks/useMediaReady";
import { APP_BACKGROUND } from "../../../constants/media";

const EDITOR_MEDIA = [APP_BACKGROUND];

const CONFIG_COMPONENTS = {
  [GameTypes.PEXESO]: PexesoConfig,
  [GameTypes.REPEAT_AFTER]: RepeatAfterConfig,
  [GameTypes.FIND_AND_REPEAT]: FindAndRepeatConfig,
};

const GameEditPage = () => {
  const { gameId } = useParams();
  const [snapshotId] = useQueryState("snapshot");

  const { formData, loading, saving, handleBaseChange, handleSave } =
    useGameEditor(gameId, snapshotId);

  const isMediaReady = useMediaReady(EDITOR_MEDIA);

  const inputClassName = "field rounded-xl";

  if (!isMediaReady) return <PageLoading />;

  if (loading) {
    return (
      <main
        className="
        relative isolate
        w-full min-h-dvh
        px-4 pt-page-top pb-12
      "
      >
        <div
          className="
          fixed inset-0 -z-10
          bg-cover bg-center bg-no-repeat
        "
          style={{
            backgroundImage: `url('${APP_BACKGROUND}')`,
          }}
        />

        <div
          className="
          w-full max-w-5xl mx-auto
          surface-glass rounded-panel
          p-8
          text-center
          text-text
          font-semibold
        "
        >
          Načítavam editor hry...
        </div>
      </main>
    );
  }

  const SpecificConfig = CONFIG_COMPONENTS[formData.game_type];

  return (
    <main
      className="
        relative isolate
        w-full min-h-dvh
        px-4 pt-page-top pb-12
      "
    >
      <div
        className="
          fixed inset-0 -z-10
          bg-cover bg-center bg-no-repeat
        "
        style={{
          backgroundImage: `url('${APP_BACKGROUND}')`,
        }}
      />
      <div
        className="
          w-full max-w-5xl mx-auto
          surface-glass rounded-panel shadow-panel-strong
          p-5 md:p-8
          flex flex-col gap-6
          text-text
        "
      >
        <h1 className="text-fluid-2xl font-extrabold drop-shadow">
          Editácia hry: {formData.name}
        </h1>

        <section
          className="
            surface-glass bg-white/40 rounded-card
            p-4 sm:p-5
            flex flex-col gap-4
          "
        >
          <label className="flex flex-col gap-1.5 text-fluid-sm font-semibold">
            Názov hry:
            <input
              className={inputClassName}
              value={formData.name}
              onChange={(e) => handleBaseChange("name", e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-fluid-sm font-semibold">
            Obrázok hry (obálka na stránke s hrami):
            <ImageField
              placeholder="URL obrázku (/images/...)"
              value={formData.preview_image_url}
              onChange={(value) => handleBaseChange("preview_image_url", value)}
              inputClassName={inputClassName}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-fluid-sm font-semibold">
            Veková skupina:
            <select
              className={inputClassName}
              value={formData.age_group}
              onChange={(e) => handleBaseChange("age_group", e.target.value)}
            >
              {Object.values(AgeGroups).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-fluid-sm font-semibold">
            Typ hry:
            <select
              className={inputClassName}
              value={formData.game_type}
              onChange={(e) => handleBaseChange("game_type", e.target.value)}
            >
              {Object.values(GameTypes).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section
          className="
            surface-glass bg-white/40 rounded-card
            p-4 sm:p-5
          "
        >
          {SpecificConfig ? (
            <SpecificConfig
              configData={formData.config_data}
              onChange={(newConfig) =>
                handleBaseChange("config_data", newConfig)
              }
            />
          ) : (
            <p className="text-danger font-semibold">
              Editor pre tento typ hry ešte nebol vytvorený.
            </p>
          )}
        </section>

        <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="
              btn-pill surface-glass bg-white/50 border-white/60 shadow-panel
              px-8 text-fluid-lg text-text font-bold
              hover:bg-white/70 hover:text-accent
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
            "
          >
            <i
              className={`fa-solid ${saving ? "fa-spinner fa-spin" : "fa-floppy-disk"} fa-fw`}
              aria-hidden="true"
            />
            {saving ? "Ukladám..." : "Uložiť zmeny"}
          </button>

          <Link
            to={`/games/${gameId}/${formData.game_type}${
              snapshotId ? `?snapshot=${snapshotId}` : ""
            }`}
            className="
              btn-pill bg-accent hover:bg-accent-hover
              px-8 text-fluid-lg text-white font-bold shadow-accent
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
            "
          >
            <i className="fa-solid fa-play fa-fw" aria-hidden="true" />
            Hrať
          </Link>
        </div>
      </div>
    </main>
  );
};

export default GameEditPage;
