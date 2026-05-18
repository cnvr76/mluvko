import React, { useState } from "react";
import { api } from "../../../services/api";

const VITE_API_BASE = import.meta.env.VITE_API_BASE;

const TTSField = ({ label, currentPath, onAudioGenerated }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const path = await api.generateTTS(text);
      onAudioGenerated(path);
    } catch (e) {
      alert("Chyba pri generovaní zvuku");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2 bg-gray-50 rounded border">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <div className="flex gap-2">
        <input
          className="flex-1 border p-1 text-sm rounded"
          placeholder="Text pre generovanie..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="
            px-3 py-1.5
            rounded-xl
            bg-[#ff7110]
            hover:bg-[#e9650c]
            text-white
            transition-all duration-200
          "
        >
          {loading ? "..." : "Generovať"}
        </button>
      </div>
      {currentPath && (
        <div className="flex items-center gap-2 mt-1">
          <audio
            src={`${VITE_API_BASE}/${currentPath}`}
            controls
            className="h-8 w-full"
          />
        </div>
      )}
    </div>
  );
};

export default TTSField;
