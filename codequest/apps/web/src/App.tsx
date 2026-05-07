import { Navigate, Route, Routes } from "react-router-dom";
import { Lobby } from "./lobby/Lobby";
import { PlayPage } from "./play/PlayPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Lobby />} />
      <Route path="/play/:gameId" element={<PlayPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
