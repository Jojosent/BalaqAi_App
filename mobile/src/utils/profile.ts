import { inputToKey, parseDate, todayKey } from './pregnancy';

export function profileAge(birthday: string, reference = todayKey()) {
  const birthKey = inputToKey(birthday);
  const birth = parseDate(birthKey), now = parseDate(reference);
  if (birth === null || now === null || birth > now) return null;
  const [year, month, day] = birthKey.split('-').map(Number);
  const [currentYear, currentMonth, currentDay] = reference.split('-').map(Number);
  return currentYear - year - (currentMonth < month || (currentMonth === month && currentDay < day) ? 1 : 0);
}
