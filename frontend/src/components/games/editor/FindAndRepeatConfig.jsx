import React from "react";
import TTSField from "./TTSField";
import ImageField from "./ImageField";
import { FIND_PROMPT_TEXT, CONFIRM_PROMPT_TEXT } from "../find_and_repeat/prompts";

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
      <div className="flex justify-between items-center bg-white/40 rounded-2xl border border-white/40 px-4 py-3">
        <h3 className="text-xl font-bold">Nastavenia Nájdi a zopakuj</h3>

        <button
          onClick={addLevel}
          className="px-5 py-2.5 rounded-xl bg-[#ff7110] hover:bg-[#e9650c] text-white font-bold transition-all duration-200"
        >
          + Pridať úroveň
        </button>
      </div>

      {/* Spoločné hlasy hry (generujú sa raz, používajú sa vo všetkých úrovniach) */}
      <div className="rounded-2xl bg-white/60 border border-white/40 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <TTSField
            label="Úvodná výzva (zaznie iba na prvej etape)"
            defaultText={FIND_PROMPT_TEXT}
            currentPath={configData.find_prompt_audio}
            onAudioGenerated={(path) => update({ find_prompt_audio: path })}
          />
          <p className="text-[10px] text-gray-400 mt-1">
            Napr. „{FIND_PROMPT_TEXT}“.
          </p>
        </div>

        <div>
          <TTSField
            label="Otázka po nahrávke"
            defaultText={CONFIRM_PROMPT_TEXT}
            currentPath={configData.confirm_prompt_audio}
            onAudioGenerated={(path) => update({ confirm_prompt_audio: path })}
          />
          <p className="text-[10px] text-gray-400 mt-1">
            Napr. „{CONFIRM_PROMPT_TEXT}“. Zaznie po prehratí nahrávky dieťaťa.
          </p>
        </div>
      </div>

      {levels.length === 0 && (
        <div className="text-center py-10 text-[#642f37]/60 bg-white/40 rounded-2xl border border-white/40">
          <p className="font-bold">Zatiaľ žiadne úrovne</p>
          <p className="text-sm">Pridajte úroveň a do nej kartičky.</p>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {levels.map((level, levelIndex) => {
          const cards = level.cards || [];

          return (
            <div
              key={level.level_id}
              className="rounded-2xl bg-white/40 border border-white/50 p-3 flex flex-col gap-3"
            >
              {/* sticky header so the controls stay reachable in long levels */}
              <div className="sticky top-24 z-10 flex flex-wrap justify-between items-center gap-2 bg-white/85 backdrop-blur-md rounded-xl px-3 py-2 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="bg-[#642f37] text-white px-4 py-1.5 rounded-full text-sm font-bold">
                    Úroveň {levelIndex + 1}
                  </span>

                  <label className="flex items-center gap-1.5 text-sm font-semibold text-[#642f37]/80">
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
                      className="w-16 border border-[#642f37]/30 bg-white rounded-lg px-2 py-1 text-center text-[#642f37] outline-none focus:border-[#ff7110]"
                      title="Koľko etáp z tejto úrovne hrať (prázdne = všetky kartičky)"
                    />
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => addCard(levelIndex)}
                    className="px-4 py-2 rounded-xl bg-[#ff7110] hover:bg-[#e9650c] text-white text-sm font-bold transition-all duration-200"
                  >
                    + Pridať kartu
                  </button>
                  <button
                    onClick={() => removeLevel(levelIndex)}
                    className="px-4 py-2 rounded-xl bg-[#ffe5e5] hover:bg-[#ffd6d6] text-[#d62828] text-sm font-bold transition-all duration-200"
                  >
                    Vymazať úroveň
                  </button>
                </div>
              </div>

              {cards.length === 0 ? (
                <p className="text-sm text-[#642f37]/60 italic px-1">
                  Pridajte kartičky do tejto úrovne.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {cards.map((card, cardIndex) => (
                    <div
                      key={card.card_id}
                      className="relative rounded-xl bg-white/70 border border-white/50 p-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <button
                        onClick={() => removeCard(levelIndex, cardIndex)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs"
                      >
                        ✕
                      </button>

                      {/* Ľavý stĺpec: text a obrázok */}
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                          <span className="bg-[#ff7110] text-white px-3 py-1 rounded-full text-xs flex items-center font-bold">
                            #{card.card_id}
                          </span>
                          <input
                            className="flex-1 border-b-2 border-[#642f37] focus:border-[#ff7110] outline-none p-1 font-bold text-lg text-[#642f37]"
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
                            updateCard(levelIndex, cardIndex, "image_url", value)
                          }
                        />
                      </div>

                      {/* Pravý stĺpec: audio */}
                      <div className="flex flex-col justify-center">
                        <TTSField
                          label="Zvuk kartičky (generuje sa z textu)"
                          defaultText={card.name}
                          currentPath={card.reference_audio}
                          onAudioGenerated={(path) =>
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
