import test from 'node:test';
import assert from 'node:assert/strict';
import { updateKickSessions, normalizeKickSessions, kickElapsed, durationText, KICK_SESSION_MS } from '../src/utils/kicks.ts';

test('start, count, stop and restore a saved session', () => {
  let sessions = updateKickSessions(undefined, 'start', 1000);
  assert.deepEqual(sessions, [{ startedAt: 1000, endedAt: null, count: 0 }]);
  sessions = updateKickSessions(sessions, 'kick', 2000);
  sessions = updateKickSessions(sessions, 'kick', 3000);
  assert.equal(sessions[0].count, 2);
  assert.equal(kickElapsed(sessions[0], 4000), 3000);
  assert.equal(updateKickSessions(sessions, 'start', 4000).length, 1);
  sessions = updateKickSessions(sessions, 'stop', 5000);
  assert.equal(sessions[0].endedAt, 5000);
  assert.equal(kickElapsed(sessions[0], 10000), 4000);
  assert.deepEqual(normalizeKickSessions(JSON.parse(JSON.stringify(sessions))), sessions);
  assert.deepEqual(updateKickSessions(sessions, 'stop', 6000), sessions);
  assert.deepEqual(updateKickSessions(sessions, 'kick', 6000), sessions);
});
test('expired sessions stop at two hours without counting a late tap', () => {
  const active = [{ startedAt: 1000, endedAt: null, count: 8 }];
  const expired = updateKickSessions(active, 'kick', 1000 + KICK_SESSION_MS + 10000);
  assert.equal(expired[0].endedAt, 1000 + KICK_SESSION_MS);
  assert.equal(expired[0].count, 8);
  assert.equal(kickElapsed(active[0], 1000 + KICK_SESSION_MS + 10000), KICK_SESSION_MS);
  assert.equal(updateKickSessions(active, 'start', 1000 + KICK_SESSION_MS).length, 2);
});
test('history bounded to 20, invalid values rejected and durations stable', () => {
  let sessions = [];
  for (let i = 1; i <= 25; i++) {
    sessions = updateKickSessions(sessions, 'start', i * 10000);
    sessions = updateKickSessions(sessions, 'stop', i * 10000 + 1000);
  }
  assert.equal(sessions.length, 20);
  assert.equal(sessions[0].startedAt, 250000);
  assert.equal(normalizeKickSessions([{ startedAt: 1, endedAt: 2, count: -1 }]).length, 0);
  assert.equal(normalizeKickSessions(null).length, 0);
  assert.equal(durationText(KICK_SESSION_MS), '02:00:00');
  assert.equal(durationText(61000), '00:01:01');
  assert.equal(durationText(-1000), '00:00:00');
});
