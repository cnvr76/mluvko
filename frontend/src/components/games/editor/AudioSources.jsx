import React from "react";
import TTSField from "./TTSField";
import UploadAudioField from "./UploadAudioField";
import RecordAudioField from "./RecordAudioField";

/**
 * Trojica zdrojov pre jeden zvuk v editore hry:
 *   1) generovanie cez TTS (TTSField, posiela na server pri stlačení Generovať),
 *   2) nahranie vlastného súboru (UploadAudioField),
 *   3) záznam priamo z mikrofónu (RecordAudioField).
 *
 * Všetky tri zdieľajú jednu hodnotu v `config_data` cez `onChange`. Upload /
 * Record nepúšťajú nič na server hneď – súbor sa odloží ako PendingFile a
 * skutočne sa nahrá až pri „Uložiť zmeny" v GameEditPage.
 */
const AudioSources = ({ label, currentPath, onChange, defaultText = "" }) => {
  return (
    <div className="flex flex-col gap-2">
      <TTSField
        label={label}
        currentPath={currentPath}
        onAudioGenerated={onChange}
        defaultText={defaultText}
      />

      <div className="flex flex-wrap items-center gap-2 pl-1">
        <span className="text-[10px] uppercase font-semibold text-gray-400">
          alebo:
        </span>
        <UploadAudioField onAudioChange={onChange} />
        <RecordAudioField onAudioChange={onChange} />
      </div>
    </div>
  );
};

export default AudioSources;
