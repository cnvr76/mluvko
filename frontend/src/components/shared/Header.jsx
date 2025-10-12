import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header
      className="
      fixed top-0 left-1 w-full
        flex items-center justify-between
        p-5 bg-transparent z-10
      "
    >
      <Link to="/">
        <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
      </Link>

      <nav className="flex gap-8 mr-4">
        <h3
          className="text-2xl  text-[642f37] m-0
          transition-colors duration-300
          hover:text-[#ff7110]"
        >
          Aktuality
        </h3>
        <h3
          className="text-2xl  text-[642f37] m-0
          transition-colors duration-300
          hover:text-[#ff7110]"
        >
          Všetky hry
        </h3>
        <h3
          className="text-2xl  text-[642f37] m-0
          transition-colors duration-300
          hover:text-[#ff7110]"
        >
          Kontakt
        </h3>
      </nav>
    </header>
  );
};

export default Header;
