const fs = require('fs');

// 1. Fix server.ts
let serverTs = fs.readFileSync('server.ts', 'utf-8');
serverTs = serverTs.replace(/const scenario = CASES\.find\(c => c\.id === scenarioId\);/, 'const scenario = CASES[scenarioId];');
serverTs = serverTs.replace(/CHIẾN THUẬT CỐT LÕI: \$\{scenario\.groundTruthTactics\.join\(", "\)\}/, 'CHIẾN THUẬT CỐT LÕI: ${scenario.tactics.join(", ")}');
serverTs = serverTs.replace(/DẤU HIỆU NHẬN BIẾT: \$\{scenario\.observableCues\.join\(", "\)\}/, 'DẤU HIỆU NHẬN BIẾT: ${scenario.tactics.join(", ")}');
serverTs = serverTs.replace(/MỤC TIÊU GIÁO DỤC: \$\{scenario\.learningObjective\}\\n/, '');
fs.writeFileSync('server.ts', serverTs);

// 2. Fix GameShell.tsx
let gameShell = fs.readFileSync('src/components/game/GameShell.tsx', 'utf-8');
gameShell = gameShell.replace(/const nextCase = CASES\[CASE_ORDER\[nextIndex\]\];/g, 'const nextCase = CASES[CASE_ORDER[nextIndex] || ""];');
gameShell = gameShell.replace(/dispatch\(\{ type: 'RECEIVE_EVENT', payload: \{ caseId: nextCase\.id, sceneId: nextCase\.initialSceneId, channel: 'system' \} \}\);/g, 'if (nextCase) { dispatch({ type: "RECEIVE_EVENT", payload: { caseId: nextCase.id, sceneId: nextCase.initialSceneId, channel: "system" } }); }');
fs.writeFileSync('src/components/game/GameShell.tsx', gameShell);

// 3. Fix LeftRail.tsx
let leftRail = fs.readFileSync('src/components/game/LeftRail.tsx', 'utf-8');
leftRail = leftRail.replace(/const c = CASES\[caseId\];/g, 'const c = CASES[caseId];\n          if (!c) return null;');
fs.writeFileSync('src/components/game/LeftRail.tsx', leftRail);

// 4. Fix engine.ts
let engineTs = fs.readFileSync('src/game/engine.ts', 'utf-8');
// Fix h, m types
engineTs = engineTs.replace(/const \[h, m\] = /g, 'const [h = 0, m = 0] = ');
// Fix strict null checks for currentCaseId and currentSceneId
engineTs = engineTs.replace(/caseId: state\.currentCaseId!,/g, 'caseId: state.currentCaseId || "",');
engineTs = engineTs.replace(/sceneId: state\.currentSceneId!,/g, 'sceneId: state.currentSceneId || "",');
fs.writeFileSync('src/game/engine.ts', engineTs);

// 5. Fix useGameSession.ts
let useGame = fs.readFileSync('src/game/useGameSession.ts', 'utf-8');
useGame = useGame.replace(/const \[h, m\] = /g, 'const [h = 0, m = 0] = ');
fs.writeFileSync('src/game/useGameSession.ts', useGame);

// 6. Fix random.ts
let randomTs = fs.readFileSync('src/utils/random.ts', 'utf-8');
randomTs = randomTs.replace(/mulberry32\(seed\[0\]\)/g, 'mulberry32(seed[0] || 0)');
fs.writeFileSync('src/utils/random.ts', randomTs);

// 7. Fix tests
let testTs = fs.readFileSync('tests/engine.test.ts', 'utf-8');
testTs = testTs.replace(/expect\(state\.decisions\[0\]\.safe\)/g, 'expect(state.decisions[0]?.safe)');
fs.writeFileSync('tests/engine.test.ts', testTs);

