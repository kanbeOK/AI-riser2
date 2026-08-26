const fs = require('fs');

let content = fs.readFileSync('src/components/desktop/FeedView.tsx', 'utf8');

// Replace Math.random with a deterministic ID based on length
content = content.replace(
  "const respId = `m_${state.day}_${triggerMin}_sys_${Math.floor(Math.random()*1000)}`;",
  "const respId = `m_${state.day}_${triggerMin}_sys_${feed.messages.length}`; "
);

// Add "MỞ HỒ SƠ TỪ TÍN HIỆU NÀY" button
const targetHeader = `<span className="text-[#45D6BF] flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-[#45D6BF] animate-pulse"></span>
                 {feed.title}
               </span>
               <span className="text-[#86949B] px-2 py-1 bg-[#2A363D] rounded">{feed.type.toUpperCase()}</span>`;

const replacementHeader = `<span className="text-[#45D6BF] flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-[#45D6BF] animate-pulse"></span>
                 {feed.title}
               </span>
               <div className="flex gap-2 items-center">
                 {!state.cases[feed.id] && (
                   <button 
                     onClick={() => dispatch({ type: 'CREATE_CASE', payload: { id: feed.id, title: feed.title } })}
                     className="bg-[#F2B35D] text-[#080B0E] px-2 py-1 rounded font-bold hover:bg-[#F4C584] transition-colors"
                   >
                     + MỞ HỒ SƠ
                   </button>
                 )}
                 <span className="text-[#86949B] px-2 py-1 bg-[#2A363D] rounded">{feed.type.toUpperCase()}</span>
               </div>`;

content = content.replace(targetHeader, replacementHeader);

// In EXTRACT_EVIDENCE, entityType should be derived or simple. Keep it 'domain' or something, but let's change it so we have variety for the banning exploit.
// Wait, the exploit fix requires different entityTypes for 'banned'. We can assign entityType deterministically based on the clue length.
const extractEv = `entityType: 'domain', // Simple default for now`;
const replaceEv = `entityType: c.length % 3 === 0 ? 'account' : c.length % 2 === 0 ? 'phone' : 'domain',`;
content = content.replace(extractEv, replaceEv);

fs.writeFileSync('src/components/desktop/FeedView.tsx', content);
