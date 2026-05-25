import React from "react";

// Reusable image-URL input with a live preview, shared by all game editors.
const DEFAULT_INPUT_CLASS = `
  border border-[#642f37]/30
  bg-white/70
  rounded-lg
  px-3 py-2
  text-sm
  text-[#642f37]
  outline-none
  focus:border-[#ff7110]
  placeholder:text-[#642f37]/40
`;

const ImageField = ({
  label = "Obrázok",
  placeholder = "URL obrázku",
  value,
  onChange,
  inputClassName = DEFAULT_INPUT_CLASS,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        className={inputClassName}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />

      {value && (
        <img
          src={value}
          alt={label}
          className="h-24 w-auto object-contain self-start rounded-lg drop-shadow"
        />
      )}
    </div>
  );
};

export default ImageField;
