import HomePage from "./pages/HomePage";
import GamesPage_2_4_years from "./pages/GamesPage_2_4_years";
import GamesPage_5_6_years from "./pages/GamesPage_5_6_years";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* вот пути, на которые будем переходить */}
        <Route path="/games-2-4" element={<GamesPage_2_4_years />} />
        <Route path="/games-5-6" element={<GamesPage_5_6_years />} />
      </Routes>
    </Router>
  );
}

export default App;
