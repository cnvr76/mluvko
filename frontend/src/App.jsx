import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/shared/Header";
import HomePage from "./pages/HomePage";
import GamesPage_2_4_years from "./pages/GamesPage_2_4_years";
import GamesPage_5_6_years from "./pages/GamesPage_5_6_years";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div
        className="overflow-x-hidden"
        style={{ fontFamily: '"Rajdhani", sans-serif', fontWeight: 600 }}
      >
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* вот пути, на которые будем переходить */}
          <Route path="/games-2-4" element={<GamesPage_2_4_years />} />
          <Route path="/games-5-6" element={<GamesPage_5_6_years />} />
        </Routes>
      </div>
    </Router>
  );
}

function loadGoogleFont() {
  const id = "gf-rajdhani";
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}
loadGoogleFont();

export default App;
