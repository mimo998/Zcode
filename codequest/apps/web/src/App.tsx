import { useState } from "react";
import { LoginForm, SignupForm } from "./Auth";

type Page = "home" | "login" | "signup";

export default function App() {
  const [page, setPage] = useState<Page>("home");

  if (page === "login") {
    return <LoginForm onBack={() => setPage("home")} />;
  }

  if (page === "signup") {
    return <SignupForm onBack={() => setPage("home")} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-900">
      <div className="max-w-lg w-full p-8 bg-white rounded-2xl border border-neutral-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
            CQ
          </div>
          <h1 className="text-xl font-semibold">CodeQuest</h1>
        </div>
        <p className="text-neutral-600 mb-6">
          The platform skeleton is running.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setPage("login")}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            Login
          </button>
          <button
            onClick={() => setPage("signup")}
            className="flex-1 px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 font-medium"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}