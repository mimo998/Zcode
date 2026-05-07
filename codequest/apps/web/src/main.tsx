import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TeacherDashboard from "./pages/teacherdashboard";
import { CreateGame } from "./pages/creategame";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import { LoginForm, SignupForm, AuthProvider, RequireAuth } from "./auth";
import FixTheLoopGame from "./games/FixTheLoopGame";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found in index.html");

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />

          <Route
            path="/profile"
            element={
              <RequireAuth roles={["student"]}>
                <ProfilePage />
              </RequireAuth>
            }
          />

          <Route
            path="/teacher/dashboard"
            element={
              <RequireAuth roles={["teacher"]}>
                <TeacherDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/teacher/create-game"
            element={
              <RequireAuth roles={["teacher"]}>
                <CreateGame />
              </RequireAuth>
            }
          />

          <Route
            path="/admin"
            element={
              <RequireAuth roles={["admin"]}>
                <AdminPage />
              </RequireAuth>
            }
          />

          <Route
            path="/play/fix-the-loop"
            element={
              <RequireAuth roles={["student"]}>
                <FixTheLoopGame />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
