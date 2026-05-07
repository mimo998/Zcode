import { AppShell, RoleBadge } from "../components/AppShell";
import { useAuth } from "../auth";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  // Placeholder data — wire up to API later
  const stats = { totalScore: 1240, rank: 47, gamesCompleted: 8, streak: 5 };

  const recentGames = [
    { id: 1, title: "Array Basics", category: "Code", score: 95, emoji: "🔵", date: "Today" },
    { id: 2, title: "Loop Master", category: "Code", score: 78, emoji: "🔴", date: "Yesterday" },
    { id: 3, title: "Vocab Builder", category: "English", score: 88, emoji: "📖", date: "3 days ago" },
  ];

  const badges = [
    { id: 1, label: "Hot Start", emoji: "🔥", earned: true },
    { id: 2, label: "Loop Master", emoji: "🔁", earned: true },
    { id: 3, label: "Top Student", emoji: "⭐", earned: true },
    { id: 4, label: "Algo Champ", emoji: "🏆", earned: false },
    { id: 5, label: "Legend", emoji: "👑", earned: false },
  ];

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/15 via-zinc-900 to-sky-500/15 border border-zinc-800 p-8 mb-8">
          <div className="absolute inset-0 opacity-25 pointer-events-none"
               style={{ backgroundImage: "radial-gradient(circle at 20% 0%, rgba(16,185,129,.5), transparent 40%)" }} />
          <div className="relative flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center font-black text-zinc-950 text-3xl shadow-xl">
              {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black">{user.name}</h1>
                <RoleBadge role={user.role} />
              </div>
              <p className="text-zinc-400 text-sm">{user.email}</p>
              <p className="text-emerald-400 text-sm font-bold mt-1">Ranked #{stats.rank} 🏅</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Score" value={stats.totalScore.toLocaleString()} accent="text-emerald-400" />
          <StatCard label="Games Completed" value={stats.gamesCompleted} accent="text-sky-400" />
          <StatCard label="Day Streak" value={`🔥 ${stats.streak}`} accent="text-amber-400" />
          <StatCard label="Rank" value={`#${stats.rank}`} accent="text-rose-400" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
            <h3 className="text-lg font-black mb-4">Recent Games</h3>
            <div className="space-y-2">
              {recentGames.map((g) => (
                <div key={g.id} className="flex items-center gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800 hover:border-zinc-700 transition">
                  <div className="w-11 h-11 rounded-lg bg-zinc-800 flex items-center justify-center text-2xl">{g.emoji}</div>
                  <div className="flex-1">
                    <div className="font-bold">{g.title}</div>
                    <div className="text-xs text-zinc-500">{g.category} • {g.date}</div>
                  </div>
                  <div className="text-emerald-400 font-black">{g.score}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
            <h3 className="text-lg font-black mb-4">Badges</h3>
            <div className="grid grid-cols-3 gap-3">
              {badges.map((b) => (
                <div key={b.id} className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition ${
                  b.earned ? "bg-zinc-950 border-zinc-700" : "bg-zinc-950/50 border-zinc-800 opacity-40"
                }`}>
                  <span className="text-3xl">{b.emoji}</span>
                  <span className="text-[11px] font-bold text-center text-zinc-300">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
      <div className="text-xs font-bold text-zinc-500 mb-1">{label}</div>
      <div className={`text-2xl font-black ${accent}`}>{value}</div>
    </div>
  );
}
