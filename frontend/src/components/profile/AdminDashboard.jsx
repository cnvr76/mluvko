import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

const AdminDashboard = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminDashboard();
      setGames(data || []);
    } catch (error) {
      console.error("Failed to fetch dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // 1. Плоская структура: превращаем игры в список снапшотов
  const allSnapshots = games.flatMap((game) =>
    game.versions.map((v) => ({
      ...v,
      game_id: game.id,
      author_name: game.author_name,
      published_version_id: game.published_version_id,
    }))
  );

  // 2. Фильтрация по статусу (убираем драфты для админа по умолчанию)
  const filteredSnapshots = allSnapshots.filter((s) => {
    if (statusFilter === "all") return s.status !== "draft";
    return s.status === statusFilter;
  });

  // 3. Группировка по дням
  const groupedByDay = filteredSnapshots.reduce((acc, s) => {
    const day = new Date(s.created_at).toLocaleDateString();
    if (!acc[day]) acc[day] = [];
    acc[day].push(s);
    return acc;
  }, {});

  // Сортировка дней (новые сверху)
  const sortedDays = Object.keys(groupedByDay).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const handleAction = async (actionFn, ...args) => {
    try {
      await actionFn(...args);
      fetchDashboard();
    } catch (error) {
      alert("Akcia zlyhala.");
    }
  };

  if (loading) return <div className="p-8">Načítavam admin dashboard...</div>;

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex justify-between items-center bg-white p-4 rounded shadow-sm">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>

        {/* Фильтры статуса */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded">
          {["pending", "published", "rejected", "archived", "all"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1 rounded text-sm font-medium transition ${
                  statusFilter === status
                    ? "bg-white shadow text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {status.toUpperCase()}
              </button>
            )
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
                    className="bg-white border rounded-lg p-4 shadow-sm flex justify-between items-center"
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
                          Feedback: {snapshot.admin_feedback}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/games/${snapshot.game_id}/${snapshot.game_type}?snapshot=${snapshot.id}`}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm font-semibold"
                      >
                        Testovať
                      </Link>

                      {snapshot.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleAction(
                                api.approveSnapshot,
                                snapshot.game_id,
                                snapshot.id
                              )
                            }
                            className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold"
                          >
                            Schváliť
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt("Dôvod zamietnutia:");
                              if (reason === null) return;
                              if (reason.trim().length < 3) {
                                alert("Dôvod musí mať aspoň 3 znaky!");
                                return;
                              }
                              handleAction(
                                api.rejectPendingSnapshot,
                                snapshot.game_id,
                                snapshot.id,
                                reason
                              );
                            }}
                            className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold"
                          >
                            Zamietnuť
                          </button>
                        </>
                      )}

                      {/* Если это ТЕКУЩАЯ опубликованная версия (Revoke) */}
                      {snapshot.id === snapshot.published_version_id && (
                        <button
                          onClick={() => {
                            const reason = prompt(
                              "Dôvod stiahnutia hry z webu:"
                            );
                            if (reason === null) return;
                            if (reason.trim().length < 3) {
                              alert("Dôvod musí mať aspoň 3 znaky!");
                              return;
                            }
                            handleAction(
                              api.revokeGame,
                              snapshot.game_id,
                              reason
                            );
                          }}
                          className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm font-semibold"
                        >
                          Stiahnuť z webu (Revoke)
                        </button>
                      )}

                      {/* Если это СТАРАЯ или ОТКЛОНЕННАЯ версия (Rollback) */}
                      {snapshot.status !== "pending" &&
                        snapshot.status !== "draft" &&
                        snapshot.id !== snapshot.published_version_id && (
                          <button
                            onClick={() => {
                              const reason = prompt(
                                "Dôvod rollbacku na túto verziu:"
                              );
                              if (reason === null) return;
                              handleAction(
                                api.rollbackGame,
                                snapshot.game_id,
                                snapshot.id,
                                reason || "Admin rollback"
                              );
                            }}
                            className="px-3 py-1.5 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm font-semibold"
                          >
                            Rollback na túto verziu
                          </button>
                        )}

                      <button
                        onClick={() => {
                          const isConfirmed = window.confirm(
                            "POZOR: Naozaj chcete úplne vymazať túto hru zo systému? Vymažú sa tým absolútne VŠETKY jej verzie a dáta."
                          );
                          if (isConfirmed) {
                            handleAction(api.deleteGame, snapshot.game_id);
                          }
                        }}
                        className="px-3 py-1.5 bg-red-800 text-white rounded hover:bg-red-900 text-sm font-semibold"
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
          <div className="text-center py-20 text-gray-400 bg-white rounded border-2 border-dashed">
            Žiadne záznamy pre filter: {statusFilter}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
