const fs = require('fs');
let content = fs.readFileSync('src/components/game/GameShell.tsx', 'utf8');

// I will just read and replace properly.
content = content.replace('<>\n      <>\n      <AIConnector', '<>\n      <AIConnector'); // cleanup if I accidentally duplicated

// It looks like `</>` didn't get added correctly. Let's just restore the file properly.
// I'll rewrite GameShell from scratch for a clean version to avoid any regex mess.
