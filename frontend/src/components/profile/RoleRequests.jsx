import React, { useEffect, useState } from "react";
import { api, RoleLabels } from "../../services/api";

const STATUS_LABELS = {
  pending: "Čaká",
  approved: "Schválené",
  rejected: "Zamietnuté",
};

const STATUS_BADGE = {
  pending: "bg-[#F7C767] text-white",
  approved: "bg-[#a5ad24] text-white",
  rejected: "bg-[#ffe5e5] text-[#d62828]",
};

const RoleRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await api.roleRequests.all();
      setRequests(data || []);
    } catch (error) {
      console.error("Failed to fetch role requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (actionFn, ...args) => {
    try {
      await actionFn(...args);
      fetchRequests();
    } catch (error) {
      alert("Akcia zlyhala.");
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === "all") return true;
    return r.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-extrabold drop-shadow">Žiadosti o rolu</h2>

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
          Načítavam žiadosti...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm md:flex-row md:justify-between md:items-center">
        <h2 className="text-2xl font-extrabold drop-shadow">
          Žiadosti o rolu logopéda
        </h2>

        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          {["pending", "approved", "rejected", "all"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                statusFilter === status
                  ? "bg-[#F3904B] text-white"
                  : "text-gray-500 hover:text-[#ff7110] hover:bg-white"
              }`}
            >
              {status === "all" ? "VŠETKY" : STATUS_LABELS[status].toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="
                bg-white
                border border-[#642f37]/40
                rounded-xl
                p-4
                shadow-sm
                flex flex-col gap-3
                lg:flex-row lg:justify-between lg:items-center
              "
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-lg">{request.username}</h4>

                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      STATUS_BADGE[request.status]
                    }`}
                  >
                    {STATUS_LABELS[request.status]}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  {request.email} • {RoleLabels[request.current_role]} →{" "}
                  <span className="font-semibold text-[#642f37]">
                    {RoleLabels[request.requested_role]}
                  </span>{" "}
                  • {new Date(request.created_at).toLocaleDateString()}
                </p>

                {request.status === "rejected" && request.admin_feedback && (
                  <p className="text-xs text-red-500 mt-1 italic">
                    Feedback: {request.admin_feedback}
                  </p>
                )}
              </div>

              {request.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const isConfirmed = window.confirm(
                        `Schváliť žiadosť používateľa „${request.username}“ a zmeniť mu rolu na ${RoleLabels[request.requested_role]}?`,
                      );
                      if (isConfirmed) {
                        handleAction(api.roleRequests.approve, request.id);
                      }
                    }}
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
                        alert("Dôvod musí mať aspoň 3 znaky!");
                        return;
                      }
                      handleAction(api.roleRequests.reject, request.id, reason);
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
                </div>
              )}
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
            <p className="text-xl font-bold mb-2">Žiadne žiadosti na zobrazenie</p>
            <p className="text-sm">pre filter: {statusFilter}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleRequests;
