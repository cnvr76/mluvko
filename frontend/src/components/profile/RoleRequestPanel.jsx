import React from "react";
import useRoleRequestPanel from "../../hooks/profile/useRoleRequestPanel";

const RoleRequestPanel = () => {
  const { request, isLoading, submitting, handleApply } = useRoleRequestPanel();

  const isPending = request?.status === "pending";
  const isRejected = request?.status === "rejected";

  return (
    <div
      className="
        surface-glass rounded-card
        p-6
        flex flex-col gap-4
      "
    >
      <h3 className="text-fluid-2xl font-extrabold drop-shadow">
        Chcete vytvárať vlastné hry?
      </h3>

      <p className="text-fluid-sm opacity-80 leading-relaxed">
        Ako logopéd získate prístup k editoru hier – môžete vytvárať nové
        logopedické hry, posielať ich na schválenie a po zverejnení ich
        sprístupniť ostatným. Požiadajte administrátora o rolu logopéda.
      </p>

      {isPending ? (
        <div
          className="
            rounded-2xl
            bg-white/50
            border border-white/60
            px-5 py-4
            text-text
            font-semibold
          "
        >
          Vaša žiadosť o rolu logopéda čaká na schválenie administrátorom.
        </div>
      ) : (
        <>
          {isRejected && (
            <div
              className="
                rounded-2xl
                bg-danger-bg
                border border-danger/30
                px-5 py-4
                text-danger
                text-fluid-sm
              "
            >
              <strong>Predchádzajúca žiadosť bola zamietnutá.</strong>
              {request?.admin_feedback && (
                <p className="mt-1 italic">Dôvod: {request.admin_feedback}</p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleApply}
            disabled={isLoading || submitting}
            className="
              btn-pill self-start
              bg-accent hover:bg-accent-hover
              text-white font-bold text-fluid-lg
              shadow-accent
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
            "
          >
            {submitting
              ? "Odosielam..."
              : isRejected
                ? "Požiadať znova"
                : "Požiadať o rolu logopéda"}
          </button>
        </>
      )}
    </div>
  );
};

export default RoleRequestPanel;
