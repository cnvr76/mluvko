import React from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../services/api";
import useManagedList from "../../hooks/profile/useManagedList";
import ActionButton from "../shared/ActionButton";
import PanelHeader from "./PanelHeader";
import Notice from "../shared/Notice";
import FilterChips from "./FilterChips";
import { actionButtonClass } from "../shared/actionButtonClass";

const STATUS_FILTERS = [
  "pending",
  "published",
  "rejected",
  "archived",
  "all",
].map((value) => ({ value, label: value.toUpperCase() }));

const DASHBOARD_KEY = ["admin", "dashboard"];

const AdminDashboard = () => {
  const {
    items: games,
    isLoading,
    statusFilter,
    setStatusFilter,
    handleAction,
  } = useManagedList({
    queryKey: DASHBOARD_KEY,
    queryFn: api.admin.dashboard,
  });

  const allSnapshots = games.flatMap((game) =>
    game.versions.map((v) => ({
      ...v,
      game_id: game.id,
      author_name: game.author_name,
      published_version_id: game.published_version_id,
    })),
  );

  const filteredSnapshots = allSnapshots.filter((s) => {
    if (statusFilter === "all") return s.status !== "draft";
    return s.status === statusFilter;
  });

  const groupedByDay = filteredSnapshots.reduce((acc, s) => {
    const day = new Date(s.created_at).toLocaleDateString();
    if (!acc[day]) acc[day] = [];
    acc[day].push(s);
    return acc;
  }, {});

  const sortedDays = Object.keys(groupedByDay).sort(
    (a, b) => new Date(b) - new Date(a),
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <PanelHeader title="Admin Dashboard" />

        <div
          className="
            surface-glass rounded-card
            p-10
            text-center
            text-text
            font-semibold
          "
        >
          Načítavam admin dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PanelHeader title="Admin Dashboard">
        <FilterChips
          options={STATUS_FILTERS}
          value={statusFilter}
          onChange={setStatusFilter}
          label="Filter podľa stavu verzie"
        />
      </PanelHeader>

      <div className="flex flex-col gap-8">
        {sortedDays.length > 0 ? (
          sortedDays.map((day) => (
            <div key={day} className="flex flex-col gap-4">
              <h3 className="text-fluid-sm font-bold uppercase tracking-wide text-text/50">
                {day === new Date().toLocaleDateString() ? "Dnes" : day}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {groupedByDay[day].map((snapshot) => (
                  <div
                    key={snapshot.id}
                    className="surface-glass bg-white/40 rounded-card p-4 flex flex-col gap-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-bold text-fluid-lg">
                            {snapshot.name}
                          </h4>

                          <span className="text-fluid-sm bg-white/60 px-2.5 py-0.5 rounded-full text-text/60 font-semibold">
                            v{snapshot.version}
                          </span>
                        </div>

                        <p className="text-fluid-sm text-text/60 break-words">
                          Autor:{" "}
                          <span className="text-text font-semibold">
                            {snapshot.author_name || "Systém"}
                          </span>{" "}
                          • Čas:{" "}
                          {new Date(snapshot.created_at).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 shrink-0">
                        <Link
                          to={`/games/${snapshot.game_id}/${snapshot.game_type}?snapshot=${snapshot.id}`}
                          aria-label="Testovať verziu"
                          title="Testovať verziu"
                          className={actionButtonClass("accentSoft")}
                        >
                          <i
                            className="fa-solid fa-play fa-fw"
                            aria-hidden="true"
                          />
                        </Link>

                        {snapshot.status === "pending" && (
                          <>
                            <ActionButton
                              icon="fa-check"
                              label="Schváliť verziu"
                              tone="success"
                              onClick={() =>
                                handleAction(
                                  api.admin.approve,
                                  snapshot.game_id,
                                  snapshot.id,
                                )
                              }
                            />

                            <ActionButton
                              icon="fa-xmark"
                              label="Zamietnuť verziu"
                              tone="danger"
                              onClick={() => {
                                const reason = prompt("Dôvod zamietnutia:");
                                if (reason === null) return;
                                if (reason.trim().length < 3) {
                                  toast.error("Dôvod musí mať aspoň 3 znaky!");
                                  return;
                                }
                                handleAction(
                                  api.admin.reject,
                                  snapshot.game_id,
                                  snapshot.id,
                                  reason,
                                );
                              }}
                            />
                          </>
                        )}

                        {snapshot.id === snapshot.published_version_id && (
                          <ActionButton
                            icon="fa-eye-slash"
                            label="Zrušiť publikáciu"
                            tone="blue"
                            onClick={() => {
                              const reason = prompt(
                                "Dôvod zrušenia publikácie:",
                              );
                              if (reason === null) return;
                              if (reason.trim().length < 3) {
                                toast.error("Dôvod musí mať aspoň 3 znaky!");
                                return;
                              }
                              handleAction(
                                api.admin.revoke,
                                snapshot.game_id,
                                reason,
                              );
                            }}
                          />
                        )}

                        {snapshot.id === snapshot.published_version_id && (
                          <ActionButton
                            icon="fa-box-archive"
                            label="Archivovať hru"
                            tone="lavender"
                            onClick={() => {
                              const isConfirmed = window.confirm(
                                "Naozaj chcete archivovať túto hru? Hra zmizne zo stránky, ale verziu možno neskôr znova publikovať cez Rollback.",
                              );
                              if (isConfirmed) {
                                handleAction(
                                  api.versions.archive,
                                  snapshot.game_id,
                                );
                              }
                            }}
                          />
                        )}

                        {snapshot.status !== "pending" &&
                          snapshot.status !== "draft" &&
                          snapshot.id !== snapshot.published_version_id && (
                            <ActionButton
                              icon="fa-rotate-left"
                              label="Rollback na túto verziu"
                              tone="accent"
                              onClick={() => {
                                const reason = prompt(
                                  "Dôvod rollbacku na túto verziu:",
                                );
                                if (reason === null) return;
                                handleAction(
                                  api.admin.rollback,
                                  snapshot.game_id,
                                  snapshot.id,
                                  reason || "Admin rollback",
                                );
                              }}
                            />
                          )}

                        <ActionButton
                          icon="fa-trash"
                          label="Vymazať celú hru"
                          tone="danger"
                          onClick={() => {
                            const isConfirmed = window.confirm(
                              "POZOR: Naozaj chcete úplne vymazať túto hru zo systému? Vymažú sa tým absolútne VŠETKY jej verzie a dáta.",
                            );
                            if (isConfirmed) {
                              handleAction(api.games.delete, snapshot.game_id);
                            }
                          }}
                        />
                      </div>
                    </div>

                    {snapshot.admin_feedback && (
                      <Notice
                        tone="danger"
                        title={
                          snapshot.published_version_id === snapshot.id
                            ? "Dôvod"
                            : "Feedback"
                        }
                      >
                        {snapshot.admin_feedback}
                      </Notice>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="surface-glass bg-white/40 rounded-card text-center py-12 text-text/60">
            <p className="text-fluid-xl font-bold mb-2">
              Žiadne hry na zobrazenie
            </p>
            <p className="text-fluid-sm">pre filter: {statusFilter}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
