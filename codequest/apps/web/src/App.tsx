import { useEffect, useState } from "react";

type ApiHealth = { ok: boolean; service: string; uptime: number };

export default function App() {
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health")
      .then((r) => {
        if (!r.ok) throw new Error(`API returned ${r.status}`);
        return r.json() as Promise<ApiHealth>;
      })
      .then((data) => {
        if (!cancelled) setHealth(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
          The platform skeleton is running. This page only exists to prove the stack works
          end-to-end. The real lobby UI is{" "}
          <a
            href="https://github.com"
            className="text-indigo-600 underline underline-offset-2"
          >
            issue #5
          </a>
          .
        </p>

        <div className="rounded-lg border border-neutral-200 p-4 text-sm">
          <p className="font-medium mb-2">API health check</p>
          {!health && !error && <p className="text-neutral-500">Pinging /api/health…</p>}
          {error && (
            <p className="text-red-600">
              Couldn&apos;t reach the API: {error}. Is{" "}
              <code className="px-1 bg-neutral-100 rounded">pnpm dev:api</code> running?
            </p>
          )}
          {health && (
            <pre className="text-neutral-700 whitespace-pre-wrap">
              {JSON.stringify(health, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
