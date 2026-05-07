import React, { useEffect, useRef, useState } from "react";
import type { GameProps } from "@codequest/games-sdk";
import { MISSIONS, RANKS, HINT_XP_COSTS, getRank } from "./levels";
import { runMission, type RunResult } from "./engine/testRunner";
import { analyzeError } from "./engine/errorAnalyzer";
import { MissionScene, type SceneStatus } from "./ui/MissionScene";
import { HintSystem } from "./ui/HintSystem";
import { RewardOverlay } from "./ui/RewardOverlay";
import { LiveConsole } from "./ui/LiveConsole";

// ─── Hacker terminal component ────────────────────────────────────────────────
function HackerTerminal({
  value,
  onChange,
  shaking,
}: {
  value: string;
  onChange: (v: string) => void;
  shaking: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Keep textarea auto-height
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <div
      className={`relative flex flex-col rounded-lg overflow-hidden border transition-all duration-300 ${shaking ? "animate-shake border-red-500/60" : "border-cyan-900/50 hover:border-cyan-700/50"}`}
      style={{
        background: "#06111e",
        boxShadow: shaking
          ? "0 0 20px rgba(239,68,68,0.2) inset"
          : "0 0 20px rgba(6,182,212,0.05) inset",
      }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-cyan-900/40 bg-black/30 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <span className="ml-1 text-xs text-cyan-700 font-mono tracking-wider">
          hacker_terminal.js
        </span>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-glow-pulse" />
          <span className="text-xs text-cyan-700 font-mono">LIVE</span>
        </div>
      </div>

      {/* Code area */}
      <div className="flex flex-1 min-h-0 overflow-auto">
        {/* Line numbers */}
        <div
          className="shrink-0 select-none px-3 py-4 text-right font-mono text-xs leading-6 border-r border-cyan-900/30 min-w-[2.5rem]"
          style={{ color: "#1e4060", background: "rgba(0,0,0,0.2)" }}
        >
          {value.split("\n").map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          className="flex-1 px-4 py-4 font-mono text-sm leading-6 resize-none focus:outline-none bg-transparent"
          style={{
            color: "#7dd3fc",
            caretColor: "#22d3ee",
            minHeight: "100%",
            tabSize: 2,
          }}
          onKeyDown={(e) => {
            // Tab inserts spaces instead of moving focus
            if (e.key === "Tab") {
              e.preventDefault();
              const start = e.currentTarget.selectionStart;
              const end = e.currentTarget.selectionEnd;
              const next = value.substring(0, start) + "  " + value.substring(end);
              onChange(next);
              requestAnimationFrame(() => {
                if (ref.current) {
                  ref.current.selectionStart = start + 2;
                  ref.current.selectionEnd = start + 2;
                }
              });
            }
          }}
        />
      </div>
    </div>
  );
}

// ─── XP bar ───────────────────────────────────────────────────────────────────
function XPBar({
  totalXP,
  animated,
}: {
  totalXP: number;
  animated: boolean;
}) {
  const rank = getRank(totalXP);
  const rankIndex = RANKS.findIndex((r) => r.name === rank.name);
  const nextRank = RANKS[rankIndex + 1];
  const progress = nextRank
    ? Math.min(
        100,
        Math.round(
          ((totalXP - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100
        )
      )
    : 100;

  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className={`text-xs font-bold shrink-0 ${rank.color}`}>
        {rank.name}
      </span>
      <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden shrink-0">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${animated ? "bg-cyan-400" : "bg-cyan-600"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-slate-500 shrink-0">{totalXP} XP</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export const CodeBreakerComponent: React.FC<GameProps> = ({
  level,
  onLevelComplete,
  onMentorRequest,
  onExit,
}) => {
  const mission = MISSIONS[level - 1];

  // Per-level state
  const [code, setCode] = useState(mission?.starterCode ?? "");
  const [liveData, setLiveData] = useState<Record<string, unknown>>({});
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [showReward, setShowReward] = useState(false);
  const [pendingReward, setPendingReward] = useState<{
    xp: number;
    diamonds: number;
    bonuses: string[];
  } | null>(null);
  const [shaking, setShaking] = useState(false);
  const [showObjectives, setShowObjectives] = useState(false);

  // Session state (persists across levels)
  const [totalXP, setTotalXP] = useState(0);
  const [totalDiamonds, setTotalDiamonds] = useState(0);
  const [xpJustChanged, setXpJustChanged] = useState(false);

  useEffect(() => {
    if (mission) {
      setCode(mission.starterCode);
      setLiveData({});
      setRunResult(null);
      setAttempts(0);
      setHintsRevealed(0);
      setStartTime(Date.now());
      setShowReward(false);
      setPendingReward(null);
      setShaking(false);
    }
  }, [level]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced live extraction — updates the scene and console as student types
  useEffect(() => {
    if (!mission) return;
    const timer = setTimeout(() => {
      setLiveData(mission.liveExtract(code));
    }, 200);
    return () => clearTimeout(timer);
  }, [code, mission]);

  // All missions done
  if (!mission) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white"
        style={{ background: "radial-gradient(ellipse at 50% 40%, #1a0d2e 0%, #04020a 100%)" }}>
        <div className="text-center px-6">
          <div className="text-8xl mb-6 animate-bounce">🏆</div>
          <h1 className="text-5xl font-black text-yellow-400 mb-3 tracking-wider">
            HEIST COMPLETE!
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            You cracked every vault. The diamonds are yours.
          </p>
          <p className="text-slate-500 text-sm mb-10">
            {totalXP} XP earned &nbsp;·&nbsp; {totalDiamonds} 💎 collected
          </p>
          <button
            onClick={onExit}
            className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-2xl transition-colors"
            style={{ boxShadow: "0 0 30px rgba(16,185,129,0.4)" }}
          >
            → Return to Base
          </button>
        </div>
      </div>
    );
  }

  const sceneStatus: SceneStatus =
    runResult === null ? "idle" : runResult.passed ? "success" : "error";

  // ── Handlers ──────────────────────────────────────────────────────────────
  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  const handleRun = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const result = runMission(mission, code);
    setRunResult(result);

    if (result.passed) {
      const timeSeconds = Math.floor((Date.now() - startTime) / 1000);
      const bonuses: string[] = [];
      let bonusXP = 0;

      if (newAttempts === 1) { bonuses.push("First Try! +30 XP");  bonusXP += 30; }
      if (hintsRevealed === 0) { bonuses.push("No Hints! +20 XP"); bonusXP += 20; }
      if (timeSeconds < 90) { bonuses.push("Speed Hacker! +20 XP"); bonusXP += 20; }

      const hintPenalty = HINT_XP_COSTS.slice(0, hintsRevealed).reduce(
        (a, b) => a + b,
        0
      );
      const xpEarned = Math.max(10, mission.xpBase + bonusXP - hintPenalty);
      const diamondsEarned = mission.diamondBase + (timeSeconds < 90 ? 3 : 0);

      setTotalXP((prev) => prev + xpEarned);
      setTotalDiamonds((prev) => prev + diamondsEarned);
      setXpJustChanged(true);
      setTimeout(() => setXpJustChanged(false), 1500);

      setPendingReward({ xp: xpEarned, diamonds: diamondsEarned, bonuses });
      setTimeout(() => setShowReward(true), 800);
    } else {
      triggerShake();
    }
  };

  const handleRevealHint = () => {
    if (hintsRevealed >= mission.hints.length) return;
    setHintsRevealed((h) => h + 1);
    onMentorRequest({
      level,
      goal: mission.concept,
      currentCode: code,
      errorMessage:
        runResult?.error ??
        runResult?.checkResults.find((c) => !c.passed)?.failHint,
    });
  };

  const handleContinue = () => {
    setShowReward(false);
    onLevelComplete({
      level,
      passed: true,
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
      attempts,
      artifact: code,
      hintsUsed: hintsRevealed,
    });
  };

  const failedCheck = runResult?.checkResults.find((c) => !c.passed);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col text-white overflow-hidden"
      style={{ background: "#04080f" }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="shrink-0 px-4 py-2.5 flex items-center justify-between gap-4 border-b border-white/5"
        style={{ background: "rgba(4,8,15,0.95)" }}>
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onExit}
            className="text-slate-600 hover:text-slate-300 text-sm transition-colors shrink-0"
          >
            ✕
          </button>
          <span
            className="font-black text-base tracking-wider shrink-0"
            style={{ color: "#7dd3fc", textShadow: "0 0 10px rgba(125,211,252,0.4)" }}
          >
            💎 CODEBREAKER
          </span>
          <span className="text-slate-700 shrink-0">›</span>
          <span className="text-slate-300 text-sm truncate">{mission.title}</span>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <XPBar totalXP={totalXP} animated={xpJustChanged} />
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 text-sm font-bold"
            style={{ background: "rgba(37,99,235,0.1)", color: "#93c5fd" }}
          >
            💎 {totalDiamonds}
          </div>
        </div>
      </header>

      {/* ── MISSION SCENE (hero) ─────────────────────────────────────────── */}
      <div
        className="shrink-0 w-full relative"
        style={{ height: "clamp(180px, 38vh, 340px)" }}
      >
        <MissionScene scene={mission.scene} status={sceneStatus} liveData={liveData} />

        {/* Mission progress pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 border border-white/10 text-xs font-mono">
          <span className="text-slate-400">MISSION</span>
          <span className="text-cyan-400 font-bold">{level}/{MISSIONS.length}</span>
          <div className="flex gap-1 ml-1">
            {MISSIONS.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i < level - 1
                    ? "bg-emerald-400"
                    : i === level - 1
                      ? "bg-cyan-400 animate-glow-pulse"
                      : "bg-slate-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Concept badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 border border-cyan-500/30 text-xs font-bold text-cyan-400 font-mono">
          {mission.subtitle}
        </div>
      </div>

      {/* ── Mission brief ────────────────────────────────────────────────── */}
      <div className="shrink-0 px-4 py-3 border-y border-white/5"
        style={{ background: "rgba(6,11,20,0.8)" }}>
        <p className="text-sm text-slate-300 leading-relaxed">
          <span className="text-cyan-500 font-bold font-mono mr-2">
            [INTEL]
          </span>
          {mission.missionBrief.replace(/^[^\s]+\s/, "")}
        </p>
      </div>

      {/* ── Bottom: terminal + objectives ────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 gap-0">
        {/* Left: Terminal */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0 p-4 gap-3">
          {/* Terminal */}
          <div className="flex-1 min-h-0" style={{ minHeight: "200px" }}>
            <HackerTerminal
              value={code}
              onChange={setCode}
              shaking={shaking}
            />
          </div>

          {/* Security console — live reactive feed */}
          <div className="shrink-0">
            <LiveConsole scene={mission.scene} liveData={liveData} runResult={runResult} />
          </div>

          {/* Error / output panel */}
          {runResult && (
            <div
              className={`shrink-0 rounded-lg border p-3 text-sm font-mono transition-all duration-300 max-h-32 overflow-y-auto ${
                runResult.error
                  ? "border-red-500/30 bg-red-950/30 text-red-300"
                  : runResult.passed
                    ? "border-emerald-500/30 bg-emerald-950/30 text-emerald-300"
                    : "border-slate-700/50 bg-slate-900/50 text-slate-300"
              }`}
            >
              {runResult.error ? (
                <pre className="whitespace-pre-wrap leading-relaxed text-xs">
                  {analyzeError(runResult.error)}
                </pre>
              ) : runResult.passed ? (
                <p className="font-bold">✓ All checks passed! Mission complete.</p>
              ) : (
                <>
                  {runResult.output.length > 0 && (
                    <div className="mb-2 space-y-0.5 text-xs text-slate-400">
                      {runResult.output.map((line, i) => (
                        <div key={i}>
                          <span className="text-slate-600 mr-2">›</span>
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                  {failedCheck && (
                    <p className="text-amber-300 text-xs">
                      ⚠ {failedCheck.failHint}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* Control bar */}
          <div className="shrink-0 flex gap-2">
            <button
              onClick={handleRun}
              disabled={runResult?.passed}
              className="flex-1 py-3 rounded-xl font-black text-sm tracking-wider uppercase transition-all duration-200 disabled:opacity-50 active:scale-95"
              style={
                runResult?.passed
                  ? { background: "#1a3a2a", color: "#4ade80", border: "1px solid #166534" }
                  : {
                      background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                      color: "white",
                      boxShadow: "0 0 20px rgba(5,150,105,0.4), 0 4px 15px rgba(0,0,0,0.4)",
                      border: "1px solid rgba(52,211,153,0.3)",
                    }
              }
            >
              {runResult?.passed ? "✓ HACKED!" : "▶▶ HACK IT!"}
            </button>

            <button
              onClick={handleRevealHint}
              disabled={hintsRevealed >= mission.hints.length}
              className="px-4 py-3 rounded-xl font-bold text-xs transition-all border border-amber-600/30 disabled:opacity-30 active:scale-95"
              style={{ background: "rgba(120,53,15,0.2)", color: "#fbbf24" }}
            >
              💡 {hintsRevealed > 0 ? `${hintsRevealed}/${mission.hints.length}` : "Hint"}
            </button>

            <button
              onClick={() => { setCode(mission.starterCode); setRunResult(null); }}
              title="Reset code"
              className="px-3 py-3 rounded-xl text-slate-600 hover:text-slate-400 transition-colors border border-slate-800 hover:border-slate-700"
            >
              ↺
            </button>
          </div>
        </div>

        {/* Right: Objectives + Hints */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-white/5">
          {/* Mobile toggle */}
          <button
            className="lg:hidden w-full px-4 py-2.5 text-left text-xs text-slate-400 border-b border-white/5 flex items-center justify-between"
            onClick={() => setShowObjectives((v) => !v)}
          >
            <span>Objectives & Hints</span>
            <span>{showObjectives ? "▲" : "▼"}</span>
          </button>

          <div className={`lg:block ${showObjectives ? "block" : "hidden"} overflow-y-auto`}
            style={{ maxHeight: "clamp(200px, 40vh, 500px)" }}>
            {/* Objectives */}
            <div className="p-4 border-b border-white/5">
              <p className="text-xs text-slate-600 font-mono uppercase tracking-wider mb-3">
                Objectives
              </p>
              <div className="space-y-3">
                {mission.checks.map((check, i) => {
                  const res = runResult?.checkResults[i];
                  const icon = !runResult ? "○" : res?.passed ? "✓" : "✗";
                  const col = !runResult
                    ? "text-slate-600"
                    : res?.passed
                      ? "text-emerald-400"
                      : "text-red-400";
                  return (
                    <div key={i} className="flex gap-2.5">
                      <span className={`font-black shrink-0 text-sm ${col}`}>
                        {icon}
                      </span>
                      <div>
                        <p className={`text-xs leading-relaxed ${col}`}>
                          {check.description}
                        </p>
                        {res && !res.passed && (
                          <p className="text-xs text-amber-400/70 mt-1 leading-relaxed">
                            {check.failHint}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hints */}
            <div className="p-4">
              <HintSystem
                hints={mission.hints}
                revealed={hintsRevealed}
                onReveal={handleRevealHint}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-white/5 px-4 py-2 flex gap-3 text-xs text-slate-700 font-mono">
            <span>attempts: <strong className="text-slate-500">{attempts}</strong></span>
            <span>hints: <strong className="text-slate-500">{hintsRevealed}</strong></span>
          </div>
        </div>
      </div>

      {/* ── Reward overlay ──────────────────────────────────────────────── */}
      {showReward && pendingReward && (
        <RewardOverlay
          xpEarned={pendingReward.xp}
          diamonds={pendingReward.diamonds}
          bonuses={pendingReward.bonuses}
          rank={getRank(totalXP)}
          missionTitle={mission.title}
          isLastMission={level >= MISSIONS.length}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};
