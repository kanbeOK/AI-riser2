const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/gameReducer/g, 'campaignReducer');
fs.writeFileSync('src/App.tsx', appContent);

let redContent = fs.readFileSync('src/game/state/reducer.ts', 'utf8');
redContent = redContent.replace('location: isDemo ? "workstation" : "apartment",', 'location: isDemo ? "workstation" : "apartment" as "apartment" | "workstation",');
// const item = state.inventory[itemIndex]; if (!item) return state;
redContent = redContent.replace('if (!item) return state;', 'if (!item) return state;\n      const effectValue = item.effectValue;');
// wait, effectValue is not on all items if they are base Item type? Let's check.
// I will just add ! to item.
redContent = redContent.replace('clamp(state.hunger + item.effectValue', 'clamp(state.hunger + item!.effectValue');

fs.writeFileSync('src/game/state/reducer.ts', redContent);
