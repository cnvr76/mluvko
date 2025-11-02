import React from "react";
import { Link } from "react-router-dom";

const Header = ({ fixed = false }) => {
  return (
    <header
      className={`
      ${
        fixed ? "absolute top-0 bg-transparent" : ""
      } w-full flex items-center justify-between p-6 z-100
      `}
    >
      <Link to="/">
        <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
      </Link>

      <nav className="flex gap-8 mr-4 font-[600]">
        <h3
          className="text-2xl  text-[642f37] m-0
          transition-colors duration-300 cursor-pointer
          hover:text-[#ff7110]"
        >
          Aktuality
        </h3>
        <h3
          className="text-2xl  text-[642f37] m-0
          transition-colors duration-300 cursor-pointer
          hover:text-[#ff7110]"
        >
          Všetky hry
        </h3>
        <h3
          className="text-2xl  text-[642f37] m-0
          transition-colors duration-300 cursor-pointer
          hover:text-[#ff7110]"
        >
          Kontakt
        </h3>
      </nav>
    </header>
  );
};

export default Header;
