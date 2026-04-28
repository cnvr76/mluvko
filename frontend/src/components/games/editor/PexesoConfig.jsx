import React from "react";
import TTSField from "./TTSField";

const PexesoConfig = ({ configData, onChange }) => {
  // Защита от пустого объекта конфигурации
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Kartičky Pexesa</h3>
        <button
          onClick={addCard}
          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold"
        >
          + Pridať dvojicu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="relative p-4 border-2 border-blue-100 rounded-xl bg-white shadow-sm flex flex-col gap-3"
          >
            <button
              onClick={() => removeCard(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs"
            >
              ✕
            </button>

            <div className="flex gap-2">
              <input
                className="flex-1 border p-2 rounded font-medium"
                placeholder="Názov zvieratka (napr. krava)"
                value={card.animal_name}
                onChange={(e) =>
                  updateCard(index, "animal_name", e.target.value)
                }
              />
              <input
                className="w-12 border p-2 rounded text-center text-gray-400"
                value={card.id}
                disabled
              />
            </div>

            <input
              className="border p-2 rounded text-sm bg-gray-50"
              placeholder="URL obrázku (/images/pexeso/...)"
              value={card.animal_image_url}
              onChange={(e) =>
                updateCard(index, "animal_image_url", e.target.value)
              }
            />

            <TTSField
              label="Hlas zvieratka (audio)"
              currentPath={card.animal_audio}
              onAudioGenerated={(path) =>
                updateCard(index, "animal_audio", path)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PexesoConfig;
