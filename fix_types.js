const fs = require('fs');

let content = fs.readFileSync('src/game/state/types.ts', 'utf8');

const replacement = `export type ScheduledEvent = 
  | { id: string; day: number; minute: number; type: "feed_start"; payload: { feedId: string; title: string; type: "chat" | "call" | "transaction" | "social" } }
  | { id: string; day: number; minute: number; type: "feed_message"; payload: { feedId: string; message: FeedMessage } }
  | { id: string; day: number; minute: number; type: "feed_close"; payload: { feedId: string } }
  | { id: string; day: number; minute: number; type: "bill_due"; payload: { type: "rent" | "internet"; amount: number } }
  | { id: string; day: number; minute: number; type: "job_offer"; payload: { job: SideJobState } }
  | { id: string; day: number; minute: number; type: "network_activity"; payload: { heatDelta: number } };`;

content = content.replace(/export type ScheduledEvent = {[^}]+};/s, replacement);

fs.writeFileSync('src/game/state/types.ts', content);
