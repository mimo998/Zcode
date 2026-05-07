# 🚀 Quick Start Checklist: Issue #4 Integration

## Phase 1: File Setup (5 minutes)

- [ ] Create directory structure:
  ```bash
  mkdir -p apps/web/src/games/hello-game
  mkdir -p apps/web/src/games/calculator-lab
  ```

- [ ] Copy registry file:
  ```bash
  cp registry.ts apps/web/src/games/registry.ts
  ```

- [ ] Copy HelloGame files:
  ```bash
  cp hello-game-definition.ts apps/web/src/games/hello-game/definition.ts
  cp hello-game-component.tsx apps/web/src/games/hello-game/component.tsx
  ```

- [ ] Copy CalculatorLab files:
  ```bash
  cp calculator-lab-definition.ts apps/web/src/games/calculator-lab/definition.ts
  cp calculator-lab-component.tsx apps/web/src/games/calculator-lab/component.tsx
  cp calculator-lab-levels.ts apps/web/src/games/calculator-lab/levels.ts
  ```

- [ ] Verify TypeScript compiles:
  ```bash
  pnpm typecheck
  ```

---

## Phase 2: Lobby Integration (10 minutes)

**File:** `apps/web/src/pages/Lobby.tsx` (or similar)

- [ ] Import registry:
  ```typescript
  import { GAMES, canPlayGame } from '../games/registry';
  ```

- [ ] Get student progress (mock or from API):
  ```typescript
  const studentProgress = {}; // TODO: load from /api/me/progress
  ```

- [ ] Render game cards:
  ```typescript
  {GAMES.map((game) => (
    <GameCard
      key={game.id}
      game={game}
      canPlay={canPlayGame(game.id, studentProgress)}
      onClick={() => navigate(`/play/${game.id}`)}
    />
  ))}
  ```

- [ ] Test: Lobby should display both HelloGame and CalculatorLab cards

---

## Phase 3: Game Runtime Integration (15 minutes)

**File:** `apps/web/src/pages/GamePlay.tsx` (or similar)

- [ ] Import registry:
  ```typescript
  import { getGameById } from '../games/registry';
  import type { LevelResult, MentorContext } from '@codequest/games-sdk';
  ```

- [ ] Get game from route param:
  ```typescript
  const { gameId } = useParams();
  const game = gameId ? getGameById(gameId) : null;
  ```

- [ ] Handle 404:
  ```typescript
  if (!game) {
    return <NotFoundPage />;
  }
  ```

- [ ] State for current level:
  ```typescript
  const [currentLevel, setCurrentLevel] = useState(1);
  ```

- [ ] Mount game component with callbacks:
  ```typescript
  <game.Component
    level={currentLevel}
    onLevelComplete={handleLevelComplete}
    onMentorRequest={handleMentorRequest}
    onExit={handleExit}
  />
  ```

- [ ] Implement `handleLevelComplete`:
  ```typescript
  const handleLevelComplete = (result: LevelResult) => {
    // TODO: POST to /api/attempts
    if (result.level < game.totalLevels) {
      setCurrentLevel(result.level + 1);
    } else {
      navigate('/'); // back to lobby
    }
  };
  ```

- [ ] Implement `handleMentorRequest`:
  ```typescript
  const handleMentorRequest = (context: MentorContext) => {
    // TODO: POST to /api/mentor/message
    setMentorContext(context);
    setMentorVisible(true);
  };
  ```

- [ ] Implement `handleExit`:
  ```typescript
  const handleExit = () => {
    navigate('/');
  };
  ```

- [ ] Test: Click on a game card → game loads and renders

---

## Phase 4: Router Setup (5 minutes)

**File:** `apps/web/src/Router.tsx` (or equivalent)

- [ ] Add game runtime route:
  ```typescript
  {
    path: '/play/:gameId',
    element: <GamePlay />,
  }
  ```

- [ ] Test: Navigate to `/play/hello-game` and `/play/calculator-lab`

---

## Phase 5: Callback Testing (10 minutes)

### Test HelloGame
- [ ] Click HelloGame card → game mounts
- [ ] Click "Complete Level" → check browser console for `onLevelComplete` call
- [ ] Verify `LevelResult` includes: `level`, `passed: true`, `timeSpent`, `attempts`
- [ ] Click "Back" → returns to lobby

### Test CalculatorLab Level 1
- [ ] Click CalculatorLab card → loads Level 1 (Display Digits)
- [ ] Verify starter code is shown
- [ ] Click "Run Code" → output shows test results
- [ ] Verify code editor works (can edit, paste, etc)
- [ ] Verify "Ask Mentor" button is clickable (check console for `onMentorRequest`)

### Test CalculatorLab Level 2
- [ ] On Level 1, code should pass automatically or be easy
- [ ] Click "Next Level" or auto-advance
- [ ] Level 2 loads (Addition)
- [ ] Starter code shows `function add(a, b) { return a + b; }`
- [ ] Click "Run Code" → should show passing tests
- [ ] Mentor button works

### Test Full CalculatorLab Flow
- [ ] Progress through all 5 levels
- [ ] Level 5 (Division by Zero) requires error handling
- [ ] Test code: `if (b === 0) return 'Error: Division by zero'`
- [ ] Should pass 3 test cases
- [ ] On completion → returns to lobby

---

## Phase 6: API Integration (Optional for now, TODO #7)

Once Issue #7 is done:

- [ ] Replace `handleLevelComplete` with:
  ```typescript
  const handleLevelComplete = async (result: LevelResult) => {
    const res = await fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: game.id, ...result }),
    });
    // Handle response...
  };
  ```

- [ ] Replace `handleMentorRequest` with:
  ```typescript
  const handleMentorRequest = async (context: MentorContext) => {
    const res = await fetch('/api/mentor/message', {
      method: 'POST',
      body: JSON.stringify(context),
    });
    // Stream response to sidebar...
  };
  ```

---

## Troubleshooting

| Problem | Check |
|---------|-------|
| Games don't appear in Lobby | Import { GAMES } correct? Is registry.ts in right path? |
| Game won't mount | Is route `/play/:gameId` defined? Is `getGameById()` returning game? |
| Code execution fails | Check CalculatorLab output panel for error. Is code valid JS? |
| Buttons don't work | Are callbacks wired up? Check browser console for errors. |
| TypeScript errors | Did you import from `@codequest/games-sdk`? Is package.json correct? |

---

## Files Provided

| File | Purpose | Where to put |
|------|---------|-------------|
| `registry.ts` | Central game hub | `apps/web/src/games/registry.ts` |
| `hello-game-definition.ts` | HelloGame metadata | `apps/web/src/games/hello-game/definition.ts` |
| `hello-game-component.tsx` | HelloGame game | `apps/web/src/games/hello-game/component.tsx` |
| `calculator-lab-definition.ts` | CalculatorLab metadata | `apps/web/src/games/calculator-lab/definition.ts` |
| `calculator-lab-component.tsx` | CalculatorLab game | `apps/web/src/games/calculator-lab/component.tsx` |
| `calculator-lab-levels.ts` | 5 levels + test runner | `apps/web/src/games/calculator-lab/levels.ts` |
| `GAMES_SDK_INTEGRATION_GUIDE.md` | Full integration docs | Keep for reference |
| `EXAMPLE_INTEGRATION_CODE.tsx` | Example code patterns | Keep for reference |
| `ARCHITECTURE_VISUAL_GUIDE.md` | Visual diagrams | Keep for reference |

---

## Success Criteria (Issue #4 Complete)

- [x] SDK contract finalized (GameDefinition + GameProps)
- [x] Registry created and can load games
- [x] HelloGame exists and validates SDK plumbing
- [x] CalculatorLab exists as full reference implementation
- [ ] **Files integrated into project** (you do this)
- [ ] **Lobby renders game cards** (you do this)
- [ ] **Game runtime works end-to-end** (you do this)
- [ ] **Callbacks fire correctly** (you do this)
- [ ] **TypeScript compiles without errors** (you do this)
- [ ] **Manual testing passes all scenarios** (you do this)

---

## After Integration

Once this phase is done:

- ✅ Issue #4 complete — SDK contract + games registry
- 🔜 Issue #5 — Lobby UI refinement
- 🔜 Issue #6 — Game runtime wrapper polish
- 🔜 Issue #9 — Mentor sidebar UI
- 🔜 Issue #13 — Maze Runner (next reference game)
- 🔜 Issue #14 — Web Worker sandbox (replace Function())

---

## Questions?

Refer to:
- **GAMES_SDK_INTEGRATION_GUIDE.md** — detailed walkthrough
- **EXAMPLE_INTEGRATION_CODE.tsx** — copy-paste code patterns
- **ARCHITECTURE_VISUAL_GUIDE.md** — diagrams and flows

Good luck! 🚀
