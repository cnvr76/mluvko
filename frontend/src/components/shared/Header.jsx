import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const MENU_ITEMS = [{ key: "contact", label: "Kontakt", to: null }];

const LINK_CLASS =
  "font-semibold text-text no-underline whitespace-nowrap transition-colors duration-200 hover:text-accent";

const renderMenuItems = (itemClass) =>
  MENU_ITEMS.map(({ key, label, to }) =>
    to ? (
      <Link key={key} to={to} className={`${LINK_CLASS} ${itemClass}`}>
        {label}
      </Link>
    ) : (
      <span key={key} className={`${LINK_CLASS} ${itemClass}`}>
        {label}
      </span>
    ),
  );

const AccountControls = () => {
  const { isAuthenticated, username, logout } = useAuth();

  if (!isAuthenticated)
    return (
      <Link to="/auth?type=signup" className={`${LINK_CLASS} text-fluid-xl`}>
        Prihláste sa
      </Link>
    );

  return (
    <div className="flex items-center gap-3">
      <Link
        to="/profile"
        className={`${LINK_CLASS} text-fluid-xl flex items-center gap-2 min-w-0`}
      >
        <i className="fa-solid fa-user shrink-0" aria-hidden="true" />
        <span className="truncate max-w-24 sm:max-w-48">{username}</span>
      </Link>
      <button
        type="button"
        onClick={logout}
        aria-label="Odhlásiť sa"
        className={`${LINK_CLASS} text-fluid-xl`}
      >
        <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
      </button>
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const panelRef = useRef(null);

  useEffect(() => setIsMenuOpen(false), [location.key]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    panelRef.current?.focus();

    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-header flex items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0">
          <img src="/images/logo.png" alt="Mluvko" className="h-7 sm:h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {renderMenuItems("text-fluid-2xl")}
          </nav>

          <AccountControls />

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden flex flex-col justify-center gap-1.5 p-2 -mr-2 shrink-0"
            aria-label="Otvoriť menu"
            aria-expanded={isMenuOpen}
            aria-controls="site-menu"
          >
            <span className="w-6 h-0.5 bg-text rounded-full" />
            <span className="w-6 h-0.5 bg-text rounded-full" />
            <span className="w-6 h-0.5 bg-text rounded-full" />
          </button>
        </div>
      </header>

      <div
        onClick={() => setIsMenuOpen(false)}
        className={`md:hidden fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      <nav
        id="site-menu"
        ref={panelRef}
        tabIndex={-1}
        inert={!isMenuOpen}
        aria-label="Hlavné menu"
        className={`md:hidden fixed top-0 right-0 z-50 h-dvh w-[min(80vw,20rem)] surface-glass bg-white/85 border-y-0 border-r-0 shadow-panel-strong flex flex-col gap-6 px-6 pt-6 transition-transform duration-300 ease-out outline-none ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Zavrieť menu"
          className="self-end text-fluid-2xl text-text hover:text-accent transition-colors duration-200"
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>

        {renderMenuItems("text-fluid-2xl")}
      </nav>
    </>
  );
};

export default Header;
