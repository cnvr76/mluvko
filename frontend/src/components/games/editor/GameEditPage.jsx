import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQueryState } from "nuqs";
import { GameTypes, AgeGroups } from "../../../services/api";
import PexesoConfig from "./PexesoConfig";
import RepeatAfterConfig from "./RepeatAfterConfig";
import FindAndRepeatConfig from "./FindAndRepeatConfig";
import ImageField from "./ImageField";
import useGameEditor from "../../../hooks/games/editor/useGameEditor";

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

  const inputClassName = `
    border border-[#642f37]/30
    bg-white/70
    rounded-xl
    px-4 py-3
    outline-none
    text-[#642f37]
    focus:ring-2
    focus:ring-[#F3904B]
  `;

  if (loading) {
    return (
      <main
        className="
        relative isolate
        w-full min-h-screen
        px-4 pt-28 pb-12
      "
      >
        <div
          className="
          fixed inset-0 -z-10
          bg-cover bg-center bg-no-repeat
        "
          style={{
            backgroundImage: "url('/images/background.png')",
          }}
        />

        <div
          className="
          w-full max-w-5xl mx-auto
          rounded-[2rem]
          bg-white/30
          backdrop-blur-xl
          border border-white/40
          p-10
          text-center
          text-[#642f37]
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
        w-full min-h-screen
        px-4 pt-28 pb-12
      "
    >
      <div
        className="
          fixed inset-0 -z-10
          bg-cover bg-center bg-no-repeat
        "
        style={{
          backgroundImage: "url('/images/background.png')",
        }}
      />
      <div
        className="
          w-full max-w-5xl mx-auto
          rounded-[2rem]
          bg-white/30
          backdrop-blur-xl
          border border-white/40
          shadow-[0_4px_30px_rgba(0,0,0,0.18)]
          p-6 md:p-8
          flex flex-col gap-6
          text-[#642f37]
        "
      >
        <h1 className="text-3xl font-extrabold drop-shadow">
          Editácia hry: {formData.name}
        </h1>

        <section
          className="
            rounded-[2rem]
            bg-white/40
            border border-white/50
            p-6
            flex flex-col gap-5
          "
        >
          <label className="flex flex-col gap-2 font-semibold">
            Názov hry:
            <input
              className={inputClassName}
              value={formData.name}
              onChange={(e) => handleBaseChange("name", e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-2 font-semibold">
            Obrázok hry (obálka na stránke s hrami):
            <ImageField
              placeholder="URL obrázku (/images/...)"
              value={formData.preview_image_url}
              onChange={(value) => handleBaseChange("preview_image_url", value)}
              inputClassName={inputClassName}
            />
          </label>

          <label className="flex flex-col gap-2 font-semibold">
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

          <label className="flex flex-col gap-2 font-semibold">
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
            rounded-[2rem]
            bg-white/40
            border border-white/50
            p-6
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
            <p className="text-red-500 font-semibold">
              Editor pre tento typ hry ešte nebol vytvorený.
            </p>
          )}
        </section>

        <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="
              px-12 py-5
              rounded-full
              bg-white/50
              backdrop-blur-xl
              border border-white/60
              shadow-[0_4px_20px_rgba(0,0,0,0.12)]
              text-[#642f37]
              text-xl
              font-bold
              transition-all duration-200
              hover:bg-white/70
              hover:text-[#ff7110]
              disabled:opacity-50 disabled:hover:bg-white/50 disabled:hover:text-[#642f37] disabled:cursor-default
            "
          >
            {saving ? "Ukladám..." : "Uložiť zmeny"}
          </button>

          <Link
            to={`/games/${gameId}/${formData.game_type}${
              snapshotId ? `?snapshot=${snapshotId}` : ""
            }`}
            className="
              px-12 py-5
              rounded-full
              bg-[#ff7110]
              hover:bg-[#e9650c]
              text-white
              text-xl
              font-bold
              no-underline
              shadow-[0_4px_20px_rgba(255,113,16,0.25)]
              transition-all duration-200
            "
          >
            ▶ Hrať
          </Link>
        </div>
      </div>
    </main>
  );
};

export default GameEditPage;
