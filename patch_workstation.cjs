const fs = require('fs');
const path = '/app/applet/src/components/desktop/Workstation.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes("import { CaseView }")) {
  content = content.replace(
    "import { FeedView } from './FeedView';",
    "import { FeedView } from './FeedView';\nimport { CaseView } from './CaseView';"
  );
}

const target = `{activeApp === "HỒ SƠ" && (
             <div className="text-center text-[#86949B] mt-20 border border-dashed border-[#2A363D] p-8 mx-auto max-w-lg rounded-xl">
                <div className="text-3xl mb-4">📂</div>
                Chưa có hồ sơ nào được tạo. Nhấp vào một manh mối trong Tín Hiệu để lập hồ sơ mới.
             </div>
          )}`;

const replacement = `{activeApp === "HỒ SƠ" && <CaseView state={state} dispatch={dispatch} />}`;

content = content.replace(target, replacement);
fs.writeFileSync(path, content);
