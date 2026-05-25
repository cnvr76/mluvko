import React from "react";
import TTSField from "./TTSField";
import ImageField from "./ImageField";

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
      <div
        className="
        flex justify-between items-center
        bg-white/40
        backdrop-blur-md
        p-4
        rounded-2xl
        border border-white/40"
      >
        <div>
          <h3 className="text-xl font-bold">Nastavenia Repeat After</h3>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold">Limit skóre (%):</label>
          <input
            type="number"
            className="
            w-15
  border
  border-[#ff7110]
  bg-white/70
  p-2
  rounded-xl
  text-center
  font-bold
  text-[#642f37]
  outline-none"
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
            className="
            px-5 py-2.5
            rounded-xl
            bg-[#ff7110]
            hover:bg-[#e9650c]
            text-white
            font-bold
            transition-all duration-200
            "
          >
            + Pridať kartu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="
            relative
            p-4
            rounded-2xl
            bg-white/75
            backdrop-blur-md
            border border-white/40
            shadow-[0_4px_20px_rgba(0,0,0,0.08)]
            grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <button
              onClick={() => removeCard(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs"
            >
              ✕
            </button>

            {/* Левая колонка: Основные данные */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <span
                  className="  bg-[#ff7110]
                text-white
                  px-3 py-1
                  rounded-full
                  text-xs
                  flex items-center
                  font-bold"
                >
                  #{card.card_id}
                </span>
                <input
                  className="  flex-1 border-b-2 border-[#642f37] focus:border-[#ff7110] outline-none p-1 font-bold  text-lg  text-[#642f37]"
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
