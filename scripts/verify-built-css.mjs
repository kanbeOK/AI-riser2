import fs from 'fs';
import path from 'path';

const distAssets = path.join(process.cwd(), 'dist', 'assets');
let files = [];
try {
  files = fs.readdirSync(distAssets);
} catch (e) {
  console.error("Could not read dist/assets directory");
  process.exit(1);
}

const cssFile = files.find(f => f.endsWith('.css'));

if (!cssFile) {
  console.error("No CSS file found in dist/assets");
  process.exit(1);
}

const content = fs.readFileSync(path.join(distAssets, cssFile), 'utf-8');

if (content.includes('@tailwind utilities')) {
  console.error("Tailwind utilities not generated (found literal '@tailwind utilities')");
  process.exit(1);
}

const expectedClasses = [
  '.intro-screen',
  '.apartment-screen',
  '.workstation-shell',
  '.investigation-backdrop',
  '.debrief-screen',
  '@media',
];
for (const cls of expectedClasses) {
  if (!content.includes(cls)) {
     console.error(`Missing expected utility class '${cls}' in built CSS`);
     process.exit(1);
  }
}

console.log("CSS verification passed!");
