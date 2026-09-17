import React from "react";
import { toast } from "sonner";
import { api, RoleLabels } from "../../services/api";
import useManagedList from "../../hooks/profile/useManagedList";
import ActionButton from "../shared/ActionButton";
import PanelHeader from "./PanelHeader";
import Notice from "../shared/Notice";
import FilterChips from "./FilterChips";

const STATUS_LABELS = {
  pending: "Čaká",
  approved: "Schválené",
  rejected: "Zamietnuté",
};

const STATUS_BADGE = {
  pending: "bg-yellow text-white",
  approved: "bg-success text-white",
  rejected: "bg-danger-bg text-danger",
};

const STATUS_FILTERS = [
  ...Object.keys(STATUS_LABELS).map((value) => ({
    value,
    label: STATUS_LABELS[value].toUpperCase(),
  })),
  { value: "all", label: "VŠETKY" },
];

const REQUESTS_KEY = ["role-requests", "all"];

const RoleRequests = () => {
  const {
    items: requests,
    isLoading,
    statusFilter,
    setStatusFilter,
    handleAction,
  } = useManagedList({
    queryKey: REQUESTS_KEY,
    queryFn: api.roleRequests.all,
  });

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === "all") return true;
    return r.status === statusFilter;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <PanelHeader title="Žiadosti o rolu" />

        <div className="surface-glass rounded-card p-8 text-center text-text font-semibold">
          Načítavam žiadosti...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PanelHeader title="Žiadosti o rolu">
        <FilterChips
          options={STATUS_FILTERS}
          value={statusFilter}
          onChange={setStatusFilter}
          label="Filter podľa stavu žiadosti"
        />
      </PanelHeader>

      <div className="flex flex-col gap-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="surface-glass bg-white/40 rounded-card p-4 flex flex-col gap-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-bold text-fluid-lg">
                      {request.username}
                    </h4>

                    <span
                      className={`text-fluid-sm px-2.5 py-0.5 rounded-full font-bold ${
                        STATUS_BADGE[request.status]
                      }`}
                    >
                      {STATUS_LABELS[request.status]}
                    </span>
                  </div>

                  <p className="text-fluid-sm text-text/60 break-words">
                    {request.email} • {RoleLabels[request.current_role]} →{" "}
                    <span className="font-semibold text-text">
                      {RoleLabels[request.requested_role]}
                    </span>{" "}
                    • {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>

                {request.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <ActionButton
                      icon="fa-check"
                      label="Schváliť žiadosť"
                      tone="success"
                      onClick={() => {
                        const isConfirmed = window.confirm(
                          `Schváliť žiadosť používateľa „${request.username}“ a zmeniť mu rolu na ${RoleLabels[request.requested_role]}?`,
                        );
                        if (isConfirmed) {
                          handleAction(api.roleRequests.approve, request.id);
                        }
                      }}
                    />

                    <ActionButton
                      icon="fa-xmark"
                      label="Zamietnuť žiadosť"
                      tone="danger"
                      onClick={() => {
                        const reason = prompt("Dôvod zamietnutia:");
                        if (reason === null) return;
                        if (reason.trim().length < 3) {
                          toast.error("Dôvod musí mať aspoň 3 znaky!");
                          return;
                        }
                        handleAction(
                          api.roleRequests.reject,
                          request.id,
                          reason,
                        );
                      }}
                    />
                  </div>
                )}
              </div>

              {request.status === "rejected" && request.admin_feedback && (
                <Notice tone="danger" title="Dôvod">
                  {request.admin_feedback}
                </Notice>
              )}
            </div>
          ))
        ) : (
          <div className="surface-glass bg-white/40 rounded-card text-center py-12 text-text/60">
            <p className="text-fluid-xl font-bold mb-2">
              Žiadne žiadosti na zobrazenie
            </p>
            <p className="text-fluid-sm">pre filter: {statusFilter}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleRequests;
