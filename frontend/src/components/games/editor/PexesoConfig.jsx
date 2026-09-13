import React from "react";
import AudioSources from "./AudioSources";
import ImageField from "./ImageField";

const PexesoConfig = ({ configData, onChange }) => {
  const cards = configData.cards || [];

  const updateCard = (index, field, value) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    onChange({ ...configData, cards: newCards });
  };

  const addCard = () => {
    const newId =
      cards.length > 0 ? Math.max(...cards.map((c) => c.id)) + 1 : 1;

    const newCard = {
      id: newId,
      animal_name: "",
      animal_audio: "",
      animal_image_url: "",
    };

    onChange({ ...configData, cards: [...cards, newCard] });
  };

  const removeCard = (index) => {
    const newCards = cards.filter((_, i) => i !== index);
    onChange({ ...configData, cards: newCards });
  };

  const inputClassName = `
    border
    border-text
    bg-white/70
    p-3
    rounded-xl
    text-text
    outline-none
    placeholder:text-text/40
    focus:border-accent
  `;

  return (
    <div className="flex flex-col gap-6">
      <div
        className="
          flex justify-between items-center
          bg-white/40
          backdrop-blur-md
          p-4
          rounded-2xl
          border border-white/40
        "
      >
        <h3 className="text-xl font-bold text-text">
          Kartičky Pexesa
        </h3>

        <button
          onClick={addCard}
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
          + Pridať dvojicu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              shadow-field
              flex flex-col gap-3
            "
          >
           <button
              onClick={() => removeCard(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs"
            >
              ✕
            </button>

            <div className="flex gap-3">
              <input
                className={`flex-1 font-medium ${inputClassName}`}
                placeholder="Názov zvieratka"
                value={card.animal_name}
                onChange={(e) =>
                  updateCard(index, "animal_name", e.target.value)
                }
              />

              <input
                className="
                  w-16
                  border border-text/30
                  bg-white/70
                  p-3
                  rounded-xl
                  text-center
                  text-gray-400
                  font-semibold
                "
                value={card.id}
                disabled
              />
            </div>

            <ImageField
              placeholder="URL obrázku (/images/pexeso/...)"
              value={card.animal_image_url}
              onChange={(value) =>
                updateCard(index, "animal_image_url", value)
              }
              inputClassName={inputClassName}
            />

            <AudioSources
              label="Hlas zvieratka (audio)"
              currentPath={card.animal_audio}
              onChange={(path) => updateCard(index, "animal_audio", path)}
              defaultText={card.animal_name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PexesoConfig;