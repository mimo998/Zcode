import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Game {
  id: string;
  title: string;
  category: string;
  image: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const GAMES: Game[] = [
  // Code Games
  { id: "1", title: "Array Basics", category: "Code", image: "🔵", difficulty: "Easy" },
  { id: "2", title: "Loop Master", category: "Code", image: "🔴", difficulty: "Medium" },
  { id: "3", title: "Recursion Quest", category: "Code", image: "🟡", difficulty: "Hard" },
  { id: "4", title: "Algorithm Race", category: "Code", image: "🟢", difficulty: "Medium" },
  { id: "5", title: "Data Structure", category: "Code", image: "🟣", difficulty: "Hard" },

  // Physics Games
  { id: "6", title: "Gravity Simulator", category: "Physics", image: "⚙️", difficulty: "Medium" },
  { id: "7", title: "Force Calculator", category: "Physics", image: "⚡", difficulty: "Hard" },
  { id: "8", title: "Motion Lab", category: "Physics", image: "🚀", difficulty: "Easy" },

  // English Games
  { id: "9", title: "Vocabulary Builder", category: "English", image: "📖", difficulty: "Easy" },
  { id: "10", title: "Grammar Challenge", category: "English", image: "✏️", difficulty: "Medium" },
  { id: "11", title: "Speed Reading", category: "English", image: "📚", difficulty: "Hard" },

  // Math Games
  { id: "12", title: "Calculus Quest", category: "Math", image: "📐", difficulty: "Hard" },
  { id: "13", title: "Algebra Master", category: "Math", image: "🔢", difficulty: "Medium" },
  { id: "14", title: "Geometry Pro", category: "Math", image: "🔺", difficulty: "Easy" },
];

const CATEGORIES = ["Code", "Physics", "English", "Math"];

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; score: number } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const gamesByCategory = CATEGORIES.map((cat) => ({
    category: cat,
    games: GAMES.filter((g) => g.category === cat),
  }));

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Navbar */}
      <nav className="bg-neutral-800 border-b border-neutral-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg">
              CQ
            </div>
            <h1 className="text-2xl font-bold">CodeQuest</h1>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium">Welcome, <span className="text-indigo-400">{user.name}</span></p>
                  <p className="text-xs text-neutral-400">Score: {user.score}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg font-medium transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2">Learn Through Games</h2>
          <p className="text-neutral-400">Master algorithms, physics, English and more</p>
        </div>

        {/* Game Categories */}
        <div className="space-y-12">
          {gamesByCategory.map(({ category, games }) => (
            <div key={category}>
              <h3 className="text-2xl font-bold mb-4 text-indigo-400">{category}</h3>
              
              {/* Horizontal Scroll */}
              <div className="overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex gap-6 min-w-min">
                  {games.map((game) => (
                    <div
                      key={game.id}
                      className="flex-shrink-0 w-48 bg-neutral-800 rounded-lg overflow-hidden hover:scale-105 transition transform duration-300 cursor-pointer group"
                      onClick={() => console.log("Play", game.title)}
                    >
                      {/* Game Image */}
                      <div className="w-full h-32 bg-neutral-700 flex items-center justify-center text-6xl group-hover:bg-neutral-600 transition">
                        {game.image}
                      </div>

                      {/* Game Info */}
                      <div className="p-4">
                        <h4 className="font-bold text-lg mb-1">{game.title}</h4>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs px-2 py-1 rounded ${
                            game.difficulty === "Easy"
                              ? "bg-green-900 text-green-200"
                              : game.difficulty === "Medium"
                              ? "bg-yellow-900 text-yellow-200"
                              : "bg-red-900 text-red-200"
                          }`}>
                            {game.difficulty}
                          </span>
                          <span className="text-xs text-neutral-400">▶ Play</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Custom Scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}