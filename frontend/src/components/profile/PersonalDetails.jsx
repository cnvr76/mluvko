import React, { useState } from "react";
import { api, Roles, RoleLabels } from "../../services/api";
import RoleRequestPanel from "./RoleRequestPanel";

const PersonalDetails = ({ data }) => {
  const [savedName, setSavedName] = useState(data.username || "");
  const [name, setName] = useState(data.username || "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const inputClassName = `
    w-full
    rounded-full
    bg-white/50
    border border-white/60
    px-5 py-3
    text-[#642f37]
    placeholder:text-[#642f37]/60
    outline-none
    shadow-[0_4px_15px_rgba(0,0,0,0.08)]
    focus:bg-white/70
  `;

  const trimmedName = name.trim();
  const isDirty = trimmedName.length > 0 && trimmedName !== savedName;

  const handleSave = async () => {
    if (!isDirty) return;
    setSaving(true);
    setStatus(null);
    try {
      const updated = await api.updateMyProfile({ username: trimmedName });
      const newName = updated?.username ?? trimmedName;
      setSavedName(newName);
      setName(newName);
      localStorage.setItem("username", newName);
      setStatus({ type: "success", text: "Meno bolo uložené." });
    } catch (e) {
      setStatus({ type: "error", text: "Nepodarilo sa uložiť meno." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-extrabold drop-shadow">Môj profil</h2>

      <div
        className="
          rounded-[2rem]
          bg-white/30
          backdrop-blur-xl
          border border-white/40
          shadow-[0_4px_20px_rgba(0,0,0,0.12)]
          p-6
          flex flex-col gap-5
        "
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold opacity-70">Meno</p>
            <input
              type="text"
              placeholder="Vaše meno"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setStatus(null);
              }}
              className={inputClassName}
            />
          </div>

          <div>
            <p className="text-sm font-semibold opacity-70">Email</p>
            <p className="text-xl font-bold">{data.email}</p>
          </div>
        </div>

        <div className="h-px bg-white/40" />

        <div>
          <p className="text-sm font-semibold opacity-70">Pozícia</p>
          <p className="text-xl font-bold">{RoleLabels[data.role] ?? "Rodič"}</p>
        </div>

        {status && (
          <p
            className={`text-sm font-semibold ${
              status.type === "success" ? "text-green-600" : "text-red-600"
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
            self-start
            mt-2
            px-8 py-3
            rounded-full
            bg-white/40
            backdrop-blur-xl
            border border-white/50
            shadow-[0_4px_20px_rgba(0,0,0,0.15)]
            font-semibold text-lg
            text-[#642f37]
            transition-all duration-200
            hover:scale-105
            active:scale-95
            hover:bg-white/50
            hover:text-[#ff7110]
            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:hover:scale-100
            disabled:hover:bg-white/40
            disabled:hover:text-[#642f37]
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
