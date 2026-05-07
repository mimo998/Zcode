import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm, SignupForm } from "./auth";
import LobbyRoute from "./routes/LobbyRoute";
import GamePlaceholderRoute from "./routes/GamePlaceholderRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LobbyRoute />} />
        <Route path="/play/:gameId" element={<GamePlaceholderRoute />} />
        <Route
          path="/login"
          element={<LoginForm onBack={() => (window.location.href = "/")} />}
        />
        <Route
          path="/signup"
          element={<SignupForm onBack={() => (window.location.href = "/")} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
