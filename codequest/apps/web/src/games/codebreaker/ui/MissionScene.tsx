import React from "react";
import type { SceneType } from "../levels";

export type SceneStatus = "idle" | "success" | "error";

interface SceneProps {
  status: SceneStatus;
}

// ─── Shared particles that float up on success ────────────────────────────────
function SuccessParticles({
  items,
  positions,
}: {
  items: string[];
  positions: number[];
}) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((item, i) => (
        <span
          key={i}
          className="absolute text-2xl animate-float-up"
          style={{
            left: `${positions[i]}%`,
            bottom: "25%",
            animationDelay: `${i * 180}ms`,
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

// ─── VAULT SCENE ──────────────────────────────────────────────────────────────
function VaultScene({ status }: SceneProps) {
  const open = status === "success";
  const denied = status === "error";

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center gap-4 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 60%, #1a2a40 0%, #080f1a 100%)",
      }}
    >
      {/* Decorative grid lines */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(96,165,250,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Vault frame */}
      <div
        className="relative z-10 transition-all duration-500"
        style={{
          filter: open
            ? "drop-shadow(0 0 30px rgba(16,185,129,0.6))"
            : denied
              ? "drop-shadow(0 0 20px rgba(239,68,68,0.5))"
              : "drop-shadow(0 0 15px rgba(59,130,246,0.3))",
        }}
      >
        {/* Vault door */}
        <div className="relative w-52 h-40 bg-slate-900 rounded-lg border-4 border-slate-600 overflow-hidden">
          {/* Left door half */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-[50.5%] flex flex-col justify-between py-2 px-1.5 transition-transform duration-700 ease-in-out ${
              open ? "-translate-x-full" : ""
            }`}
            style={{
              background: "linear-gradient(135deg, #374151 0%, #1f2937 100%)",
              borderRight: "2px solid #4b5563",
            }}
          >
            {[0, 1, 2].map((r) => (
              <div key={r} className="flex justify-between">
                {[0, 1].map((c) => (
                  <div
                    key={c}
                    className="w-3 h-3 rounded-full bg-slate-500 border-2 border-slate-400"
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Right door half */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-[50.5%] flex flex-col justify-between py-2 px-1.5 transition-transform duration-700 ease-in-out ${
              open ? "translate-x-full" : ""
            }`}
            style={{
              background: "linear-gradient(225deg, #374151 0%, #1f2937 100%)",
              borderLeft: "2px solid #4b5563",
            }}
          >
            {[0, 1, 2].map((r) => (
              <div key={r} className="flex justify-between">
                {[0, 1].map((c) => (
                  <div
                    key={c}
                    className="w-3 h-3 rounded-full bg-slate-500 border-2 border-slate-400"
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Combination dial (hidden when open) */}
          {!open && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="relative w-14 h-14">
                <div
                  className="w-full h-full rounded-full border-4 border-slate-400 bg-slate-700 animate-spin-slow"
                  style={{ animationPlayState: denied ? "paused" : "running" }}
                />
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-slate-200 rounded-full" />
                <div className="absolute inset-2 rounded-full border-2 border-slate-500" />
              </div>
            </div>
          )}

          {/* Diamond revealed */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center z-30 transition-all duration-500 ${
              open ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            style={{ transitionDelay: open ? "400ms" : "0ms" }}
          >
            <div
              className="text-6xl animate-bounce"
              style={{ filter: "drop-shadow(0 0 20px rgba(147,197,253,0.9))" }}
            >
              💎
            </div>
          </div>

          {/* Error X overlay */}
          {denied && (
            <div className="absolute inset-0 flex items-center justify-center z-30 bg-red-900/30">
              <span className="text-4xl font-black text-red-400 animate-shake">
                ✗
              </span>
            </div>
          )}
        </div>

        {/* Neon frame accent */}
        <div
          className={`absolute -inset-1 rounded-xl border-2 transition-colors duration-500 ${
            open
              ? "border-emerald-400/60"
              : denied
                ? "border-red-500/60"
                : "border-blue-500/20"
          }`}
        />
      </div>

      {/* Status label */}
      <p
        className={`relative z-10 text-sm font-bold tracking-wider uppercase transition-colors duration-300 ${
          open
            ? "text-emerald-400"
            : denied
              ? "text-red-400 animate-shake"
              : "text-blue-300/60"
        }`}
      >
        {open ? "✓ Vault Cracked!" : denied ? "✗ Access Denied" : "🔐 Vault Locked"}
      </p>

      {/* Floating particles on success */}
      {open && (
        <SuccessParticles
          items={["💎", "⭐", "✨", "💎", "⭐", "✨"]}
          positions={[10, 25, 40, 55, 70, 85]}
        />
      )}
    </div>
  );
}

// ─── CAMERA SCENE ─────────────────────────────────────────────────────────────
function CameraScene({ status }: SceneProps) {
  const sleeping = status === "success";
  const alert = status !== "success";

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center gap-3 overflow-hidden"
      style={{
        background: sleeping
          ? "radial-gradient(ellipse at 50% 50%, #0f2010 0%, #070d08 100%)"
          : "radial-gradient(ellipse at 50% 40%, #2a0f0f 0%, #0d0707 100%)",
        transition: "background 1s ease",
      }}
    >
      {/* Ambient glow */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${alert ? "opacity-100" : "opacity-0"}`}
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(239,68,68,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Camera body */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        {/* Sweep beam (only when alert) */}
        {alert && (
          <div
            className="absolute -top-2 left-1/2 w-0.5 h-28 origin-bottom animate-scan-beam"
            style={{
              background:
                "linear-gradient(to top, rgba(239,68,68,0.8), transparent)",
              transformOrigin: "50% 100%",
            }}
          />
        )}

        {/* Camera housing */}
        <div
          className={`relative transition-all duration-700 ${sleeping ? "grayscale opacity-60" : ""}`}
        >
          {/* Camera body */}
          <div className="w-20 h-14 rounded-lg bg-slate-700 border-2 border-slate-500 flex items-center justify-center relative">
            {/* Lens */}
            <div
              className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                sleeping
                  ? "border-slate-500 bg-slate-600"
                  : "border-red-500 bg-red-900/50 animate-glow-pulse"
              }`}
              style={{
                boxShadow: sleeping
                  ? "none"
                  : "0 0 15px rgba(239,68,68,0.6)",
              }}
            >
              <div
                className={`w-4 h-4 rounded-full transition-all duration-500 ${
                  sleeping ? "bg-slate-500 scale-50" : "bg-red-500"
                }`}
              />
            </div>
            {/* Mount */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-600 border-2 border-slate-500 rounded-sm" />
          </div>
        </div>

        {/* ZZZ bubbles on sleep */}
        {sleeping && (
          <div className="absolute -top-4 right-2 flex flex-col items-end gap-1">
            {["z", "z", "Z"].map((z, i) => (
              <span
                key={i}
                className="text-slate-400 font-bold animate-zzz-rise"
                style={{
                  fontSize: `${10 + i * 4}px`,
                  animationDelay: `${i * 400}ms`,
                  animationIterationCount: "infinite",
                }}
              >
                {z}
              </span>
            ))}
          </div>
        )}

        {/* Status badge */}
        <div
          className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-500 ${
            sleeping
              ? "bg-emerald-900/60 text-emerald-300 border border-emerald-500/30"
              : "bg-red-900/60 text-red-300 border border-red-500/40 animate-glow-pulse"
          }`}
          style={{
            boxShadow: sleeping
              ? "none"
              : "0 0 12px rgba(239,68,68,0.3)",
          }}
        >
          {sleeping ? "💤 SLEEPING" : "🔴 ALERT!"}
        </div>
      </div>
    </div>
  );
}

// ─── LOCKS SCENE ──────────────────────────────────────────────────────────────
function LocksScene({ status }: SceneProps) {
  const open = status === "success";

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center gap-5 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 50%, #0f1a2a 0%, #060c16 100%)",
      }}
    >
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,179,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,0.5) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Locks grid */}
      <div className="relative z-10 grid grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              open ? "" : "opacity-50"
            }`}
            style={{
              transitionDelay: open ? `${i * 60}ms` : "0ms",
            }}
          >
            <span
              className={`text-3xl ${open ? "animate-lock-pop" : ""}`}
              style={{
                animationDelay: open ? `${i * 60}ms` : "0ms",
                filter: open
                  ? "drop-shadow(0 0 8px rgba(52,211,153,0.7))"
                  : "none",
              }}
            >
              {open ? "🔓" : "🔒"}
            </span>
            <div
              className={`text-xs font-bold transition-colors duration-300 ${open ? "text-emerald-400" : "text-slate-600"}`}
              style={{ transitionDelay: open ? `${i * 60 + 200}ms` : "0ms" }}
            >
              #{i + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Counter */}
      <div
        className={`relative z-10 text-sm font-bold transition-all duration-500 ${
          open ? "text-emerald-400" : "text-blue-300/50"
        }`}
      >
        {open ? "✓ ALL 10 LOCKS OPENED!" : "🔒 10/10 locks remaining"}
      </div>

      {open && (
        <SuccessParticles
          items={["🔓", "⭐", "✨", "🔓", "⭐"]}
          positions={[15, 30, 50, 65, 80]}
        />
      )}
    </div>
  );
}

// ─── DRONE SCENE ──────────────────────────────────────────────────────────────
function DroneScene({ status }: SceneProps) {
  const flying = status === "success";

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center gap-4 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 60%, #0a1f1a 0%, #060c0a 100%)",
      }}
    >
      {/* Stars / dots */}
      {[15, 30, 50, 70, 85].map((x) =>
        [20, 45, 70].map((y) => (
          <div
            key={`${x}-${y}`}
            className="absolute w-1 h-1 rounded-full bg-cyan-400/20"
            style={{ left: `${x}%`, top: `${y}%` }}
          />
        ))
      )}

      {/* Flight zone */}
      <div className="relative z-10 w-full px-8">
        {/* Launch pad */}
        <div className="absolute left-8 bottom-0 w-16 h-3 bg-cyan-900/50 border border-cyan-500/30 rounded flex items-center justify-center">
          <span className="text-xs text-cyan-400 font-mono">LAUNCH</span>
        </div>

        {/* Target zone */}
        <div className="absolute right-8 bottom-0 w-16 h-3 bg-emerald-900/50 border border-emerald-500/30 rounded flex items-center justify-center">
          <span className="text-xs text-emerald-400 font-mono">TARGET</span>
        </div>

        {/* Flight path */}
        <div className="relative h-20 flex items-center">
          <div
            className="absolute inset-x-12 top-1/2 border-t-2 border-dashed border-cyan-500/20"
          />

          {/* Distance markers */}
          {[0, 25, 50, 75, 100].map((pct, i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-full -translate-x-1/2"
              style={{ left: `${12 + pct * 0.76}%` }}
            >
              <div className="w-px h-2 bg-cyan-500/30 mb-0.5" />
              <span className="text-xs text-cyan-500/40 font-mono">{i}m</span>
            </div>
          ))}

          {/* Drone */}
          <div
            className={`absolute transition-none ${flying ? "animate-fly-across" : ""}`}
            style={{ left: "6%", top: "50%", transform: "translateY(-50%)" }}
          >
            <div className="relative">
              {/* Propeller arms */}
              <div className="absolute -top-3 left-0 right-0 flex justify-between px-1">
                <div
                  className="w-4 h-0.5 bg-slate-400 rounded-full animate-spin-fast"
                  style={{ transformOrigin: "right center" }}
                />
                <div
                  className="w-4 h-0.5 bg-slate-400 rounded-full animate-spin-fast"
                  style={{ transformOrigin: "left center", animationDirection: "reverse" }}
                />
              </div>
              {/* Body */}
              <div className="text-4xl" style={{ filter: flying ? "drop-shadow(0 0 10px rgba(6,182,212,0.7))" : "none" }}>
                🚁
              </div>
            </div>
          </div>
        </div>
      </div>

      <p
        className={`relative z-10 text-sm font-bold transition-colors ${
          flying ? "text-emerald-400" : "text-cyan-400/50"
        }`}
      >
        {flying ? "✓ Drone Successfully Programmed!" : "🚁 Drone Standing By"}
      </p>
    </div>
  );
}

// ─── BOSS SCENE ───────────────────────────────────────────────────────────────
function BossScene({ status }: SceneProps) {
  const defeated = status === "success";
  const fighting = status === "idle";

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center gap-4 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 40%, #1a0d2e 0%, #0a0614 100%)",
      }}
    >
      {/* Ambient lightning */}
      {fighting && (
        <div className="absolute inset-0 animate-glow-pulse"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(147,51,234,0.08) 0%, transparent 70%)" }}
        />
      )}

      {/* Battle arena */}
      <div className="relative z-10 flex items-end justify-between w-full px-6 pb-2">
        {/* Player */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`text-5xl transition-all duration-500 ${defeated ? "animate-bounce" : ""}`}
            style={{ filter: "drop-shadow(0 0 10px rgba(52,211,153,0.5))" }}
          >
            🧑‍💻
          </div>
          {/* Player HP */}
          <div className="w-20">
            <div className="flex justify-between text-xs text-slate-400 mb-0.5">
              <span className="font-mono">YOU</span>
              <span className="font-bold text-emerald-400">100</span>
            </div>
            <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full w-full bg-emerald-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center">
          <span
            className={`text-2xl font-black transition-all duration-300 ${defeated ? "text-emerald-400 scale-125" : "text-purple-400 animate-glow-pulse"}`}
          >
            {defeated ? "WIN!" : "⚔️"}
          </span>
        </div>

        {/* Robot */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`text-5xl transition-all duration-700 ${
              defeated ? "animate-explode opacity-0" : fighting ? "" : ""
            }`}
            style={{
              filter: defeated
                ? "none"
                : "drop-shadow(0 0 10px rgba(239,68,68,0.5))",
            }}
          >
            {defeated ? "💥" : "🤖"}
          </div>
          {/* Robot HP */}
          <div className="w-20">
            <div className="flex justify-between text-xs text-slate-400 mb-0.5">
              <span className="font-mono">ROBOT</span>
              <span className={`font-bold ${defeated ? "text-red-400" : "text-red-400"}`}>
                {defeated ? "0" : "100"}
              </span>
            </div>
            <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className={`h-full bg-red-500 rounded-full transition-none ${defeated ? "animate-hp-drain" : "w-full"}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Shield indicator */}
      {!defeated && (
        <div className="relative z-10 flex items-center gap-2 text-xs text-purple-300/60 font-mono">
          <span>🛡️</span>
          <span>SHIELD ACTIVE — damage halved</span>
        </div>
      )}

      {/* Defeated message */}
      {defeated && (
        <p className="relative z-10 text-sm font-bold text-emerald-400 animate-slide-up">
          ✓ Security Robot Defeated!
        </p>
      )}

      {defeated && (
        <SuccessParticles
          items={["⭐", "💥", "🏆", "⭐", "💥"]}
          positions={[10, 25, 45, 65, 80]}
        />
      )}
    </div>
  );
}

// ─── Exported shell ───────────────────────────────────────────────────────────
interface MissionSceneProps {
  scene: SceneType;
  status: SceneStatus;
}

const SCENES: Record<SceneType, React.FC<SceneProps>> = {
  vault: VaultScene,
  cameras: CameraScene,
  locks: LocksScene,
  drone: DroneScene,
  boss: BossScene,
};

export function MissionScene({ scene, status }: MissionSceneProps) {
  const Scene = SCENES[scene];
  return <Scene status={status} />;
}
