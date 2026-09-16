import React, { useState } from "react";
import { api, Roles, RoleLabels } from "../../services/api";
import useUserManagement from "../../hooks/profile/useUserManagement";
import ActionButton from "../shared/ActionButton";
import PanelHeader from "./PanelHeader";

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
        <PanelHeader title="Používatelia" />

        <div className="surface-glass rounded-card p-8 text-center text-text font-semibold">
          Načítavam používateľov...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PanelHeader title="Používatelia">
        <input
          type="text"
          placeholder="Hľadať podľa mena alebo emailu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="field rounded-full text-fluid-sm sm:w-72"
        />
      </PanelHeader>

      <div className="flex flex-col gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const edit = edits[user.id] || {};
            const isSelf = user.id === currentUserId;

            return (
              <div
                key={user.id}
                className="
                  surface-glass bg-white/40 rounded-card p-4
                  flex flex-col gap-4
                  lg:flex-row lg:justify-between lg:items-center
                "
              >
                <div className="flex flex-col gap-2 min-w-0 lg:flex-1">
                  <div className="flex items-center gap-3">
                    <input
                      className="
                        flex-1 min-w-0
                        bg-transparent border-b-2 border-text
                        focus:border-accent outline-none
                        p-1 font-bold text-fluid-lg text-text
                      "
                      value={edit.username ?? ""}
                      onChange={(e) =>
                        updateEdit(user.id, "username", e.target.value)
                      }
                    />

                    {isSelf && (
                      <span className="shrink-0 text-fluid-sm bg-accent-soft text-white px-2.5 py-0.5 rounded-full font-bold">
                        Vy
                      </span>
                    )}
                  </div>

                  <p className="text-fluid-sm text-text/60 break-words">
                    {user.email} • Registrácia:{" "}
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={edit.role ?? user.role}
                    onChange={(e) =>
                      updateEdit(user.id, "role", e.target.value)
                    }
                    disabled={isSelf}
                    className="
                      field rounded-full text-fluid-sm w-auto py-2
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                  >
                    {Object.values(Roles).map((role) => (
                      <option key={role} value={role}>
                        {RoleLabels[role]}
                      </option>
                    ))}
                  </select>

                  <ActionButton
                    icon="fa-floppy-disk"
                    label="Uložiť zmeny"
                    tone="success"
                    disabled={!isDirty(user)}
                    onClick={() =>
                      handleAction(api.users.update, user.id, {
                        username: edit.username,
                        role: edit.role,
                      })
                    }
                  />

                  <ActionButton
                    icon="fa-trash"
                    label="Vymazať používateľa"
                    tone="danger"
                    disabled={isSelf}
                    onClick={() => {
                      const isConfirmed = window.confirm(
                        `Naozaj chcete vymazať používateľa „${user.username}“? Táto akcia je nenávratná.`,
                      );
                      if (isConfirmed) {
                        handleAction(api.users.delete, user.id);
                      }
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="surface-glass bg-white/40 rounded-card text-center py-12 text-text/60">
            <p className="text-fluid-xl font-bold mb-2">Žiadni používatelia</p>
            <p className="text-fluid-sm">pre vyhľadávanie: {search || "—"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
