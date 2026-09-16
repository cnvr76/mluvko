import React from "react";

const FilterChips = ({ options, value, onChange, label }) => (
  <div
    role="group"
    aria-label={label}
    className="flex gap-1 bg-white/30 p-1 rounded-full overflow-x-auto max-w-full"
  >
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        aria-pressed={value === option.value}
        className={`shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full text-fluid-sm font-semibold cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          value === option.value
            ? "bg-accent-soft text-white"
            : "text-text/60 hover:text-accent hover:bg-white/60"
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export default FilterChips;
