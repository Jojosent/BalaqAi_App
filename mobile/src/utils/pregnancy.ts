// Civil dates use UTC arithmetic so time-of-day and DST do not change the result.
// LMP + 280 days: https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date
const DAY = 86_400_000;
export const MAX_GESTATION_DAYS = 42 * 7 + 6;
export type PregnancyDraft = { method: 'lmp' | 'age'; lmp: string; weeks: string; days: string };
export function todayKey(now = new Date()) { return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; }
export function parseDate(key: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return null;
  const [year, month, day] = key.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date.getTime() : null;
}
export function dateKey(timestamp: number) { return new Date(timestamp).toISOString().slice(0, 10); }
export function inputToKey(text: string) {
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(text)) return '';
  const [day, month, year] = text.split('.');
  const key = `${year}-${month}-${day}`;
  return parseDate(key) !== null ? key : '';
}
export function keyToInput(key: string) { return key.split('-').reverse().join('.'); }
export function calculatePregnancy(start: string, reference = todayKey()) {
  const startTime = parseDate(start), referenceTime = parseDate(reference);
  if (startTime === null || referenceTime === null || startTime > referenceTime) return null;
  const totalDays = (referenceTime - startTime) / DAY;
  return { start, totalDays, weeks: Math.floor(totalDays / 7), days: totalDays % 7, due: dateKey(startTime + 280 * DAY), progress: Math.min(1, totalDays / 280) };
}
export function draftStart(draft: PregnancyDraft, reference = todayKey()): string | null {
  const referenceTime = parseDate(reference);
  if (referenceTime === null) return null;
  if (draft.method === 'lmp') {
    const key = inputToKey(draft.lmp), result = calculatePregnancy(key, reference);
    return result && result.totalDays <= MAX_GESTATION_DAYS ? key : null;
  }
  if (!/^\d{1,2}$/.test(draft.weeks) || !/^\d$/.test(draft.days)) return null;
  const weeks = Number(draft.weeks), days = Number(draft.days);
  if (weeks > 42 || days > 6) return null;
  return dateKey(referenceTime - (weeks * 7 + days) * DAY);
}
const months = ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'];
export function kazakhDate(key: string, locale = 'kk-KZ') {
  const timestamp = parseDate(key);
  if (timestamp === null) return '';
  const date = new Date(timestamp);
  if (locale !== 'kk-KZ') return new Intl.DateTimeFormat(locale, { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
