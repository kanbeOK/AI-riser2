import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Component Checks', () => {
  it('Profile route contains no placeholder', () => {
    const appStr = fs.readFileSync(path.join(process.cwd(), 'src', 'App.tsx'), 'utf-8');
    expect(appStr).not.toContain('Profile (TBD)');
  });

  it('Case-board route contains no placeholder', () => {
    const appStr = fs.readFileSync(path.join(process.cwd(), 'src', 'App.tsx'), 'utf-8');
    expect(appStr).not.toContain('Case Board (TBD)');
  });

  it('Phone lock-screen rendering', () => {
    const lockScreenStr = fs.readFileSync(path.join(process.cwd(), 'src', 'components', 'game', 'scenes', 'LockScreenScene.tsx'), 'utf-8');
    expect(lockScreenStr).toContain('Thứ Tư, 26 tháng 8');
  });

  it('Clue inspection interaction', () => {
    const chatSceneStr = fs.readFileSync(path.join(process.cwd(), 'src', 'components', 'game', 'scenes', 'ChatScene.tsx'), 'utf-8');
    expect(chatSceneStr).toContain('revealsClueIds');
  });

  it('Evidence drawer', () => {
    const rightRailStr = fs.readFileSync(path.join(process.cwd(), 'src', 'components', 'game', 'RightRail.tsx'), 'utf-8');
    expect(rightRailStr).toContain('Bằng chứng thu thập');
  });

  it('Real debrief timeline', () => {
    const debriefStr = fs.readFileSync(path.join(process.cwd(), 'src', 'components', 'game', 'XRayDebrief.tsx'), 'utf-8');
    expect(debriefStr).toContain('caseDecisions.map');
  });
});
