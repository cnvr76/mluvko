import React from "react";
import AudioSources from "./AudioSources";
import ImageField from "./ImageField";
import {
  FIND_PROMPT_TEXT,
  CONFIRM_PROMPT_TEXT,
} from "../find_and_repeat/prompts";
import ActionButton from "../../shared/ActionButton";

const FindAndRepeatConfig = ({ configData, onChange }) => {
  const levels = configData.levels || [];

  const update = (patch) => onChange({ ...configData, ...patch });

  const updateLevel = (levelIndex, newLevel) => {
    const newLevels = [...levels];
    newLevels[levelIndex] = newLevel;
    update({ levels: newLevels });
  };

  const addLevel = () => {
    const newId =
      levels.length > 0 ? Math.max(...levels.map((l) => l.level_id)) + 1 : 1;
    update({ levels: [...levels, { level_id: newId, cards: [] }] });
  };

  const removeLevel = (levelIndex) => {
    update({ levels: levels.filter((_, i) => i !== levelIndex) });
  };

  const addCard = (levelIndex) => {
    const level = levels[levelIndex];
    const cards = level.cards || [];
    const newId =
      cards.length > 0 ? Math.max(...cards.map((c) => c.card_id)) + 1 : 1;
    updateLevel(levelIndex, {
      ...level,
      cards: [
        ...cards,
        { card_id: newId, name: "", image_url: "", reference_audio: "" },
      ],
    });
  };

  const updateCard = (levelIndex, cardIndex, field, value) => {
    const level = levels[levelIndex];
    const newCards = [...level.cards];
    newCards[cardIndex] = { ...newCards[cardIndex], [field]: value };
    updateLevel(levelIndex, { ...level, cards: newCards });
  };

  const removeCard = (levelIndex, cardIndex) => {
    const level = levels[levelIndex];
    updateLevel(levelIndex, {
      ...level,
      cards: level.cards.filter((_, i) => i !== cardIndex),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-3 justify-between items-center surface-glass bg-white/40 rounded-card px-4 py-3">
        <h3 className="text-fluid-lg font-bold">Nastavenia Nájdi a zopakuj</h3>

        <button
          onClick={addLevel}
          className="btn-pill bg-accent hover:bg-accent-hover text-white text-fluid-sm font-bold shadow-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <i className="fa-solid fa-plus fa-fw" aria-hidden="true" />
          Pridať úroveň
        </button>
      </div>

      {/* Spoločné hlasy hry (generujú sa raz, používajú sa vo všetkých úrovniach) */}
      <div className="surface-glass bg-white/50 rounded-card p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <AudioSources
            label="Úvodná výzva (zaznie iba na prvej etape)"
            defaultText={FIND_PROMPT_TEXT}
            currentPath={configData.find_prompt_audio}
            onChange={(path) => update({ find_prompt_audio: path })}
          />
          <p className="text-fluid-sm text-text/50 mt-1">
            Napr. „{FIND_PROMPT_TEXT}“.
          </p>
        </div>

        <div>
          <AudioSources
            label="Otázka po nahrávke"
            defaultText={CONFIRM_PROMPT_TEXT}
            currentPath={configData.confirm_prompt_audio}
            onChange={(path) => update({ confirm_prompt_audio: path })}
          />
          <p className="text-fluid-sm text-text/50 mt-1">
            Napr. „{CONFIRM_PROMPT_TEXT}“. Zaznie po prehratí nahrávky dieťaťa.
          </p>
        </div>
      </div>

      {levels.length === 0 && (
        <div className="surface-glass bg-white/40 rounded-card text-center py-10 text-text/60">
          <p className="font-bold">Zatiaľ žiadne úrovne</p>
          <p className="text-fluid-sm">Pridajte úroveň a do nej kartičky.</p>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {levels.map((level, levelIndex) => {
          const cards = level.cards || [];

          return (
            <div
              key={level.level_id}
              className="surface-glass bg-white/40 rounded-card p-3 flex flex-col gap-3"
            >
              {/* sticky header so the controls stay reachable in long levels */}
              <div className="sticky top-page-top z-10 flex flex-wrap justify-between items-center gap-2 surface-glass bg-white/80 rounded-xl px-3 py-2">
                <div className="flex items-center gap-3">
                  <span className="bg-text text-white px-4 py-1.5 rounded-full text-fluid-sm font-bold shrink-0">
                    Úroveň {levelIndex + 1}
                  </span>

                  <label className="flex items-center gap-1.5 text-fluid-sm font-semibold text-text/70">
                    Etáp:
                    <input
                      type="number"
                      min="1"
                      value={level.stages_count ?? ""}
                      placeholder={String(cards.length)}
                      onChange={(e) => {
                        const v = e.target.value;
                        updateLevel(levelIndex, {
                          ...level,
                          stages_count:
                            v === "" ? null : Math.max(1, parseInt(v, 10) || 1),
                        });
                      }}
                      className="field rounded-xl w-20 py-1.5 text-center"
                      title="Koľko etáp z tejto úrovne hrať (prázdne = všetky kartičky)"
                    />
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => addCard(levelIndex)}
                    className="btn-pill bg-accent hover:bg-accent-hover text-white text-fluid-sm font-bold shadow-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <i className="fa-solid fa-plus fa-fw" aria-hidden="true" />
                    Pridať kartu
                  </button>

                  <ActionButton
                    icon="fa-trash"
                    label="Vymazať úroveň"
                    tone="danger"
                    onClick={() => removeLevel(levelIndex)}
                  />
                </div>
              </div>

              {cards.length === 0 ? (
                <p className="text-fluid-sm text-text/60 italic px-1">
                  Pridajte kartičky do tejto úrovne.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {cards.map((card, cardIndex) => (
                    <div
                      key={card.card_id}
                      className="relative surface-glass bg-white/60 rounded-card p-4 grid grid-cols-1 lg:grid-cols-2 gap-4"
                    >
                      <div className="absolute -top-3 -right-3 z-10">
                        <ActionButton
                          icon="fa-xmark"
                          label="Odstrániť kartičku"
                          tone="danger"
                          onClick={() => removeCard(levelIndex, cardIndex)}
                        />
                      </div>

                      {/* Ľavý stĺpec: text a obrázok */}
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                          <span className="bg-accent text-white px-3 py-1 rounded-full text-fluid-sm flex items-center font-bold shrink-0">
                            #{card.card_id}
                          </span>
                          <input
                            className="flex-1 min-w-0 bg-transparent border-b-2 border-text focus:border-accent outline-none p-1 font-bold text-fluid-lg text-text"
                            placeholder="Slovo / veta (napr. ryba)"
                            value={card.name}
                            onChange={(e) =>
                              updateCard(
                                levelIndex,
                                cardIndex,
                                "name",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <ImageField
                          label={card.name}
                          placeholder="URL obrázku / GIF (/images/find_and_repeat/...)"
                          value={card.image_url}
                          onChange={(value) =>
                            updateCard(
                              levelIndex,
                              cardIndex,
                              "image_url",
                              value,
                            )
                          }
                        />
                      </div>

                      {/* Pravý stĺpec: audio */}
                      <div className="flex flex-col justify-center">
                        <AudioSources
                          label="Zvuk kartičky (generuje sa z textu)"
                          defaultText={card.name}
                          currentPath={card.reference_audio}
                          onChange={(path) =>
                            updateCard(
                              levelIndex,
                              cardIndex,
                              "reference_audio",
                              path,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FindAndRepeatConfig;
