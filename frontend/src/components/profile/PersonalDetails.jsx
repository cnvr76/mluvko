import React from "react";
import { Roles, RoleLabels } from "../../services/api";
import RoleRequestPanel from "./RoleRequestPanel";
import usePersonalDetails from "../../hooks/profile/usePersonalDetails";
import PanelHeader from "./PanelHeader";

const PersonalDetails = ({ data }) => {
  const { name, setName, status, setStatus, isDirty, saving, handleSave } =
    usePersonalDetails(data);

  return (
    <div className="flex flex-col gap-6">
      <PanelHeader title="Môj profil" />

      <div
        className="
          surface-glass rounded-card
          p-6
          flex flex-col gap-5
        "
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <div className="flex flex-col gap-2">
            <p className="text-fluid-sm font-semibold opacity-70">Meno</p>
            <input
              type="text"
              placeholder="Vaše meno"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setStatus(null);
              }}
              className="field rounded-full"
            />
          </div>

          <div>
            <p className="text-fluid-sm font-semibold opacity-70">Email</p>
            <p className="text-fluid-xl font-bold">{data.email}</p>
          </div>
        </div>

        <div className="h-px bg-white/40" />

        <div>
          <p className="text-fluid-sm font-semibold opacity-70">Pozícia</p>
          <p className="text-fluid-xl font-bold">
            {RoleLabels[data.role] ?? "Rodič"}
          </p>
        </div>

        {status && (
          <p
            className={`text-fluid-sm font-semibold ${
              status.type === "success" ? "text-success" : "text-danger"
            }`}
          >
            {status.text}
          </p>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || saving}
          className="
            btn-pill surface-glass bg-white/40 border-white/50 shadow-control
            self-start mt-2
            text-fluid-lg text-text
            hover:bg-white/50 hover:text-accent
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
          "
        >
          {saving ? "Ukladám..." : "Uložiť zmeny"}
        </button>
      </div>

      {data.role === Roles.PARENT && <RoleRequestPanel />}
    </div>
  );
};

export default PersonalDetails;
