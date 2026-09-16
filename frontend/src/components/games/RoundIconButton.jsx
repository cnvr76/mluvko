import React from "react";

const TONE_CLASS = {
  glass: "surface-glass",
  recording: "bg-danger-bg-hover border border-danger-bg-hover animate-pulse",
  success: "bg-success border border-success text-white",
};

const RoundIconButton = ({
  icon,
  label,
  onClick,
  disabled = false,
  tone = "glass",
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className={`btn-round shadow-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${TONE_CLASS[tone] ?? TONE_CLASS.glass}`}
  >
    {children ?? (
      <img src={icon} alt="" className="w-3/5 h-3/5 object-contain" />
    )}
  </button>
);

export default RoundIconButton;
