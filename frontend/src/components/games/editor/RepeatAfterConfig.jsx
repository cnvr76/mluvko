import React from "react";
import TTSField from "./TTSField";

const RepeatAfterConfig = ({ configData, onChange }) => {
  // Защита от пустого объекта конфигурации
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
      <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl">
        <div>
          <h3 className="text-xl font-bold">Nastavenia Repeat After</h3>
          <p className="text-sm text-gray-500">Logopéd povie, dieťa zopakuje</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold">Limit skóre (%):</label>
          <input
            type="number"
            className="w-20 border-2 border-blue-200 p-2 rounded-lg text-center font-bold"
            value={threshold}
            onChange={(e) =>
              onChange({
                ...configData,
                score_threshold: parseInt(e.target.value),
              })
            }
          />
          <button
            onClick={addCard}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold"
          >
            + Pridať kartu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="relative p-6 border-2 border-gray-100 rounded-2xl bg-white shadow-md grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <button
              onClick={() => removeCard(index)}
              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 font-bold"
            >
              ✕ Odstrániť
            </button>

            {/* Левая колонка: Основные данные */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center">
                  #{card.card_id}
                </span>
                <input
                  className="flex-1 border-b-2 focus:border-blue-500 outline-none p-1 font-bold text-lg"
                  placeholder="Názov zvieratka"
                  value={card.animal_name}
                  onChange={(e) =>
                    updateCard(index, "animal_name", e.target.value)
                  }
                />
              </div>

              <input
                className="border p-2 rounded-lg text-sm bg-gray-50"
                placeholder="URL obrázku (/images/repeat_after/...)"
                value={card.animal_image_url}
                onChange={(e) =>
                  updateCard(index, "animal_image_url", e.target.value)
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    Text na displeji
                  </span>
                  <input
                    className="border p-2 rounded-lg"
                    placeholder="MÚ-MÚ"
                    value={card.display_text}
                    onChange={(e) =>
                      updateCard(index, "display_text", e.target.value)
                    }
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    Referenčný text (pre AI)
                  </span>
                  <input
                    className="border p-2 rounded-lg"
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
              <TTSField
                label="Referenčná nahrávka (generuje sa z textu)"
                currentPath={card.reference_audio}
                onAudioGenerated={(path) =>
                  updateCard(index, "reference_audio", path)
                }
              />
              <p className="text-[10px] text-gray-400 mt-2 text-center">
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
