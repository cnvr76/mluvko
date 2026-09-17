import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const MENU_ITEMS = [
  { key: "contact", label: "Kontakt", to: null },
  { key: "about", label: "O nás", to: null },
];

const BAR_ITEM_CLASS =
  "flex items-center gap-2 font-semibold text-fluid-2xl leading-none text-text no-underline whitespace-nowrap transition-colors duration-200 hover:text-accent cursor-pointer";

const BAR_ICON_CLASS = "fa-fw shrink-0 text-fluid-xl -translate-y-[0.14em]";

const PANEL_ITEM_CLASS =
  "block w-full text-left rounded-full px-6 py-3 font-semibold text-fluid-2xl leading-none text-text no-underline bg-white/30 transition-colors duration-200 hover:text-accent cursor-pointer";

const renderMenuItems = (itemClass) =>
  MENU_ITEMS.map(({ key, label, to }) =>
    to ? (
      <Link key={key} to={to} className={itemClass}>
        {label}
      </Link>
    ) : (
      <span key={key} className={itemClass}>
        {label}
      </span>
    ),
  );

const AccountControls = () => {
  const { isAuthenticated, username, logout } = useAuth();

  if (!isAuthenticated)
    return (
      <Link to="/auth?type=signup" className={BAR_ITEM_CLASS}>
        Prihláste sa
      </Link>
    );

  return (
    <>
      <Link to="/profile" className={`${BAR_ITEM_CLASS} min-w-0`}>
        <i
          className={`fa-solid fa-user ${BAR_ICON_CLASS}`}
          aria-hidden="true"
        />
        <span className="truncate max-w-[clamp(3rem,18vw,12rem)]">
          {username}
        </span>
      </Link>
      <button
        type="button"
        onClick={logout}
        aria-label="Odhlásiť sa"
        className={BAR_ITEM_CLASS}
      >
        <i
          className={`fa-solid fa-right-from-bracket ${BAR_ICON_CLASS}`}
          aria-hidden="true"
        />
      </button>
    </>
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
      <header className="fixed inset-x-0 top-0 z-50 h-header grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="col-start-1 justify-self-start shrink-0">
          <img
            src="/images/logo.png"
            alt="Mluvko"
            className="h-7 sm:h-8 w-auto"
          />
        </Link>

        <nav className="col-start-2 hidden md:flex items-center gap-6">
          {renderMenuItems(BAR_ITEM_CLASS)}
        </nav>

        <div className="col-start-3 justify-self-end flex items-center gap-4 min-w-0">
          <AccountControls />

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className={`${BAR_ITEM_CLASS} md:hidden`}
            aria-label="Otvoriť menu"
            aria-expanded={isMenuOpen}
            aria-controls="site-menu"
          >
            <i
              className={`fa-solid fa-bars ${BAR_ICON_CLASS}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </header>

      <div
        onClick={() => setIsMenuOpen(false)}
        className={`md:hidden fixed inset-0 z-50 bg-text/25 backdrop-blur-[2px] transition-opacity duration-300 ${
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
        className={`md:hidden fixed top-3 right-3 bottom-3 z-50 w-[min(78vw,17rem)] surface-glass bg-white/45 rounded-panel shadow-panel-strong flex flex-col gap-3 p-3 transition-transform duration-300 ease-out outline-none ${
          isMenuOpen ? "translate-x-0" : "translate-x-[calc(100%+0.75rem)]"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Zavrieť menu"
          className="self-end shrink-0 size-10 rounded-full surface-glass bg-white/40 hover:bg-white/70 text-fluid-xl text-text hover:text-accent transition-colors duration-200 cursor-pointer"
        >
          <i className="fa-solid fa-xmark fa-fw" aria-hidden="true" />
        </button>

        {renderMenuItems(PANEL_ITEM_CLASS)}
      </nav>
    </>
  );
};

export default Header;
