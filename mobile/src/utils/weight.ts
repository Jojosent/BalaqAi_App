export type WeightEntry = { at: number; kg: number; week: number | null };
export type WeightTracker = { baseline: number; reminder: boolean; entries: WeightEntry[] };
export const MAX_WEIGHT_ENTRIES = 30;
export function parseWeight(value: string): number | null {
  const text = value.trim().replace(',', '.');
  if (!/^\d{1,3}(\.\d)?$/.test(text)) return null;
  const kg = Number(text);
  return kg >= 20 && kg <= 400 ? kg : null;
}
export const weightText = (kg: number) => `${Number(kg.toFixed(1))} кг`;
export function validWeightTracker(value: unknown): value is WeightTracker {
  if (!value || typeof value !== 'object') return false;
  const v = value as WeightTracker;
  return Object.keys(v).length === 3 && typeof v.baseline === 'number' && Number.isFinite(v.baseline) && v.baseline >= 20 && v.baseline <= 400 && typeof v.reminder === 'boolean' &&
    Array.isArray(v.entries) && v.entries.length <= MAX_WEIGHT_ENTRIES && v.entries.every(entry => entry && Object.keys(entry).length === 3 && Number.isSafeInteger(entry.at) && entry.at > 0 && entry.at <= 253402300799999 &&
      typeof entry.kg === 'number' && Number.isFinite(entry.kg) && entry.kg >= 20 && entry.kg <= 400 &&
      (entry.week === null || (Number.isInteger(entry.week) && entry.week >= 0 && entry.week <= 42)));
}
export function addWeightEntry(tracker: WeightTracker, kg: number, at: number, week: number | null): WeightTracker {
  return { ...tracker, entries: [{ at, kg, week }, ...tracker.entries].slice(0, MAX_WEIGHT_ENTRIES) };
}
