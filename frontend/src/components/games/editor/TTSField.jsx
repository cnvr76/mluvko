import React, { useState } from "react";
import { api } from "../../../services/api";
import { deleteServerFile } from "../../../utils/mediaPaths";
import { previewUrl } from "../../../utils/pendingMedia";
import useApiMutation from "../../../hooks/useApiMutation";
import { actionButtonClass } from "../../shared/actionButtonClass";

const generateAndSwapAudio = async (
  trimmedText,
  previousPath,
  onAudioGenerated,
) => {
  const path = await api.speech.generateTTS(trimmedText);
  onAudioGenerated(path);

  if (
    typeof previousPath === "string" &&
    previousPath &&
    previousPath !== path
  ) {
    deleteServerFile(previousPath);
  }
};

const TTSField = ({
  label,
  currentPath,
  onAudioGenerated,
  defaultText = "",
}) => {
  const [text, setText] = useState(defaultText);

  const generateMutation = useApiMutation(
    ({ trimmedText, previousPath }) =>
      generateAndSwapAudio(trimmedText, previousPath, onAudioGenerated),
    { errorMessage: "Chyba pri generovaní zvuku" },
  );
  const isLoading = generateMutation.isPending;

  const handleGenerate = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    generateMutation.mutate({
      trimmedText: trimmed,
      previousPath: currentPath,
    });
  };

  const handleClear = () => {
    const previousPath = currentPath;
    onAudioGenerated("");
    if (typeof previousPath === "string" && previousPath) {
      deleteServerFile(previousPath);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl bg-white/50 border border-white/60">
      <span className="text-fluid-sm font-semibold text-text/70">{label}</span>
      <div className="flex flex-wrap gap-2">
        <input
          className="field rounded-xl text-fluid-sm flex-1 min-w-40 py-2"
          placeholder="Text pre generovanie..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          aria-label="Generovať zvuk"
          title="Generovať zvuk"
          className={actionButtonClass("accent")}
        >
          <i
            className={`fa-solid ${isLoading ? "fa-spinner fa-spin" : "fa-wand-magic-sparkles"} fa-fw`}
            aria-hidden="true"
          />
        </button>
      </div>

      {currentPath && (
        <div className="flex items-center gap-2 mt-1">
          <audio
            src={previewUrl(currentPath)}
            controls
            className="h-9 w-full min-w-0"
          />
          <button
            type="button"
            onClick={handleClear}
            title="Vymazať nahrávku"
            aria-label="Vymazať nahrávku"
            className={actionButtonClass("danger")}
          >
            <i className="fa-solid fa-trash fa-fw" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TTSField;
