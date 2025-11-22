import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header
      className="
        fixed top-0 left-0
        w-full h-16 md:h-20
        flex items-center justify-between
        px-4 py-3 md:px-6 md:py-6
        z-50
        bg-transparent
      "
    >
      <Link to="/">
        <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
      </Link>

      {/* desktop */}
      <nav className="hidden md:flex gap-8 mr-4 font-[600]">
        <h3 className="text-lg md:text-2xl text-[#642f37] m-0 transition-colors duration-300 cursor-pointer hover:text-[#ff7110]">
          Aktuality
        </h3>
        <h3 className="text-lg md:text-2xl text-[#642f37] m-0 transition-colors duration-300 cursor-pointer hover:text-[#ff7110]">
          Všetky hry
        </h3>
        <h3 className="text-lg md:text-2xl text-[#642f37] m-0 transition-colors duration-300 cursor-pointer hover:text-[#ff7110]">
          Kontakt
        </h3>
      </nav>

      {/* burger */}
      <button
        type="button"
        onClick={toggleMenu}
        className="md:hidden flex flex-col gap-1.5 mr-1"
        aria-label="Otvoriť menu"
      >
        <span className="w-6 h-0.5 bg-[#642f37] rounded-full" />
        <span className="w-6 h-0.5 bg-[#642f37] rounded-full" />
        <span className="w-6 h-0.5 bg-[#642f37] rounded-full" />
      </button>

      {/* mobile dropdown */}
      {isOpen && (
        <nav
          className="
            md:hidden
            absolute top-full right-0 mt-2 mr-4
            bg-white/90 backdrop-blur-xl
            rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)]
            flex flex-col items-start gap-3
            px-5 py-4 font-[600]
          "
        >
          <button
            onClick={() => setIsOpen(false)}
            className="self-end text-sm text-[#642f37]"
          >
            ✕
          </button>

          <h3 className="text-lg text-[#642f37] m-0 hover:text-[#ff7110]">
            Aktuality
          </h3>
          <h3 className="text-lg text-[#642f37] m-0 hover:text-[#ff7110]">
            Všetky hry
          </h3>
          <h3 className="text-lg text-[#642f37] m-0 hover:text-[#ff7110]">
            Kontakt
          </h3>
        </nav>
      )}
    </header>
  );
};

export default Header;
