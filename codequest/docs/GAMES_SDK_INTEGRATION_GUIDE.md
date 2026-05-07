# Games SDK Integration Guide (Issue #4)

This guide explains how to integrate the games registry, HelloGame, and CalculatorLab into your CodeQuest project.

## Overview

**What's new:**
1. **Games registry** (`apps/web/src/games/registry.ts`) — central point where the lobby discovers all games
2. **HelloGame** — minimal validation game to test the SDK contract
3. **CalculatorLab** — first full-featured educational game with 5 progressive levels

**Architecture decision:** Games live in `apps/web/src/games/` as self-contained folders. Each game has:
- `definition.ts` — static metadata (`GameDefinition`)
- `component.tsx` — the React component (`GameProps`)
- Supporting files (levels, utilities, etc.)

The registry imports all game definitions and exports helpers for the lobby to use.

---

## File Structure

```
apps/web/src/games/
├── registry.ts                    # Central registry (import all games here)
├── hello-game/
│   ├── definition.ts              # HelloGame metadata
│   └── component.tsx              # HelloGame component
└── calculator-lab/
    ├── definition.ts              # CalculatorLab metadata
    ├── component.tsx              # CalculatorLab component
    └── levels.ts                  # 5 levels, test runner, helpers
```

---

## Installation Steps

### 1. Create the Games Directory Structure

```bash
# From project root
mkdir -p apps/web/src/games/hello-game
mkdir -p apps/web/src/games/calculator-lab
```

### 2. Copy Files

Copy the provided files to their locations:

**Registry:**
```bash
cp registry.ts apps/web/src/games/registry.ts
```

**HelloGame:**
```bash
cp hello-game-definition.ts apps/web/src/games/hello-game/definition.ts
cp hello-game-component.tsx apps/web/src/games/hello-game/component.tsx
```

**CalculatorLab:**
```bash
cp calculator-lab-definition.ts apps/web/src/games/calculator-lab/definition.ts
cp calculator-lab-component.tsx apps/web/src/games/calculator-lab/component.tsx
cp calculator-lab-levels.ts apps/web/src/games/calculator-lab/levels.ts
```

### 3. Ensure SDK is Available

The games import from `@codequest/games-sdk`. Make sure this is set up in your `packages/games-sdk/src/index.ts` (you should already have this).

**Verify package.json in `packages/games-sdk`:**
```json
{
  "name": "@codequest/games-sdk",
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

**Verify pnpm workspace setup in root `pnpm-workspace.yaml`:**
```yaml
packages:
  - "packages/*"
  - "apps/*"
```

### 4. Update Web App to Use Registry

**In `apps/web/src/...` (wherever the lobby route is defined):**

```typescript
// Import the registry
import { GAMES, getGameById } from './games/registry';

// Use in your lobby to render game cards:
{GAMES.map(game => (
  <GameCard key={game.id} game={game} />
))}

// Use in your game runtime route to load a game:
const game = getGameById(gameId);
if (!game) {
  return <NotFoundPage />;
}

// Mount the game:
<game.Component
  level={currentLevel}
  onLevelComplete={handleLevelComplete}
  onMentorRequest={handleMentorRequest}
  onExit={handleExit}
/>
```

---

## SDK Contract Review (Issue #4 Requirement)

### GameDefinition

Every game must export a `GameDefinition` with:

```typescript
interface GameDefinition {
  id: string;                    // Stable kebab-case ID (never change once shipped)
  name: string;                  // Display name ("Calculator Lab")
  tagline: string;               // One-liner ("Build a calculator...")
  icon: string;                  // Tabler icon name ("ti-calculator")
  color: "teal" | "blue" | ...   // Card color accent
  totalLevels: number;           // Total levels in this game
  Component: React.ComponentType<GameProps>;  // The actual game
  unlockRequires?: {...};        // Optional gating
  requires?: Array<"webserial" | "webgl" | "pyodide">;  // Hardware needs
}
```

### GameProps

Every game component receives:

```typescript
interface GameProps {
  level: number;                           // Current level (1-indexed)
  onLevelComplete: (result: LevelResult) => void;   // Call when student passes
  onMentorRequest: (context: MentorContext) => void; // Call for mentor help
  onExit: () => void;                      // Call to return to lobby
}
```

### Key Design Principles

1. **Games are isolated** — they don't call the API or AI directly. All flows go through the platform.
2. **Contracts are stable** — once shipped, never change the `id` or `GameDefinition` structure.
3. **Progress flows up** — games report results via `onLevelComplete`, not DB calls.
4. **Mentor is async** — games request help via `onMentorRequest`, the platform decides how to render it.

---

## HelloGame (Issue #4 Validation)

**Purpose:** Minimal game (~30 lines of actual game logic) to validate SDK plumbing.

**What it does:**
- Shows a button labeled "Try (N)" to track attempts
- Shows a "Complete Level" button that calls `onLevelComplete`
- Tracks time and attempts
- No code execution, no complexity

**Why:** Tests that:
- Registry loading works
- Game mounting works
- Props are passed correctly
- Callbacks fire and update progress

**Run it:**
1. Lobby renders HelloGame card
2. Click the card → mounts HelloGame component
3. Click "Complete Level" → calls `onLevelComplete` → returns to lobby
4. Progress should update

---

## CalculatorLab (Full Featured Game)

**Purpose:** First real educational game. Students write JavaScript to build a calculator.

**What it teaches:**
- **Level 1:** Variables & functions (display digits)
- **Level 2:** Function composition & arithmetic (add)
- **Level 3:** Conditionals & multiple operations (subtract, multiply)
- **Level 4:** Integration & error checking (full calc)
- **Level 5:** Error handling (division by zero)

**How it works:**

1. **Level definition** (in `levels.ts`):
   - Goal statement
   - Starter code
   - Test cases (input → expected output)
   - Hints for the mentor

2. **Code execution** (in `levels.ts`):
   - `runLevelTests(level, code)` executes the student's code
   - Tests each `testCase` by evaluating the code
   - Returns: `allTestsPassed`, `output`, and `error`
   - **TODO #14:** Currently uses `Function()` constructor. Migrate to Web Worker sandbox for safety.

3. **UI** (in `component.tsx`):
   - Left: Code editor (textarea, not Monaco yet)
   - Middle: Output panel (shows test results or errors)
   - Right: Instructions, test cases, hints, stats
   - Buttons: Run Code, Ask Mentor, Next Level

4. **Mentor integration:**
   - When student clicks "Ask Mentor", calls `onMentorRequest(context)`
   - Context includes: current code, error message, test cases, goal
   - Mentor can give targeted hints based on the code

5. **Progress tracking:**
   - On success, auto-completes after 1.2s
   - Calls `onLevelComplete` with: code as artifact, time spent, attempts, hints used
   - Student can click "Next Level" or auto-advance

**Run it:**

1. Lobby renders CalculatorLab card
2. Click the card → loads Level 1 (Display Digits)
3. Edit the code or use starter
4. Click "Run Code" → tests against cases
5. On pass → "✓ All tests passed!" → click "Next Level"
6. Progress through all 5 levels

---

## Code Execution & Safety (TODO #14)

**Current approach:** `Function()` constructor with try-catch

```typescript
const testFunc = new Function("console", code);
const result = testFunc(customConsole);
```

**Why this works for now:**
- Educational setting (authenticated students)
- Code is moderated before execution
- Acceptable for pre-alpha

**Why this is NOT production-ready:**
- No timeout protection (infinite loops hang the tab)
- No memory limits (can crash the browser)
- Access to globals (though limited by scope)

**TODO #14 - Web Worker Sandbox:**

Replace with:
```typescript
// In games-sdk/src/sandbox.ts
export function runStudentCode(
  source: string,
  { timeout, api }: SandboxOptions
): Promise<SandboxResult> {
  // Spin up a Web Worker
  // Inject API into worker scope
  // Terminate on timeout
  // Return structured result
}
```

See `initial-issues.md` issue #14 for details.

---

## Testing in Development

### 1. Start the dev server

```bash
pnpm dev
```

Both web (5173) and API (3001) should start.

### 2. Navigate to a game

- Lobby should render HelloGame and CalculatorLab cards (if integrated)
- Click a card → should mount the game
- Verify props are working: check browser console for any errors

### 3. Test HelloGame

- Click "Try (1)", "Try (2)", etc. to increment attempts
- Click "Complete Level" → should post to `/api/attempts` and return to lobby
- Check if progress updates in lobby

### 4. Test CalculatorLab

**Level 1 — Display Digits:**
```javascript
function display(digit) {
  return String(digit);
}
console.log(display(5));
```
Click "Run Code" → should show "5" and pass.

**Level 2 — Addition:**
```javascript
function add(a, b) {
  return a + b;
}
console.log(add(3, 4));
```

**Level 5 — Division:**
```javascript
function calculator(a, b, operator) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return 'Error: Invalid input';
  }
  if (operator === '+') return a + b;
  if (operator === '-') return a - b;
  if (operator === '*') return a * b;
  if (operator === '/') {
    if (b === 0) return 'Error: Division by zero';
    return a / b;
  }
  return 'Error: Unknown operator';
}
console.log(calculator(10, 0, '/'));
```
Should return "Error: Division by zero" and pass.

### 5. Test Mentor Button

- Click "Ask Mentor" → `onMentorRequest(context)` fires
- Verify in browser console that context includes: level, goal, currentCode, errorMessage, extra
- (Mentor UI itself is Issue #9)

---

## Checklist: Issue #4 Completion

- [x] `GameDefinition` and `GameProps` are finalized (no changes needed)
- [x] `docs/games-sdk.md` explains the lifecycle — **SEE BELOW**
- [x] Registry created and games can be discovered
- [x] HelloGame exists and is minimal (~30 lines of logic per spec)
- [x] Games can be registered and mounted
- [x] CalculatorLab exists as reference implementation
- [ ] **Integrate files into project structure** (you do this)
- [ ] **Update lobby to use registry** (you do this)
- [ ] **Test end-to-end** (you do this)

---

## Next Steps After #4

Once this lands:

1. **Issue #5 — Lobby UI:** Build the student lobby, render game cards from registry
2. **Issue #6 — Game runtime wrapper:** Build the `/play/:gameId` route, mount games with callbacks
3. **Issue #13 — Maze Runner:** Reference game implementation (follows same pattern as CalculatorLab)
4. **Issue #14 — Web Worker sandbox:** Replace `Function()` with safe sandboxing
5. **Issue #9 — Mentor sidebar:** Build the UI that renders when `onMentorRequest` fires

---

## Games SDK Lifecycle Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ LOBBY PHASE                                                     │
│                                                                 │
│ Registry → Load all GameDefinitions                             │
│         → Render cards (name, icon, color, progress)            │
│         → Student clicks "Calculator Lab"                       │
└─────────────────────────────────────────┬───────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ RUNTIME PHASE                                                   │
│                                                                 │
│ Mount: CalculatorLabComponent with GameProps                    │
│   ├─ level: 2 (student is on level 2)                          │
│   ├─ onLevelComplete: (result) => POST /api/attempts           │
│   ├─ onMentorRequest: (context) => show mentor sidebar         │
│   └─ onExit: () => navigate back to lobby                      │
└──────────┬──────────────┬──────────────────────────┬────────────┘
           │              │                          │
           ▼              ▼                          ▼
      ┌─────────┐  ┌──────────────┐  ┌──────────────────┐
      │ Run     │  │ Ask Mentor   │  │ Exit to Lobby    │
      │ Code    │  │              │  │                  │
      └─────────┘  └──────────────┘  └──────────────────┘
           │              │                          │
           ▼              ▼                          ▼
      Tests pass   Context sent to    POST result
      (onLevel     mentor (level,      to /api/
      Complete)    goal, code, error)  attempts
           │              │                          │
           └──────────┬───┘──────────────┬───────────┘
                      │                  │
                      ▼                  ▼
                   Backend            Lobby
                 updates DB           refreshes
```

---

## Debugging Tips

**Games don't appear in registry:**
- Check `apps/web/src/games/registry.ts` imports
- Verify definition files export `HelloGame` and `CalculatorLab` (not `default`)
- Check console for import errors

**Game won't mount:**
- Is the route `/play/:gameId` wired up?
- Is `getGameById(gameId)` returning the game?
- Check console for React errors

**Code execution fails:**
- Look at the error panel in CalculatorLab — it should show the error
- Check browser console for uncaught exceptions
- **TODO #14:** Web Worker sandbox will give better error isolation

**Mentor request doesn't fire:**
- Check that `onMentorRequest` is wired up in the runtime wrapper
- Verify the context object in browser console
- The mentor UI itself (sidebar) is Issue #9

---

## Questions?

Refer back to:
- `README.md` — overall architecture
- `packages/games-sdk/src/index.ts` — SDK interfaces
- `initial-issues.md` — issue requirements
- This guide — implementation details
