import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateGame() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const handleCreate = () => {
    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }
    console.log("Create game:", { title, description, content });
    // TODO: Send to API
    navigate("/teacher/dashboard");
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Navbar */}
      <nav className="bg-neutral-800 border-b border-neutral-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Create Game</h1>
          <button
            onClick={() => navigate("/teacher/dashboard")}
            className="text-neutral-400 hover:text-white"
          >
            ← Back
          </button>
        </div>
      </nav>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-neutral-800 p-8 rounded-lg space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Game Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Array Basics"
              className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what students will learn"
              rows={3}
              className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Game Content (JSON)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='{"questions": [], "answers": []}'
              rows={10}
              className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 font-mono text-sm"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCreate}
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition"
            >
              Create Game
            </button>
            <button
              onClick={() => navigate("/teacher/dashboard")}
              className="flex-1 px-6 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg font-medium transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}