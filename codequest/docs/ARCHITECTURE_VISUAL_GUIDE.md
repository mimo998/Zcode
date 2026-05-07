# 📊 Games Architecture Visual Guide

## Directory Structure After Integration

```
codequest/
├── apps/
│   ├── web/
│   │   └── src/
│   │       ├── games/                          ← ALL GAMES LIVE HERE
│   │       │   ├── registry.ts                 ← Central hub (NEW)
│   │       │   ├── hello-game/                 ← Game #1 (NEW)
│   │       │   │   ├── definition.ts
│   │       │   │   └── component.tsx
│   │       │   └── calculator-lab/             ← Game #2 (NEW)
│   │       │       ├── definition.ts
│   │       │       ├── component.tsx
│   │       │       └── levels.ts
│   │       ├── pages/
│   │       │   ├── Lobby.tsx                   ← Use registry here
│   │       │   └── GamePlay.tsx                ← Use registry here
│   │       └── Router.tsx                      ← Wire up /play/:gameId
│   └── api/
│       └── src/
│           ├── attempts/                       ← Issue #7
│           ├── mentor/                         ← Issue #8
│           └── ...
├── packages/
│   ├── games-sdk/
│   │   └── src/
│   │       └── index.ts                        ← GameDefinition + GameProps
│   └── shared/
└── docs/
    └── games-sdk.md                            ← Issue #4 requirement
```

---

## Data Flow: Lobby → Game → Progress

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            STUDENT BROWSER                               │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ LOBBY (/)                                                          │ │
│  │                                                                    │ │
│  │  import { GAMES, canPlayGame } from './games/registry'            │ │
│  │                                                                    │ │
│  │  GAMES.map(game => (                                              │ │
│  │    <GameCard                                                       │ │
│  │      name={game.name}                                              │ │
│  │      tagline={game.tagline}                                        │ │
│  │      locked={!canPlayGame(game.id, studentProgress)}               │ │
│  │      onClick={() => navigate(`/play/${game.id}`)}                  │ │
│  │    />                                                              │ │
│  │  ))                                                                │ │
│  │                                                                    │ │
│  │  [HelloGame Card]  [CalculatorLab Card]  [Future Game Card]       │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                              │                                           │
│                              │ click "Calculator Lab"                    │
│                              │ navigate("/play/calculator-lab")          │
│                              ▼                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ GAME RUNTIME (/play/:gameId)                                      │ │
│  │                                                                    │ │
│  │  const game = getGameById("calculator-lab")                        │ │
│  │  const currentLevel = 1                                            │ │
│  │                                                                    │ │
│  │  <game.Component                                                   │ │
│  │    level={currentLevel}                                            │ │
│  │    onLevelComplete={(result) => {                                  │ │
│  │      POST /api/attempts with result                                │ │
│  │      if (result.level < game.totalLevels)                          │ │
│  │        setCurrentLevel(result.level + 1)                           │ │
│  │      else                                                           │ │
│  │        navigate("/") // back to lobby                              │ │
│  │    }}                                                              │ │
│  │    onMentorRequest={(context) => {                                 │ │
│  │      POST /api/mentor/message with context                         │ │
│  │      showMentorSidebar(context)                                    │ │
│  │    }}                                                              │ │
│  │    onExit={() => navigate("/")}                                    │ │
│  │  />                                                                │ │
│  │                                                                    │ │
│  │  ┌──────────────────────────────────────┐                         │ │
│  │  │ CalculatorLabComponent               │                         │ │
│  │  │ ┌────────────────┐ ┌──────────────┐  │                         │ │
│  │  │ │Code Editor     │ │Output Panel  │  │                         │ │
│  │  │ │ function add() │ │ ✓ 3 tests... │  │                         │ │
│  │  │ │  return a + b  │ │              │  │                         │ │
│  │  │ └────────────────┘ └──────────────┘  │                         │ │
│  │  │ [Run] [Ask Mentor] [Next Level]      │                         │ │
│  │  └──────────────────────────────────────┘                         │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ API Calls
                                    ▼
        ┌───────────────────────────────────────────────────┐
        │            BACKEND (Elysia + Postgres)           │
        │                                                  │
        │  POST /api/attempts                              │
        │  └─ save: gameId, level, passed, artifact        │
        │                                                  │
        │  POST /api/mentor/message                        │
        │  └─ stream mentor response (Issue #9)            │
        │                                                  │
        │  Database Updates:                               │
        │  ├─ game_progress                                │
        │  ├─ level_attempts                               │
        │  └─ mentor_messages (history)                    │
        │                                                  │
        └───────────────────────────────────────────────────┘
```

---

## Game Component Lifecycle

```
┌─────────────────────────────────────────────────────────────────────┐
│                        GAME COMPONENT LIFECYCLE                     │
└─────────────────────────────────────────────────────────────────────┘

1. MOUNT
   ├─ Receive GameProps: { level, onLevelComplete, onMentorRequest, onExit }
   ├─ Initialize state: code, output, error, attempts, startTime
   └─ Render UI

2. RUNNING
   ├─ Student writes code
   ├─ Student clicks "Run Code"
   │  ├─ Execute code (runLevelTests)
   │  ├─ Validate against test cases
   │  ├─ Show output or error
   │  └─ If pass: show "✓ Complete"
   │
   ├─ Student clicks "Ask Mentor"
   │  ├─ Prepare context: { level, goal, currentCode, errorMessage, extra }
   │  └─ Call onMentorRequest(context)
   │     └─ Platform opens mentor sidebar
   │
   └─ Student clicks "Next Level" (if passed)
      └─ Call onLevelComplete(result)
         └─ Platform: POST /api/attempts, update progress

3. COMPLETE or EXIT
   ├─ onLevelComplete called
   │  ├─ Platform saves progress
   │  ├─ Moves to next level OR returns to lobby
   │  └─ Game unmounts
   │
   └─ onExit called
      ├─ Student clicked "Back"
      └─ Game unmounts, returns to lobby

```

---

## File Relationships & Imports

```
registry.ts
├─ imports:
│  ├─ GameDefinition from @codequest/games-sdk
│  ├─ HelloGame from ./hello-game/definition
│  └─ CalculatorLab from ./calculator-lab/definition
│
├─ exports:
│  ├─ GAMES: GameDefinition[]
│  ├─ getGameById(id)
│  └─ canPlayGame(id, progress)
│
└─ used by:
   ├─ Lobby.tsx (import GAMES, canPlayGame)
   ├─ GamePlay.tsx (import getGameById)
   └─ Router.tsx (for route params)


hello-game/definition.ts
├─ imports:
│  ├─ GameDefinition from @codequest/games-sdk
│  └─ HelloGameComponent from ./component
│
├─ exports:
│  └─ HelloGame: GameDefinition
│
└─ used by:
   └─ registry.ts


hello-game/component.tsx
├─ imports:
│  ├─ React, useState from react
│  └─ GameProps from @codequest/games-sdk
│
├─ exports:
│  └─ HelloGameComponent: React.FC<GameProps>
│
└─ used by:
   └─ HelloGame definition


calculator-lab/definition.ts
├─ imports:
│  ├─ GameDefinition from @codequest/games-sdk
│  └─ CalculatorLabComponent from ./component
│
├─ exports:
│  └─ CalculatorLab: GameDefinition
│
└─ used by:
   └─ registry.ts


calculator-lab/component.tsx
├─ imports:
│  ├─ React, useState, useEffect from react
│  ├─ GameProps, MentorContext from @codequest/games-sdk
│  └─ LEVELS, runLevelTests from ./levels
│
├─ exports:
│  └─ CalculatorLabComponent: React.FC<GameProps>
│
└─ used by:
   └─ CalculatorLab definition


calculator-lab/levels.ts
├─ exports:
│  ├─ LEVELS: Level[]
│  ├─ TestCase interface
│  ├─ Level interface
│  ├─ runLevelTests(level, code)
│  └─ formatLevelDescription(level)
│
└─ used by:
   └─ calculator-lab/component.tsx

```

---

## Test Case Validation Flow (CalculatorLab)

```
Student writes code:
    function add(a, b) {
      return a + b;
    }

Click "Run Code" →

runLevelTests(level=2, code) →

For each TestCase:
  ├─ Input: "add(3, 4)"
  ├─ Execute code (Function constructor)
  ├─ Get result: 7
  ├─ Compare with expected: 7 ✓
  ├─ Output: "✓ Test 1/3 passed"
  │
  ├─ Input: "add(10, 20)"
  ├─ Execute code
  ├─ Get result: 30
  ├─ Compare with expected: 30 ✓
  ├─ Output: "✓ Test 2/3 passed"
  │
  └─ Input: "add(0, 0)"
     ├─ Execute code
     ├─ Get result: 0
     ├─ Compare with expected: 0 ✓
     └─ Output: "✓ Test 3/3 passed"

Result:
  ├─ allTestsPassed: true
  ├─ output: "✓ Test 1/3 passed\n✓ Test 2/3 passed\n✓ Test 3/3 passed"
  └─ error: null

UI updates:
  ├─ Show green "✓ All tests passed!" message
  ├─ Auto-complete after 1.2s
  └─ Call onLevelComplete(result)

```

---

## Code Execution: Current vs. Future

```
CURRENT (TODO #14):
┌──────────────────────────────────────────┐
│ Student Code + Starter                   │
└──────────────────────┬───────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │   Function() ctor    │
            │ (with try-catch)     │
            └──────────┬───────────┘
                       │
           ┌───────────┴─────────────┐
           │                         │
           ▼                         ▼
      Success              Error (Syntax, Runtime)
           │                         │
           ▼                         ▼
      Run tests              Show error message
      Compare results        Ask mentor → get hints
      Return: allPassed      Edit code → try again


FUTURE (Issue #14):
┌──────────────────────────────────────────┐
│ Student Code + Starter                   │
└──────────────────────┬───────────────────┘
                       │
                       ▼
          ┌────────────────────────┐
          │  Web Worker Sandbox    │
          │  - Timeout protection  │
          │  - Memory limits       │
          │  - API isolation       │
          │  - Better errors       │
          └────────────┬───────────┘
                       │
           ┌───────────┴──────────────┐
           │                          │
           ▼                          ▼
      Success              Error (Timeout, OOM, etc)
           │                          │
           ▼                          ▼
      Run tests              Show specific error
      Compare results        Help student understand
      Return: allPassed      Edit code → try again

```

---

## CalculatorLab Level Progression

```
LEVEL 1: Display Digits
└─ Goal: Show a digit
│  function display(digit) { return String(digit); }
│  Tests: display(0) → "0", display(5) → "5", display(9) → "9"
│  Skills: Variables, function syntax, return
│
├─ LEVEL 2: Addition
│  └─ Goal: Add two numbers
│     function add(a, b) { return a + b; }
│     Tests: add(3, 4) → 7, add(10, 20) → 30, ...
│     Skills: Function parameters, arithmetic
│
├─ LEVEL 3: Switch Operator
│  └─ Goal: Handle +, -, * with if/else or switch
│     function calc(a, b, op) { if (op === '+') return a + b; ... }
│     Tests: calc(5, 3, '+') → 8, calc(5, 3, '-') → 2, ...
│     Skills: Conditionals, type checking
│
├─ LEVEL 4: Full Calculator
│  └─ Goal: Validate inputs, handle operators
│     function calculator(a, b, op) { if (typeof a !== 'number') ... }
│     Tests: All previous ops, error checking
│     Skills: Error handling, integration
│
└─ LEVEL 5: Division by Zero
   └─ Goal: Handle division safely
      function calculator(a, b, op) { 
        if (op === '/' && b === 0) return 'Error: Division by zero'; 
        ...
      }
      Tests: 10/2 → 5, 10/0 → "Error: Division by zero", ...
      Skills: Edge cases, error messages

```

---

## Registry Pattern Benefits

```
WITHOUT Registry (❌ Hard to Scale):
┌─────────────────────────────┐
│ Lobby.tsx                   │
├─────────────────────────────┤
│ import HelloGame from ...   │
│ import CalculatorLab from ..│
│ import MazeRunner from ...  │
│ import ArduinoWorkshop from.│
│ import 3DPrintStudio from..│
│                             │
│ <HelloGame />               │
│ <CalculatorLab />           │
│ <MazeRunner />              │
│ <ArduinoWorkshop />         │
│ <3DPrintStudio />           │
│                             │
│ (Add new game?              │
│  → Must edit this file)     │
└─────────────────────────────┘


WITH Registry (✅ Scales Automatically):
┌──────────────────────────────────┐
│ Lobby.tsx                        │
├──────────────────────────────────┤
│ import { GAMES } from registry   │
│                                  │
│ GAMES.map(game =>                │
│   <GameCard game={game} />        │
│ )                                │
│                                  │
│ (Add new game?                   │
│  → Just add to registry,         │
│    Lobby auto-renders it!)       │
└──────────────────────────────────┘
     ▲
     │ imports
     │
┌──────────────────────────────────┐
│ registry.ts                      │
├──────────────────────────────────┤
│ import HelloGame from ...        │
│ import CalculatorLab from ...    │
│ import MazeRunner from ...       │
│ import ArduinoWorkshop from ...  │
│ import 3DPrintStudio from ...    │
│                                  │
│ export const GAMES = [           │
│   HelloGame,                     │
│   CalculatorLab,                 │
│   MazeRunner,                    │
│   ArduinoWorkshop,               │
│   3DPrintStudio,                 │
│ ]                                │
└──────────────────────────────────┘
```

---

## Mentor Context & Hints Flow

```
┌──────────────────────────────────────────┐
│ Student on Level 3 (Subtraction)         │
│ Tries: function calc(a,b,op) {           │
│          if (op === '-') return a + b;   │  ← WRONG! (added instead)
│        }                                 │
└──────────────────────────────────────────┘
                    │
                    ▼
        Test runs: 5 - 3 = 8 (expected 2)
        Error shown in output panel
                    │
                    ▼
      Student clicks "Ask Mentor"
                    │
                    ▼
┌──────────────────────────────────────────┐
│ MentorContext prepared:                  │
│  {                                       │
│    level: 3,                             │
│    goal: "Subtract a from b using -",   │
│    currentCode: "if (op === '-')...",   │
│    errorMessage: "Test failed: 5 - 3 → 8",
│    extra: {                              │
│      testCases: [                        │
│        { input: "calc(5, 3, '-')",      │
│          expectedOutput: "2" }           │
│      ]                                   │
│    }                                     │
│  }                                       │
└──────────────────────────────────────────┘
                    │
                    ▼
      onMentorRequest(context) fires
                    │
                    ▼
    (Issue #9) Mentor sidebar opens
                    │
                    ▼
      POST /api/mentor/message with context
                    │
                    ▼
      Backend → Anthropic/OpenRouter API
                    │
                    ▼
    Mentor response (Socratic, not direct answer):
    
    "I notice your test is returning 8 instead of 2
     when you subtract 3 from 5. What operation are
     you using on line 2? Does it match the operator
     you're checking for?"
                    │
                    ▼
    Student re-reads code, sees error:
    "Oh! I'm doing a + b when op === '-'!
     Should be a - b"
                    │
                    ▼
    Student edits code
    Clicks "Run Code" again
                    │
                    ▼
    Tests pass! → Next level
```

---

## Summary: You Now Have

✅ **Games Registry** (`registry.ts`)
  - Central hub for all games
  - `GAMES` array to iterate
  - `getGameById()` for lookups
  - `canPlayGame()` for unlock logic

✅ **HelloGame** (Validation)
  - Simple button component
  - Tests SDK plumbing
  - ~50 lines of actual logic

✅ **CalculatorLab** (Reference)
  - 5 progressive levels
  - Code execution & test validation
  - Mentor integration
  - Full-featured example

✅ **Documentation**
  - Integration guide
  - Example code
  - This visual guide
  - Checklist

---

## Next: Integration & Testing

1. Copy files to `apps/web/src/games/`
2. Update `Lobby.tsx` to import registry
3. Update game runtime route to use `getGameById()`
4. Wire up callbacks (onLevelComplete → POST /api/attempts)
5. Test in browser at http://localhost:5173

See **GAMES_SDK_INTEGRATION_GUIDE.md** for detailed steps.
