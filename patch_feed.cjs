const fs = require('fs');

const path = '/app/applet/src/components/desktop/FeedView.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `{m.clues.map(c => (
                          <span key={c} className="text-[10px] px-1 bg-[#F2B35D]/20 text-[#F2B35D] rounded border border-[#F2B35D]/50">
                            🔍 {c}
                          </span>
                        ))}`;

const replacement = `{m.clues.map(c => {
                          const isCollected = state.evidence.some(e => e.label === c && e.feedId === feed.id);
                          return (
                          <button 
                            key={c} 
                            onClick={() => !isCollected && dispatch({
                              type: 'EXTRACT_EVIDENCE',
                              payload: {
                                token: {
                                  id: \`ev_\${Date.now()}_\${Math.floor(Math.random()*1000)}\`,
                                  caseId: null,
                                  feedId: feed.id,
                                  eventId: m.id,
                                  entityType: 'domain', // Simple default for now
                                  label: c,
                                  value: c,
                                  observedAt: state.minuteOfDay,
                                  confidence: 100,
                                  sourceRef: m.id
                                }
                              }
                            })}
                            disabled={isCollected}
                            className={\`text-[10px] px-1 rounded border transition-colors \${isCollected ? 'bg-[#45D6BF]/20 text-[#45D6BF] border-[#45D6BF]/50 cursor-default' : 'bg-[#F2B35D]/20 text-[#F2B35D] border-[#F2B35D]/50 hover:bg-[#F2B35D]/40'}\`}
                          >
                            {isCollected ? '✓' : '🔍'} {c}
                          </button>
                        )})}`;

content = content.replace(target, replacement);
fs.writeFileSync(path, content);
