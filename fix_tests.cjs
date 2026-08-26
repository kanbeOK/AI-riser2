const fs = require('fs');

const file = 'tests/campaign.test.ts';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/gameReducer/g, 'campaignReducer');
  fs.writeFileSync(file, content);
}
