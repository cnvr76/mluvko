import React from "react";
import { actionButtonClass } from "./actionButtonClass";

const ActionButton = ({ icon, label, tone, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className={actionButtonClass(tone)}
  >
    <i className={`fa-solid ${icon} fa-fw`} aria-hidden="true" />
  </button>
);

export default ActionButton;
