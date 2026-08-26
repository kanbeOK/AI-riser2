const fs = require('fs');
let content = fs.readFileSync('src/components/desktop/CaseView.tsx', 'utf8');

content = content.replace(
  "Kéo thả bằng chứng vào đây (chức năng sắp ra mắt) hoặc nhấp từ danh sách bên phải.",
  "Nhấp vào bằng chứng từ danh sách bên phải để thêm vào hồ sơ."
);

const targetActionDiv = `<div className="text-xs text-[#86949B]">Quyết định can thiệp:</div>`;
const replacementActionDiv = `
              <div className="text-xs flex flex-col gap-1">
                <span className="text-[#86949B]">Quyết định can thiệp:</span>
                <span className="text-[#45D6BF] font-mono">BC: {assignedEvidence.length}/3 | Loại: {new Set(assignedEvidence.map(e => e.entityType)).size}/2</span>
              </div>
`;
content = content.replace(targetActionDiv, replacementActionDiv);

fs.writeFileSync('src/components/desktop/CaseView.tsx', content);
