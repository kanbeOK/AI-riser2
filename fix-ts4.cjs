const fs = require('fs');
let t = fs.readFileSync('tests/campaign.test.ts', 'utf-8');
t = t.replace(/expect\(s\.evidence\[0\]\.id\)/g, "expect(s.evidence[0]?.id)");
t = t.replace(/expect\(s\.graphEdges\[0\]\.sourceId\)/g, "expect(s.graphEdges[0]?.sourceId)");
t = t.replace(/expect\(s\.cases\['c1'\]\.evidenceIds\.length\)/g, "expect(s.cases['c1']?.evidenceIds.length)");
fs.writeFileSync('tests/campaign.test.ts', t);
