import React from 'react';
import { GameState } from '../../game/types';
import { CASES } from '../../game/content/cases';
import { LockScreenScene } from './scenes/LockScreenScene';
import { ChatScene } from './scenes/ChatScene';
import { BrowserScene } from './scenes/BrowserScene';
import { OfficialAppScene } from './scenes/OfficialAppScene';
import { SystemScene } from './scenes/SystemScene';
import { CallScene } from './scenes/CallScene';

export function SceneRenderer({ state, dispatch }: { state: GameState, dispatch: any }) {
  const currentCase = state.currentCaseId ? CASES[state.currentCaseId] : null;
  const currentScene = (currentCase && state.currentSceneId) ? currentCase.scenes[state.currentSceneId] : null;

  if (!currentCase || !currentScene) {
    return <div className="text-white p-4">Loading scene...</div>;
  }

  switch (currentScene.channel) {
    case 'lockscreen':
      return <LockScreenScene scene={currentScene} dispatch={dispatch} state={state} />;
    case 'chat':
      return <ChatScene scene={currentScene} dispatch={dispatch} state={state} />;
    case 'browser':
      return <BrowserScene scene={currentScene} dispatch={dispatch} state={state} />;
    case 'official_app':
      return <OfficialAppScene scene={currentScene} dispatch={dispatch} state={state} />;
    case 'system':
      return <SystemScene scene={currentScene} dispatch={dispatch} state={state} />;
    case 'call':
      return <CallScene scene={currentScene} dispatch={dispatch} state={state} />;
    default:
      return <div className="text-white p-4">Unsupported channel: {currentScene.channel}</div>;
  }
}
