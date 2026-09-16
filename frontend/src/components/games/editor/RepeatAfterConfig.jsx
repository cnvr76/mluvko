import React from "react";
import AudioSources from "./AudioSources";
import ImageField from "./ImageField";
import ActionButton from "../../shared/ActionButton";

const RepeatAfterConfig = ({ configData, onChange }) => {
  const cards = configData.cards || [];
  const threshold = configData.score_threshold || 70;

  const updateCard = (index, field, value) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    onChange({ ...configData, cards: newCards });
  };

  const addCard = () => {
    const newId =
      cards.length > 0 ? Math.max(...cards.map((c) => c.card_id)) + 1 : 1;
    const newCard = {
      card_id: newId,
      animal_name: "",
      display_text: "",
      reference_text: "",
      reference_audio: "",
      animal_image_url: "",
    };
    onChange({ ...configData, cards: [...cards, newCard] });
  };

  const removeCard = (index) => {
    onChange({ ...configData, cards: cards.filter((_, i) => i !== index) });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3 justify-between items-center surface-glass bg-white/40 rounded-card p-4">
        <h3 className="text-fluid-lg font-bold">Nastavenia Repeat After</h3>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-fluid-sm font-bold">
            Limit skóre (%):
            <input
              type="number"
              className="field rounded-xl w-20 py-2 text-center font-bold"
              value={threshold}
              onChange={(e) =>
                onChange({
                  ...configData,
                  score_threshold: parseInt(e.target.value),
                })
              }
            />
          </label>

          <button
            onClick={addCard}
            className="btn-pill bg-accent hover:bg-accent-hover text-white text-fluid-sm font-bold shadow-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <i className="fa-solid fa-plus fa-fw" aria-hidden="true" />
            Pridať kartu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="
            relative
            surface-glass bg-white/60 rounded-card p-4
            grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <div className="absolute -top-3 -right-3 z-10">
              <ActionButton
                icon="fa-xmark"
                label="Odstrániť kartu"
                tone="danger"
                onClick={() => removeCard(index)}
              />
            </div>

            {/* Левая колонка: Основные данные */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <span className="bg-accent text-white px-3 py-1 rounded-full text-fluid-sm flex items-center font-bold shrink-0">
                  #{card.card_id}
                </span>
                <input
                  className="flex-1 min-w-0 bg-transparent border-b-2 border-text focus:border-accent outline-none p-1 font-bold text-fluid-lg text-text"
                  placeholder="Názov zvieratka"
                  value={card.animal_name}
                  onChange={(e) =>
                    updateCard(index, "animal_name", e.target.value)
                  }
                />
              </div>

              <ImageField
                placeholder="URL obrázku (/images/repeat_after/...)"
                value={card.animal_image_url}
                onChange={(value) =>
                  updateCard(index, "animal_image_url", value)
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-fluid-sm font-bold text-text/50 uppercase">
                    Text na displeji
                  </span>
                  <input
                    className="field rounded-xl py-2 text-fluid-sm"
                    placeholder="MÚ-MÚ"
                    value={card.display_text}
                    onChange={(e) =>
                      updateCard(index, "display_text", e.target.value)
                    }
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-fluid-sm font-bold text-text/50 uppercase">
                    Referenčný text (pre AI)
                  </span>
                  <input
                    className="field rounded-xl py-2 text-fluid-sm"
                    placeholder="mo mo"
                    value={card.reference_text}
                    onChange={(e) =>
                      updateCard(index, "reference_text", e.target.value)
                    }
                  />
                </label>
              </div>
            </div>

            {/* Правая колонка: Аудио */}
            <div className="flex flex-col justify-center">
              <AudioSources
                label="Referenčná nahrávka (generuje sa z textu)"
                currentPath={card.reference_audio}
                onChange={(path) => updateCard(index, "reference_audio", path)}
                defaultText={card.reference_text}
              />
              <p className="text-fluid-sm text-text/50 mt-2 text-center">
                Tip: Do poľa generovania zadajte text, ktorý má AI očakávať
                (napr. "mo mo")
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepeatAfterConfig;
