import { useState } from "react";

const API_URL = "http://localhost:3001/api/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || "Login failed" };
    } catch (error) {
      return { success: false, message: "Network error" };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || "Signup failed" };
    } catch (error) {
      return { success: false, message: "Network error" };
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, login, signup, isAuthenticated: !!user };
}

// LoginForm
export function LoginForm({ onBack }: { onBack: () => void }) {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      alert("Login successful!");
      onBack();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-900">
      <div className="max-w-lg w-full p-8 bg-white rounded-2xl border border-neutral-200">
        <button
          onClick={onBack}
          className="mb-4 text-indigo-600 hover:underline text-sm font-medium"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
            CQ
          </div>
          <h1 className="text-xl font-semibold">CodeQuest</h1>
        </div>
        <h2 className="text-lg font-medium mb-6">התחברות</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
          >
            {loading ? "טוען..." : "התחברות"}
          </button>
        </form>
      </div>
    </div>
  );
}

// SignupForm
export function SignupForm({ onBack }: { onBack: () => void }) {
  const { signup, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await signup(email, password, name, role);
    if (result.success) {
      alert("Signup successful!");
      onBack();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-900">
      <div className="max-w-lg w-full p-8 bg-white rounded-2xl border border-neutral-200">
        <button
          onClick={onBack}
          className="mb-4 text-indigo-600 hover:underline text-sm font-medium"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
            CQ
          </div>
          <h1 className="text-xl font-semibold">CodeQuest</h1>
        </div>
        <h2 className="text-lg font-medium mb-6">הרשמה</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="שם"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            disabled={loading}
            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-indigo-500"
          >
            <option value="student">תלמיד</option>
            <option value="teacher">מורה</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
          >
            {loading ? "טוען..." : "הרשמה"}
          </button>
        </form>
      </div>
    </div>
  );
}