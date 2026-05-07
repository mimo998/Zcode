import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";

interface Game {
  id: number;
  title: string;
  description: string;
  studentCount: number;
  createdAt: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  totalScore: number;
  gamesCompleted: number;
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "games" | "students">("overview");

  const [games] = useState<Game[]>([
    { id: 1, title: "Array Basics", description: "Learn basic array operations", studentCount: 15, createdAt: "2025-01-10" },
  ]);
  const [students] = useState<Student[]>([
    { id: 1, name: "Ahmed", email: "ahmed@example.com", totalScore: 450, gamesCompleted: 3 },
    { id: 2, name: "Sara", email: "sara@example.com", totalScore: 520, gamesCompleted: 4 },
    { id: 3, name: "Omar", email: "omar@example.com", totalScore: 380, gamesCompleted: 2 },
  ]);

  const avg = Math.round(students.reduce((acc, s) => acc + s.totalScore, 0) / Math.max(students.length, 1));

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="text-sky-400 font-black text-xs tracking-widest uppercase mb-1">Teacher</p>
          <h1 className="text-3xl font-black">Dashboard</h1>
        </div>

        <div className="inline-flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl mb-6">
          {([
            ["overview", "Overview"],
            ["games", "Games"],
            ["students", "Students"],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-5 py-2 rounded-lg text-sm font-black transition ${
                activeTab === id ? "bg-zinc-700 text-white shadow-lg" : "text-zinc-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Stat label="Total Students" value={students.length} accent="text-emerald-400" />
            <Stat label="Games Created" value={games.length} accent="text-sky-400" />
            <Stat label="Average Score" value={avg} accent="text-amber-400" />
          </div>
        )}

        {activeTab === "games" && (
          <div>
            <button
              onClick={() => navigate("/teacher/create-game")}
              className="mb-5 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl font-black transition shadow-[0_4px_0_0_rgb(5,150,105)] hover:shadow-[0_2px_0_0_rgb(5,150,105)] active:translate-y-px"
            >
              + Create New Game
            </button>
            <div className="space-y-3">
              {games.map((g) => (
                <div key={g.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition rounded-2xl p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-black">{g.title}</h3>
                    <p className="text-zinc-400 text-sm mt-1">{g.description}</p>
                    <p className="text-zinc-500 text-xs mt-2">Assigned to {g.studentCount} students • Created {g.createdAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 rounded-lg text-sm font-black transition">Assign</button>
                    <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-black transition">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="text-xs font-black text-zinc-500 uppercase tracking-wider">
                <tr className="border-b border-zinc-800">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Completed</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-zinc-800 last:border-b-0 hover:bg-zinc-800/40 transition">
                    <td className="px-4 py-3 font-bold">{s.name}</td>
                    <td className="px-4 py-3 text-zinc-400 text-sm">{s.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-md text-xs font-black">
                        {s.totalScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold">{s.gamesCompleted}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/teacher/students/${s.id}/sessions`)}
                        className="text-sky-400 hover:text-sky-300 text-sm font-black"
                      >
                        View Progress →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <p className="text-xs font-bold text-zinc-500 mb-1">{label}</p>
      <p className={`text-4xl font-black ${accent}`}>{value}</p>
    </div>
  );
}
