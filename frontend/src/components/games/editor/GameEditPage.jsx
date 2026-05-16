import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { api, GameTypes, AgeGroups } from "../../../services/api";
import PageLoading from "../../loading/PageLoading";
import PexesoConfig from "./PexesoConfig";
import RepeatAfterConfig from "./RepeatAfterConfig";

const CONFIG_COMPONENTS = {
  [GameTypes.PEXESO]: PexesoConfig,
  [GameTypes.REPEAT_AFTER]: RepeatAfterConfig,
};

const GameEditPage = () => {
  const { gameId } = useParams();
  const [searchParams] = useSearchParams();
  const snapshotId = searchParams.get("snapshot");

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Если есть snapshotId, берем конкретную версию, иначе - просто игру
        const data = snapshotId
          ? await api.getSnapshotInfo(gameId, snapshotId)
          : await api.getGameById(gameId);
        setFormData(data);

        console.log(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [gameId, snapshotId]);

  const handleBaseChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await api.saveGame(gameId, formData);
      alert("Hra bola úspešne uložená!");
    } catch (e) {
      alert("Chyba pri ukladaní.");
    }
  };

  if (loading) return <PageLoading />;

  const SpecificConfig = CONFIG_COMPONENTS[formData.game_type];

  return (
    <div className="p-8 pt-24 max-w-4xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Editácia hry: {formData.name}</h1>

      {/* БАЗОВЫЕ ПОЛЯ */}
      <div className="grid grid-cols-1 gap-4 bg-white p-6 rounded-lg shadow">
        <label className="flex flex-col">
          Názov hry:
          <input
            className="border p-2 rounded"
            value={formData.name}
            onChange={(e) => handleBaseChange("name", e.target.value)}
          />
        </label>

        <label className="flex flex-col">
          Veková skupina:
          <select
            className="border p-2 rounded"
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

        <label className="flex flex-col">
          Typ hry:
          <select
            className="border p-2 rounded"
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
      </div>

      {/* СПЕЦИФИЧНЫЕ ПОЛЯ (через Switch/Registry) */}
      <div className="bg-white p-6 rounded-lg shadow">
        {SpecificConfig ? (
          <SpecificConfig
            configData={formData.config_data}
            onChange={(newConfig) => handleBaseChange("config_data", newConfig)}
          />
        ) : (
          <p className="text-red-500">
            Editor pre tento typ hry ešte nebol vytvorený.
          </p>
        )}
      </div>

      <button
        onClick={handleSave}
        className="bg-green-600 text-white p-4 rounded-lg font-bold hover:bg-green-700 transition"
      >
        Uložiť zmeny
      </button>
    </div>
  );
};

export default GameEditPage;
