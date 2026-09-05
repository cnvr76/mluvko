import React from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../services/api";
import useAdminDashboard from "../../hooks/profile/useAdminDashboard";

const AdminDashboard = () => {
  const { games, isLoading, statusFilter, setStatusFilter, handleAction } =
    useAdminDashboard();

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
        <h2 className="text-3xl font-extrabold drop-shadow">Admin Dashboard</h2>

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
          Načítavam admin dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-2xl font-extrabold drop-shadow">Admin Dashboard</h2>

        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          {["pending", "published", "rejected", "archived", "all"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  statusFilter === status
                    ? "bg-[#F3904B] text-white "
                    : "text-gray-500 hover:text-[#ff7110] hover:bg-white"
                }`}
              >
                {status.toUpperCase()}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {sortedDays.length > 0 ? (
          sortedDays.map((day) => (
            <div key={day} className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                {day === new Date().toLocaleDateString() ? "Dnes" : day}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {groupedByDay[day].map((snapshot) => (
                  <div
                    key={snapshot.id}
                    className="
                      bg-white
                      border border-[#642f37]/40
                      rounded-xl
                      p-4
                      shadow-sm
                      flex justify-between items-center
                    "
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-lg">{snapshot.name}</h4>

                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">
                          v{snapshot.version}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500">
                        Autor:{" "}
                        <span className="text-gray-800">
                          {snapshot.author_name || "Systém"}
                        </span>{" "}
                        • Čas:{" "}
                        {new Date(snapshot.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                      {snapshot.admin_feedback && (
                        <p className="text-xs text-red-500 mt-1 italic">
                          {snapshot.published_version_id === snapshot.id
                            ? "Dôvod"
                            : "Feedback"}
                          : {snapshot.admin_feedback}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/games/${snapshot.game_id}/${snapshot.game_type}?snapshot=${snapshot.id}`}
                        className="
                          px-4 py-2
                          rounded-xl
                          bg-[#a5ad24]
                          hover:bg-[#92991f]
                          text-white
                          text-sm
                          font-semibold
                          transition-all duration-200
                        "
                      >
                        Testovať
                      </Link>

                      {snapshot.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleAction(
                                api.admin.approve,
                                snapshot.game_id,
                                snapshot.id,
                              )
                            }
                            className="
                              px-4 py-2
                              rounded-xl
                              bg-[#a5ad24]
                              hover:bg-[#92991f]
                              text-white
                              text-sm
                              font-semibold
                              transition-all duration-200
                            "
                          >
                            Schváliť
                          </button>

                          <button
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
                            className="
                              px-4 py-2
                              rounded-xl
                              bg-[#ffe5e5]
                              hover:bg-[#ffd6d6]
                              text-[#d62828]
                              text-sm
                              font-semibold
                              transition-all duration-200
                            "
                          >
                            Zamietnuť
                          </button>
                        </>
                      )}

                      {snapshot.id === snapshot.published_version_id && (
                        <button
                          onClick={() => {
                            const reason = prompt("Dôvod zrušenia publikácie:");
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
                          className="
                            px-4 py-2
                            rounded-xl
                            bg-[#9DBBD8]
                            hover:bg-[#8aaed0]
                            text-white
                            text-sm
                            font-semibold
                            transition-all duration-200
                          "
                        >
                          Zrušiť publikáciu
                        </button>
                      )}

                      {snapshot.id === snapshot.published_version_id && (
                        <button
                          onClick={() => {
                            const isConfirmed = window.confirm(
                              "Naozaj chcete archivovať túto hru? Hra zmizne zo stránky, ale verziu možno neskôr znova publikovať cez Rollback.",
                            );
                            if (isConfirmed) {
                              handleAction(api.versions.archive, snapshot.game_id);
                            }
                          }}
                          className="
                            px-4 py-2
                            rounded-xl
                            bg-[#B89DBB]
                            hover:bg-[#a98ead]
                            text-white
                            text-sm
                            font-semibold
                            transition-all duration-200
                          "
                        >
                          Archivovať
                        </button>
                      )}

                      {snapshot.status !== "pending" &&
                        snapshot.status !== "draft" &&
                        snapshot.id !== snapshot.published_version_id && (
                          <button
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
                            className="
                              px-4 py-2
                              rounded-xl
                              bg-[#F3904B]
                              hover:bg-[#e67e36]
                              text-white
                              text-sm
                              font-semibold
                              transition-all duration-200
                            "
                          >
                            Rollback
                          </button>
                        )}

                      <button
                        onClick={() => {
                          const isConfirmed = window.confirm(
                            "POZOR: Naozaj chcete úplne vymazať túto hru zo systému? Vymažú sa tým absolútne VŠETKY jej verzie a dáta.",
                          );
                          if (isConfirmed) {
                            handleAction(api.games.delete, snapshot.game_id);
                          }
                        }}
                        className="
                          px-4 py-2
                          rounded-xl
                          bg-[#ffe5e5]
                          hover:bg-[#ffd6d6]
                          text-[#d62828]
                          text-sm
                          font-semibold
                          transition-all duration-200
                        "
                      >
                        Vymazať celú hru
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
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
            <p className="text-xl font-bold mb-2">Žiadne hry na zobrazenie</p>

            <p className="text-sm">pre filter: {statusFilter}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
