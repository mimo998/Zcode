import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const [games, setGames] = useState<Game[]>([
    {
      id: 1,
      title: "Array Basics",
      description: "Learn basic array operations",
      studentCount: 15,
      createdAt: "2025-01-10",
    },
  ]);
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Ahmed", email: "ahmed@example.com", totalScore: 450, gamesCompleted: 3 },
    { id: 2, name: "Sara", email: "sara@example.com", totalScore: 520, gamesCompleted: 4 },
    { id: 3, name: "Omar", email: "omar@example.com", totalScore: 380, gamesCompleted: 2 },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleCreateGame = () => {
    navigate("/teacher/create-game");
  };

  const handleAssignGame = (gameId: number) => {
    console.log("Assign game", gameId);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Navbar */}
      <nav className="bg-neutral-800 border-b border-neutral-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold">
              CQ
            </div>
            <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-neutral-700">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "overview"
                ? "border-b-2 border-indigo-600 text-indigo-400"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("games")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "games"
                ? "border-b-2 border-indigo-600 text-indigo-400"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Games
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "students"
                ? "border-b-2 border-indigo-600 text-indigo-400"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Students
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-neutral-800 p-6 rounded-lg">
              <p className="text-neutral-400 mb-2">Total Students</p>
              <p className="text-4xl font-bold text-indigo-400">{students.length}</p>
            </div>
            <div className="bg-neutral-800 p-6 rounded-lg">
              <p className="text-neutral-400 mb-2">Games Created</p>
              <p className="text-4xl font-bold text-green-400">{games.length}</p>
            </div>
            <div className="bg-neutral-800 p-6 rounded-lg">
              <p className="text-neutral-400 mb-2">Avg. Score</p>
              <p className="text-4xl font-bold text-blue-400">
                {Math.round(students.reduce((acc, s) => acc + s.totalScore, 0) / students.length)}
              </p>
            </div>
          </div>
        )}

        {/* Games Tab */}
        {activeTab === "games" && (
          <div>
            <button
              onClick={handleCreateGame}
              className="mb-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition"
            >
              + Create New Game
            </button>

            <div className="space-y-4">
              {games.map((game) => (
                <div key={game.id} className="bg-neutral-800 p-6 rounded-lg flex justify-between items-center hover:bg-neutral-700 transition">
                  <div>
                    <h3 className="text-xl font-bold">{game.title}</h3>
                    <p className="text-neutral-400 text-sm mt-1">{game.description}</p>
                    <p className="text-neutral-500 text-xs mt-2">
                      Assigned to {game.studentCount} students • Created {game.createdAt}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAssignGame(game.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
                    >
                      Assign
                    </button>
                    <button className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg font-medium transition">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Total Score</th>
                  <th className="text-left py-3 px-4">Games Completed</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-neutral-700 hover:bg-neutral-800 transition">
                    <td className="py-3 px-4">{student.name}</td>
                    <td className="py-3 px-4 text-neutral-400">{student.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-indigo-900 text-indigo-200 rounded-full text-sm">
                        {student.totalScore}
                      </span>
                    </td>
                    <td className="py-3 px-4">{student.gamesCompleted}</td>
                    <td className="py-3 px-4">
                      <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                        View Progress
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}