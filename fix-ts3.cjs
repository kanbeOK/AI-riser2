const fs = require('fs');

let r = fs.readFileSync('src/game/state/reducer.ts', 'utf-8');
r = r.replace(/const item = state\.inventory\[itemIndex\];/, 'const item = state.inventory[itemIndex];\n      if (!item) return state;');
fs.writeFileSync('src/game/state/reducer.ts', r);

let t = fs.readFileSync('tests/campaign.test.ts', 'utf-8');
t = t.replace(/expect\(s\.feeds\['f1'\]\.status\)/g, "expect(s.feeds['f1']?.status)");
t = t.replace(/expect\(s\.cases\['c1'\]\.evidenceIds\)/g, "expect(s.cases['c1']?.evidenceIds)");
t = t.replace(/expect\(s\.cases\['c1'\]\.status\)/g, "expect(s.cases['c1']?.status)");
t = t.replace(/expect\(s\.cases\['c1'\]\.verdict\)/g, "expect(s.cases['c1']?.verdict)");
t = t.replace(/expect\(s\.feeds\['f1'\]\.messages\.length\)/g, "expect(s.feeds['f1']?.messages.length)");
t = t.replace(/expect\(s\.feeds\['f1'\]\.messages\[0\]\.text\)/g, "expect(s.feeds['f1']?.messages[0]?.text)");
fs.writeFileSync('tests/campaign.test.ts', t);

