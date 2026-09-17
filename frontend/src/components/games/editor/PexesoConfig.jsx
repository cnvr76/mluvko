import React from "react";
import AudioSources from "./AudioSources";
import ImageField from "./ImageField";
import ActionButton from "../../shared/ActionButton";

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

  const inputClassName = "field rounded-xl";

  return (
    <div className="flex flex-col gap-6">
      <div
        className="
          flex flex-wrap gap-3 justify-between items-center
          surface-glass bg-white/40 rounded-card p-4
        "
      >
        <h3 className="text-fluid-lg font-bold text-text">Kartičky Pexesa</h3>

        <button
          onClick={addCard}
          className="btn-pill bg-accent hover:bg-accent-hover text-white text-fluid-sm font-bold shadow-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <i className="fa-solid fa-plus fa-fw" aria-hidden="true" />
          Pridať dvojicu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="
              relative
              surface-glass bg-white/60 rounded-card p-4
              flex flex-col gap-3
            "
          >
            <div className="absolute -top-3 -right-3 z-10">
              <ActionButton
                icon="fa-xmark"
                label="Odstrániť dvojicu"
                tone="danger"
                onClick={() => removeCard(index)}
              />
            </div>

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
                className="field rounded-xl w-16 text-center text-text/50 font-semibold"
                value={card.id}
                disabled
              />
            </div>

            <ImageField
              placeholder="URL obrázku (/images/pexeso/...)"
              value={card.animal_image_url}
              onChange={(value) => updateCard(index, "animal_image_url", value)}
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
