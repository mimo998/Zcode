export type SceneType = "vault" | "cameras" | "locks" | "drone" | "boss";

export interface CheckItem {
  description: string;
  /** JS expression evaluated inside the student's code scope — must be truthy to pass. */
  expression: string;
  failHint: string;
}

export interface MissionLevel {
  id: number;
  scene: SceneType;
  title: string;
  subtitle: string;
  concept: string;
  missionBrief: string;
  starterCode: string;
  checks: CheckItem[];
  hints: string[];
  xpBase: number;
  diamondBase: number;
}

export interface RankInfo {
  name: string;
  minXP: number;
  color: string;
}

export const RANKS: RankInfo[] = [
  { name: "Rookie Hacker", minXP: 0, color: "text-slate-400" },
  { name: "Script Kiddie", minXP: 150, color: "text-blue-400" },
  { name: "Code Breaker", minXP: 400, color: "text-cyan-400" },
  { name: "Vault Cracker", minXP: 750, color: "text-purple-400" },
  { name: "Elite Ghost", minXP: 1200, color: "text-yellow-400" },
];

export function getRank(xp: number): RankInfo {
  return [...RANKS].reverse().find((r) => xp >= r.minXP) ?? RANKS[0]!;
}

/** XP cost for each successive hint (index = hint number, 0-based). */
export const HINT_XP_COSTS = [0, 10, 20, 30, 50];

export const MISSIONS: MissionLevel[] = [
  // ─── LEVEL 1 ───────────────────────────────────────────────────────────────
  {
    id: 1,
    scene: "vault",
    title: "Mission 1: The Vault",
    subtitle: "Variables & Math",
    concept: "Variables + Addition",
    missionBrief:
      "🏦 Intel: Pinnacle Bank's vault opens only when the security code totals exactly 100. " +
      "Two components make up the code — diamond weight and gold bars. " +
      "Change the numbers below so they add up to 100.",
    starterCode: `// The vault door opens only when total === 100
// Change the two numbers so they add up to exactly 100

let diamond_weight = 50;  // ← Change this
let gold_bars      = 30;  // ← Change this

let total = diamond_weight + gold_bars;

console.log("Diamond weight:", diamond_weight);
console.log("Gold bars:", gold_bars);
console.log("Total:", total);`,
    checks: [
      {
        description: "Both values are numbers",
        expression:
          'typeof diamond_weight === "number" && typeof gold_bars === "number"',
        failHint:
          "Make sure diamond_weight and gold_bars are plain numbers (no quotes around them).",
      },
      {
        description: "Total equals exactly 100",
        expression: "total === 100",
        failHint:
          "The total must be exactly 100. Does diamond_weight + gold_bars = 100?",
      },
    ],
    hints: [
      "💡 You need two numbers that add up to 100. For example: 60 + 40 = 100.",
      "💡 Try: diamond_weight = 60, gold_bars = 40. Check: 60 + 40 = 100 ✓",
      "💡 Any pair works: 70 + 30, 55 + 45, or even 1 + 99.",
      "💡 Solution: diamond_weight = 60, gold_bars = 40.",
    ],
    xpBase: 100,
    diamondBase: 5,
  },

  // ─── LEVEL 2 ───────────────────────────────────────────────────────────────
  {
    id: 2,
    scene: "cameras",
    title: "Mission 2: Kill the Cameras",
    subtitle: "if / else Conditions",
    concept: "Conditions (if / else)",
    missionBrief:
      "📷 Intel: Security cameras stay awake unless they detect it's after 10 pm (hour 22+). " +
      "The monitoring code has a bug — the condition is backwards. " +
      "Fix the operator so the camera goes to sleep during the heist!",
    starterCode: `let hour = 23; // The heist starts at 11 pm
let camera_status = "ALERT";

// BUG: the condition is wrong — fix the operator!
// The camera should sleep when hour is 22 or later

if (hour < 22) {        // ← Wrong operator! Fix this.
  camera_status = "sleeping";
} else {
  camera_status = "ALERT! INTRUDER!";
}

console.log("Camera status:", camera_status);`,
    checks: [
      {
        description: 'camera_status is "sleeping"',
        expression: 'camera_status === "sleeping"',
        failHint:
          'When hour is 23, camera_status should be "sleeping". Is the < operator correct here?',
      },
    ],
    hints: [
      '💡 The camera should sleep when hour is 22 OR MORE. What operator means "greater than or equal to"?',
      "💡 JavaScript operators: < (less than)  > (greater than)  <= (≤)  >= (≥)",
      '💡 Change < to >= in the if condition. Now: hour (23) >= 22 → true → camera_status = "sleeping".',
      '💡 Solution: change "hour < 22" to "hour >= 22".',
    ],
    xpBase: 130,
    diamondBase: 7,
  },

  // ─── LEVEL 3 ───────────────────────────────────────────────────────────────
  {
    id: 3,
    scene: "locks",
    title: "Mission 3: Ten Locks",
    subtitle: "for Loops",
    concept: "Loops (for)",
    missionBrief:
      "🔒 Intel: The corridor has 10 electromagnetic locks. " +
      "Your lock-pick device loops through them automatically — but it's misconfigured and only opens 5. " +
      "Fix the loop so it opens all 10 locks.",
    starterCode: `let locks_opened = 0;

// This loop only runs 5 times — fix it to run 10 times!
// A for loop "for (let i = 0; i < N; i++)" runs exactly N times.

for (let i = 0; i < 5; i++) {   // ← Change 5 to the right number
  locks_opened = locks_opened + 1;
  console.log("🔓 Opened lock #" + (i + 1));
}

console.log("Total locks opened:", locks_opened);`,
    checks: [
      {
        description: "All 10 locks are opened",
        expression: "locks_opened === 10",
        failHint:
          "The loop needs to run exactly 10 times. Change the limit number in i < ??? to 10.",
      },
    ],
    hints: [
      "💡 A for loop `for (let i = 0; i < N; i++)` runs exactly N times.",
      "💡 Right now N = 5, so it runs 5 times. Change N to run 10 times.",
      "💡 i < 10 counts: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 — that's 10 iterations.",
      '💡 Solution: change "i < 5" to "i < 10".',
    ],
    xpBase: 150,
    diamondBase: 8,
  },

  // ─── LEVEL 4 ───────────────────────────────────────────────────────────────
  {
    id: 4,
    scene: "drone",
    title: "Mission 4: The Drone",
    subtitle: "Functions",
    concept: "Functions",
    missionBrief:
      "🚁 Intel: Your stealth drone needs a flight computer. " +
      "The rule is simple: flying 1 metre takes 2 seconds. " +
      "Write the body of fly_drone() so it calculates the total flight time for any distance and returns it.",
    starterCode: `// Program the drone's flight computer!
// Rule: 1 metre = 2 seconds of flight time
// So:   5 metres = 10 seconds

function fly_drone(distance) {
  // Calculate flight time and RETURN it
  // YOUR CODE HERE:

}

// These tests show whether your function is correct:
console.log("5m →", fly_drone(5), "sec");  // Should print: 10
console.log("3m →", fly_drone(3), "sec");  // Should print: 6
console.log("1m →", fly_drone(1), "sec");  // Should print: 2`,
    checks: [
      {
        description: "fly_drone is a function",
        expression: 'typeof fly_drone === "function"',
        failHint:
          'The function must be named exactly "fly_drone". Check the spelling.',
      },
      {
        description: "fly_drone(5) returns 10",
        expression: "fly_drone(5) === 10",
        failHint:
          "For distance = 5: time should be 5 × 2 = 10. Check your formula.",
      },
      {
        description: "fly_drone(3) returns 6",
        expression: "fly_drone(3) === 6",
        failHint:
          "For distance = 3: time should be 3 × 2 = 6. Does your formula work for all values?",
      },
    ],
    hints: [
      "💡 The formula is: time = distance × 2. Use * for multiplication.",
      "💡 Inside the function body: let time = distance * 2;",
      "💡 After calculating, send the answer back with: return time;",
      "💡 Solution: function fly_drone(distance) { return distance * 2; }",
    ],
    xpBase: 180,
    diamondBase: 10,
  },

  // ─── LEVEL 5 ───────────────────────────────────────────────────────────────
  {
    id: 5,
    scene: "boss",
    title: "Mission 5: Robot Boss",
    subtitle: "Combined Logic",
    concept: "Loops + Conditions combined",
    missionBrief:
      "🤖 ALERT: The vault's final guardian — a security robot — has activated! " +
      "It has 100 HP and a shield that halves your damage. " +
      "Your power is 35. After round 2, the shield breaks. " +
      "Write a battle loop to defeat the robot!",
    starterCode: `let robot_health = 100;
let player_power  = 35;
let shield_active = true;
let rounds        = 0;

// MISSION: write a while loop to defeat the robot!
//
// Rules:
//   1. Loop while robot_health > 0  AND  rounds < 6
//   2. Each round:
//        - If shield is active  →  damage = player_power / 2
//        - Otherwise            →  damage = player_power
//        - Subtract damage from robot_health
//   3. After round 2 (rounds === 2), set shield_active = false
//   4. Always add 1 to rounds each iteration
//
// YOUR BATTLE CODE HERE:


console.log("🤖 Robot HP:", robot_health);
console.log("⚔️  Rounds:", rounds);`,
    checks: [
      {
        description: "Robot is defeated (HP ≤ 0)",
        expression: "robot_health <= 0",
        failHint:
          "The robot's HP must reach 0 or below. Make sure you subtract damage every round.",
      },
      {
        description: "Battle lasted at least 3 rounds",
        expression: "rounds >= 3",
        failHint:
          "The battle should last at least 3 rounds. Is your loop running enough times?",
      },
    ],
    hints: [
      "💡 Start with: while (robot_health > 0 && rounds < 6) { ... }",
      "💡 Inside the loop: let damage = shield_active ? player_power / 2 : player_power;\n   robot_health -= damage;\n   rounds++;",
      "💡 To break the shield after round 2: if (rounds === 2) { shield_active = false; }",
      "💡 Full solution:\nwhile (robot_health > 0 && rounds < 6) {\n  let d = shield_active ? player_power / 2 : player_power;\n  robot_health -= d;\n  if (rounds === 2) shield_active = false;\n  rounds++;\n}",
    ],
    xpBase: 220,
    diamondBase: 15,
  },
];
