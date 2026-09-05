import React, { useState } from "react";
import { api, Roles, RoleLabels } from "../../services/api";
import useUserManagement from "../../hooks/profile/useUserManagement";

const UserManagement = ({ currentUserId }) => {
  const [search, setSearch] = useState("");
  const { users, isLoading, edits, updateEdit, isDirty, handleAction } =
    useUserManagement();

  const query = search.trim().toLowerCase();
  const filteredUsers = !query
    ? users
    : users.filter(
        (user) =>
          user.username?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query),
      );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-extrabold drop-shadow">Používatelia</h2>

        <div
          className="
            rounded-[2rem]
            bg-white/30
            backdrop-blur-xl
            border border-white/40
            p-10
            text-center
            text-[#642f37]
            font-semibold
          "
        >
          Načítavam používateľov...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm md:flex-row md:justify-between md:items-center">
        <h2 className="text-2xl font-extrabold drop-shadow">
          Správa používateľov
        </h2>

        <input
          type="text"
          placeholder="Hľadať podľa mena alebo emailu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            border border-[#642f37]/30
            bg-white/70
            rounded-xl
            px-4 py-2
            text-sm
            text-[#642f37]
            outline-none
            focus:ring-2
            focus:ring-[#F3904B]
            md:w-72
          "
        />
      </div>

      <div className="flex flex-col gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const edit = edits[user.id] || {};
            const isSelf = user.id === currentUserId;

            return (
              <div
                key={user.id}
                className="
                  bg-white
                  border border-[#642f37]/40
                  rounded-xl
                  p-4
                  shadow-sm
                  flex flex-col gap-4
                  lg:flex-row lg:justify-between lg:items-center
                "
              >
                <div className="flex flex-col gap-2 lg:flex-1">
                  <div className="flex items-center gap-3">
                    <input
                      className="
                        flex-1 min-w-0
                        border-b-2 border-[#642f37]
                        focus:border-[#ff7110]
                        outline-none
                        p-1
                        font-bold text-lg
                        text-[#642f37]
                      "
                      value={edit.username ?? ""}
                      onChange={(e) =>
                        updateEdit(user.id, "username", e.target.value)
                      }
                    />

                    {isSelf && (
                      <span className="text-xs bg-[#F3904B] text-white px-2 py-0.5 rounded-full font-bold">
                        Vy
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    {user.email} • Registrácia:{" "}
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={edit.role ?? user.role}
                    onChange={(e) => updateEdit(user.id, "role", e.target.value)}
                    disabled={isSelf}
                    className="
                      border border-[#642f37]/50
                      rounded-lg
                      p-2
                      text-sm
                      bg-white
                      text-[#642f37]
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    {Object.values(Roles).map((role) => (
                      <option key={role} value={role}>
                        {RoleLabels[role]}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() =>
                      handleAction(api.users.update, user.id, {
                        username: edit.username,
                        role: edit.role,
                      })
                    }
                    disabled={!isDirty(user)}
                    className="
                      px-4 py-2
                      rounded-xl
                      bg-[#a5ad24]
                      hover:bg-[#92991f]
                      text-white
                      text-sm
                      font-semibold
                      transition-all duration-200
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                    "
                  >
                    Uložiť
                  </button>

                  <button
                    onClick={() => {
                      const isConfirmed = window.confirm(
                        `Naozaj chcete vymazať používateľa „${user.username}“? Táto akcia je nenávratná.`,
                      );
                      if (isConfirmed) {
                        handleAction(api.users.delete, user.id);
                      }
                    }}
                    disabled={isSelf}
                    className="
                      px-4 py-2
                      rounded-xl
                      bg-[#ffe5e5]
                      hover:bg-[#ffd6d6]
                      text-[#d62828]
                      text-sm
                      font-semibold
                      transition-all duration-200
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                    "
                  >
                    Vymazať
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="
              text-center
              py-20
              text-[#642f37]/60
              bg-white/40
              rounded-[2rem]
              border border-white/40
              backdrop-blur-xl
            "
          >
            <p className="text-xl font-bold mb-2">Žiadni používatelia</p>
            <p className="text-sm">pre vyhľadávanie: {search || "—"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
