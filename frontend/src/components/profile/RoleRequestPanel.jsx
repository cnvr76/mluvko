import React from "react";
import useRoleRequestPanel from "../../hooks/profile/useRoleRequestPanel";

const RoleRequestPanel = () => {
  const { request, isLoading, submitting, handleApply } =
    useRoleRequestPanel();

  const isPending = request?.status === "pending";
  const isRejected = request?.status === "rejected";

  return (
    <div
      className="
        rounded-panel
        bg-white/30
        backdrop-blur-xl
        border border-white/40
        shadow-panel
        p-6
        flex flex-col gap-4
      "
    >
      <h3 className="text-2xl font-extrabold drop-shadow">
        Chcete vytvárať vlastné hry?
      </h3>

      <p className="text-sm opacity-80 leading-relaxed">
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
                bg-red-50
                border border-red-200
                px-5 py-4
                text-red-700
                text-sm
              "
            >
              <strong>Predchádzajúca žiadosť bola zamietnutá.</strong>
              {request?.admin_feedback && (
                <p className="mt-1 italic">
                  Dôvod: {request.admin_feedback}
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleApply}
            disabled={isLoading || submitting}
            className="
              self-start
              px-8 py-3
              rounded-full
              bg-accent
              hover:bg-accent-hover
              text-white
              font-bold text-lg
              shadow-accent
              transition-all duration-200
              hover:scale-105
              active:scale-95
              disabled:opacity-50
              disabled:cursor-not-allowed
              disabled:hover:scale-100
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
