import React from "react";

const PanelHeader = ({ title, children }) => (
  <header className="flex flex-col gap-3 min-h-13 lg:flex-row lg:items-center lg:justify-between">
    <h2 className="text-fluid-2xl font-extrabold drop-shadow">{title}</h2>

    {children && (
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    )}
  </header>
);

export default PanelHeader;
