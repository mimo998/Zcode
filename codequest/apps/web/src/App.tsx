import { BrowserRouter, Routes, Route } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage";
import GamePlayPage from "./pages/GamePlayPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LobbyPage />} />
        <Route path="/play/:gameId" element={<GamePlayPage />} />
      </Routes>
    </BrowserRouter>
  );
}
