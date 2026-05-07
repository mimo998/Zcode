import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { LoginForm, SignupForm } from "./auth";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element #root not found in index.html");
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginForm onBack={() => window.location.href = "/"} />} />
        <Route path="/signup" element={<SignupForm onBack={() => window.location.href = "/"} />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);