const fs = require('fs');
const path = '/app/applet/src/game/state/reducer.ts';
let content = fs.readFileSync(path, 'utf8');

const target = `    case "ASSIGN_EVIDENCE": {
      const { evidenceId, caseId } = action.payload;
      const c = state.cases[caseId];
      if (!c) return state;
      if (c.evidenceIds.includes(evidenceId)) return state;
      return {
        ...state,
        cases: {
          ...state.cases,
          [caseId]: { ...c, evidenceIds: [...c.evidenceIds, evidenceId] }
        }
      };
    }`;

const replacement = `    case "ASSIGN_EVIDENCE": {
      const { evidenceId, caseId } = action.payload;
      const c = state.cases[caseId];
      if (!c) return state;
      if (c.evidenceIds.includes(evidenceId)) return state;
      return {
        ...state,
        cases: {
          ...state.cases,
          [caseId]: { ...c, evidenceIds: [...c.evidenceIds, evidenceId] }
        },
        evidence: state.evidence.map(e => e.id === evidenceId ? { ...e, caseId } : e)
      };
    }`;

content = content.replace(target, replacement);
fs.writeFileSync(path, content);
