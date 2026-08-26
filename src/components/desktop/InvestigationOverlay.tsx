import React from 'react';
import { CampaignState, GameAction } from '../../game/state/types';
import { OsintView } from './OsintView';
import { GraphView } from './GraphView';
import { CaseView } from './CaseView';

export function InvestigationOverlay({ type, state, dispatch, focusedCaseId }: { type: 'osint' | 'graph' | 'case', state: CampaignState, dispatch: React.Dispatch<GameAction>, focusedCaseId: string | null }) {
  if (type === 'osint') return <OsintView state={state} dispatch={dispatch} />;
  if (type === 'graph') return <GraphView state={state} dispatch={dispatch} />;
  if (type === 'case') return <CaseView state={state} dispatch={dispatch} caseId={focusedCaseId} />;
  return null;
}
