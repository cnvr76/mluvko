import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ITEM_CLASS =
  "text-fluid-2xl font-semibold text-text whitespace-nowrap transition-colors duration-200";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, username, logout } = useAuth();
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => setIsMenuOpen(false), [location.key]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setIsMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [isMenuOpen]);

  const menuItems = [
    <span key="contact" className={ITEM_CLASS}>
      Kontakt
    </span>,

    isAuthenticated ? (
      <Link
        key="account"
        to="/profile"
        className={`${ITEM_CLASS} no-underline hover:text-accent`}
      >
        Konto{username && ` (${username})`}
      </Link>
    ) : (
      <Link
        key="account"
        to="/auth?type=signup"
        className={`${ITEM_CLASS} no-underline hover:text-accent`}
      >
        Prihláste sa
      </Link>
    ),

    isAuthenticated && (
      <button
        key="logout"
        type="button"
        onClick={logout}
        className={`${ITEM_CLASS} flex items-center gap-2 hover:text-accent`}
      >
        <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
        Odhlásiť sa
      </button>
    ),
  ].filter(Boolean);

  return (
    <header
      ref={menuRef}
      className="
        fixed inset-x-0 top-0 z-50
        h-header
        flex items-center justify-between gap-4
        px-4 sm:px-6
      "
    >
      <Link to="/" className="shrink-0">
        <img
          src="/images/logo.png"
          alt="Mluvko"
          className="h-7 sm:h-8 w-auto"
        />
      </Link>

      <nav className="hidden md:flex items-center gap-6 lg:gap-8">
        {menuItems}
      </nav>

      <button
        type="button"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        className="md:hidden flex flex-col justify-center gap-1.5 p-2 -mr-2"
        aria-label={isMenuOpen ? "Zavrieť menu" : "Otvoriť menu"}
        aria-expanded={isMenuOpen}
        aria-controls="site-menu"
      >
        <span className="w-6 h-0.5 bg-text rounded-full" />
        <span className="w-6 h-0.5 bg-text rounded-full" />
        <span className="w-6 h-0.5 bg-text rounded-full" />
      </button>

      {isMenuOpen && (
        <nav
          id="site-menu"
          className="
            md:hidden
            absolute top-full right-4
            surface-glass bg-white/80
            rounded-panel shadow-control
            flex flex-col items-stretch gap-3
            px-5 py-4
            max-w-[calc(100vw-2rem)]
          "
        >
          {menuItems}
        </nav>
      )}
    </header>
  );
};

export default Header;
