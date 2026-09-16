import React, { useRef } from "react";
import {
  isPendingFile,
  makePending,
  PENDING_IMAGE,
  previewUrl,
} from "../../../utils/pendingMedia";
import { actionButtonClass } from "../../shared/actionButtonClass";

// Reusable image input with a live preview, shared by all game editors.
// Supports two sources:
//   1) external/public URL (typed by hand into the text input),
//   2) file upload from the user's computer — odložené ako PendingFile,
//      skutočný upload prebehne až pri „Uložiť zmeny" v GameEditPage.
const DEFAULT_INPUT_CLASS = "field rounded-xl text-fluid-sm";

const ImageField = ({
  label = "Obrázok",
  placeholder = "URL obrázku",
  value,
  onChange,
  inputClassName = DEFAULT_INPUT_CLASS,
}) => {
  const inputRef = useRef(null);
  const pending = isPendingFile(value);

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    onChange(makePending(file, PENDING_IMAGE));
  };

  const handleClear = () => onChange("");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {/* URL pole je vždy editovateľné – ak je vybraný lokálny súbor,
            ako placeholder ukážeme jeho názov, ale akýkoľvek užívateľský
            vstup PendingFile prepíše (čím sa stane bežnou URL hodnotou). */}
        <input
          className={`${inputClassName} flex-1`}
          placeholder={
            pending ? `Vybraný súbor: ${value.file.name}` : placeholder
          }
          value={pending ? "" : value || ""}
          onChange={(e) => onChange(e.target.value)}
        />

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp"
          onChange={handleUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          title="Nahrať obrázok z počítača"
          aria-label="Nahrať obrázok z počítača"
          className={actionButtonClass("blue")}
        >
          <i className="fa-solid fa-folder-open fa-fw" aria-hidden="true" />
        </button>

        {value && (
          <button
            type="button"
            onClick={handleClear}
            title="Vymazať obrázok"
            aria-label="Vymazať obrázok"
            className={actionButtonClass("danger")}
          >
            <i className="fa-solid fa-trash fa-fw" aria-hidden="true" />
          </button>
        )}
      </div>

      {value && (
        <div className="flex items-start gap-2">
          <img
            src={previewUrl(value)}
            alt={label}
            className="h-24 w-auto object-contain rounded-xl drop-shadow"
          />
        </div>
      )}
    </div>
  );
};

export default ImageField;
