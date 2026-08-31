import React, { useState } from "react";
import { api } from "../../../services/api";
import { deleteServerFile } from "../../../utils/mediaPaths";
import { previewUrl } from "../../../utils/pendingMedia";

const TTSField = ({
  label,
  currentPath,
  onAudioGenerated,
  defaultText = "",
}) => {
  const [text, setText] = useState(defaultText);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setLoading(true);
    const previousPath = currentPath;
    try {
      const path = await api.speech.generateTTS(trimmed);
      onAudioGenerated(path);

      if (
        typeof previousPath === "string" &&
        previousPath &&
        previousPath !== path
      ) {
        deleteServerFile(previousPath);
      }
    } catch (e) {
      alert("Chyba pri generovaní zvuku");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    const previousPath = currentPath;
    onAudioGenerated("");
    if (typeof previousPath === "string" && previousPath) {
      deleteServerFile(previousPath);
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
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="
            px-3 py-1.5
            rounded-xl
            bg-[#ff7110]
            hover:bg-[#e9650c]
            text-white
            transition-all duration-200
            disabled:opacity-50
            font-bold
          "
        >
          {loading ? "..." : "Generovať"}
        </button>
      </div>

      {currentPath && (
        <div className="flex items-center gap-2 mt-1">
          <audio
            src={previewUrl(currentPath)}
            controls
            className="h-8 w-full"
          />
          <button
            type="button"
            onClick={handleClear}
            title="Vymazať nahrávku"
            className="
              shrink-0
              px-3 py-2
              rounded-lg
              bg-[#ffe5e5]
              hover:bg-[#ffd6d6]
              text-[#d62828]
              text-xs
              font-semibold
              transition-all duration-200
              aspect-square
            "
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default TTSField;
