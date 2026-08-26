const fs = require('fs');
const path = '/app/applet/src/components/desktop/CaseView.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("CaseRecord", "Case");
fs.writeFileSync(path, content);
