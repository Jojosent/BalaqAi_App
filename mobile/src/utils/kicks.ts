export const KICK_SESSION_MS = 2 * 60 * 60 * 1000;
export const MAX_KICK_SESSIONS = 20;
export type KickSession = { startedAt: number; endedAt: number | null; count: number };
export type KickAction = 'start' | 'kick' | 'stop';
export function validKickSession(value: unknown): value is KickSession {
  if (!value || typeof value !== 'object') return false;
  const v = value as KickSession;
  return Object.keys(v).length === 3 && Number.isSafeInteger(v.startedAt) && v.startedAt > 0 && v.startedAt <= 253402300799999 &&
    Number.isInteger(v.count) && v.count >= 0 && v.count <= 10000 &&
    (v.endedAt === null || (Number.isSafeInteger(v.endedAt) && v.endedAt >= v.startedAt && v.endedAt - v.startedAt <= KICK_SESSION_MS));
}
export function normalizeKickSessions(value: unknown): KickSession[] {
  if (!Array.isArray(value)) return [];
  return value.filter(validKickSession).filter((session, index) => index === 0 || session.endedAt !== null).slice(0, MAX_KICK_SESSIONS);
}
export function updateKickSessions(value: unknown, action: KickAction, now: number): KickSession[] {
  const sessions = normalizeKickSessions(value);
  const active = sessions[0]?.endedAt === null ? sessions[0] : null;
  const expired = active && now >= active.startedAt + KICK_SESSION_MS;
  if (active && (action === 'stop' || expired)) {
    sessions[0] = { ...active, endedAt: Math.max(active.startedAt, Math.min(now, active.startedAt + KICK_SESSION_MS)) };
  }
  if (action === 'start' && (!active || expired)) return [{ startedAt: now, endedAt: null, count: 0 }, ...sessions].slice(0, MAX_KICK_SESSIONS);
  if (action === 'kick' && active && !expired) sessions[0] = { ...active, count: Math.min(10000, active.count + 1) };
  return sessions;
}
export function kickElapsed(session: KickSession, now: number) {
  return Math.max(0, Math.min(KICK_SESSION_MS, (session.endedAt ?? now) - session.startedAt));
}
export function durationText(milliseconds: number) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(value => String(value).padStart(2, '0')).join(':');
}
