import HomePage from "./pages/HomePage";
import GamesPage from "./pages/GamesPage";
import { AgeGroups } from "./services/api";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/games-2-4"
          element={<GamesPage ageGroup={AgeGroups.JUNIOR} />}
        />
        <Route
          path="/games-5-6"
          element={<GamesPage ageGroup={AgeGroups.MIDDLE} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
