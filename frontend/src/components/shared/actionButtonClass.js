const TONE_CLASS = {
  success: "bg-success hover:bg-success-hover text-white",
  danger: "bg-danger-bg hover:bg-danger-bg-hover text-danger",
  accent: "bg-accent hover:bg-accent-hover text-white",
  accentSoft: "bg-accent-soft hover:bg-accent-soft-hover text-white",
  blue: "bg-blue hover:bg-blue-hover text-white",
  lavender: "bg-lavender hover:bg-lavender-hover text-white",
  yellow: "bg-yellow hover:bg-yellow-hover text-white",
};

export const actionButtonClass = (tone = "success") =>
  [
    "inline-grid place-items-center shrink-0",
    "size-9 rounded-full no-underline cursor-pointer",
    "shadow-control transition-all duration-200",
    "hover:scale-105 active:scale-95",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    TONE_CLASS[tone] ?? TONE_CLASS.success,
  ].join(" ");
