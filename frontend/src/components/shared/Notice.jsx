import React from "react";

const TONE_CLASS = {
  danger: "bg-danger-bg border-danger/30 text-danger",
  success: "bg-success/20 border-success/40 text-text",
  info: "bg-blue/25 border-blue/60 text-text",
};

const TONE_ICON = {
  danger: "fa-circle-exclamation",
  success: "fa-circle-check",
  info: "fa-circle-info",
};

const Notice = ({ tone = "info", title, children }) => (
  <div
    className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-fluid-sm ${
      TONE_CLASS[tone] ?? TONE_CLASS.info
    }`}
  >
    <i
      className={`fa-solid ${TONE_ICON[tone] ?? TONE_ICON.info} fa-fw mt-0.5 shrink-0`}
      aria-hidden="true"
    />

    <p className="min-w-0">
      {title && <strong className="font-bold">{title}: </strong>}
      {children}
    </p>
  </div>
);

export default Notice;
