const fs = require('fs');

let redContent = fs.readFileSync('src/game/state/reducer.ts', 'utf8');
redContent = redContent.replace('location: isDemo ? "workstation" : "apartment" as const,', 'location: isDemo ? "workstation" : "apartment",');
redContent = redContent.replace('location: isDemo ? "workstation" : "apartment",', 'location: (isDemo ? "workstation" : "apartment") as "apartment" | "workstation",');

fs.writeFileSync('src/game/state/reducer.ts', redContent);
