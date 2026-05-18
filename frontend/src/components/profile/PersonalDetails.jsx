import React, { useState } from "react";

const PersonalDetails = ({ data }) => {
  const [newName, setNewName] = useState("");

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
          <div>
            <p className="text-sm font-semibold opacity-70">Meno</p>
            <p className="text-2xl font-bold">{data.username}</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold opacity-70">Zmeniť meno</p>
            <input
              type="text"
              placeholder="Nové meno"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="h-px bg-white/40" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="text-sm font-semibold opacity-70">Email</p>
            <p className="text-xl font-bold">{data.email}</p>
          </div>

          <div>
            <p className="text-sm font-semibold opacity-70">Pozícia</p>
            <p className="text-xl font-bold">
              {data.role === "admin"
                ? "Admin"
                : data.role === "therapist"
                  ? "Logopéd"
                  : "Rodič"}
            </p>
          </div>
        </div>

        <button
          type="button"
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
          "
        >
          Uložiť zmeny
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;
