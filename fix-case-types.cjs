const fs = require('fs');

let types = fs.readFileSync('src/game/state/types.ts', 'utf-8');
if (!types.includes('CREATE_CASE')) {
  types = types.replace(
    /\| \{ type: "START_CAMPAIGN"/,
    '| { type: "CREATE_CASE"; payload: { id: string; title: string } }\n  | { type: "START_CAMPAIGN"'
  );
  fs.writeFileSync('src/game/state/types.ts', types);
}

let reducer = fs.readFileSync('src/game/state/reducer.ts', 'utf-8');
if (!reducer.includes('case "CREATE_CASE":')) {
  reducer = reducer.replace(
    /switch \(action\.type\) \{/,
    'switch (action.type) {\n    case "CREATE_CASE": {\n      if (state.cases[action.payload.id]) return state;\n      return {\n        ...state,\n        cases: {\n          ...state.cases,\n          [action.payload.id]: { id: action.payload.id, title: action.payload.title, status: "open", evidenceIds: [], verdict: null }\n        },\n        notifications: [...state.notifications, { id: `notif_${Date.now()}`, time: state.minuteOfDay, message: `Hồ sơ mới được tạo: ${action.payload.title}`, type: "info" }]\n      };\n    }'
  );
  fs.writeFileSync('src/game/state/reducer.ts', reducer);
}
