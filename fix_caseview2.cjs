const fs = require('fs');
const path = '/app/applet/src/components/desktop/CaseView.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("GameAction, Case }", "GameAction, CaseFileState }");
fs.writeFileSync(path, content);
