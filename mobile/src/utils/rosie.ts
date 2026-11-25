// Week 20 belongs to the 20+ animation; week 42 is the final numbered week.
export function rosieForWeek(week: number) {
  if (week >= 42) return 'final';
  if (week >= 20) return 'sleeping';
  if (week >= 13) return 'star';
  if (week >= 9) return 'baby';
  if (week >= 5) return 'early';
  if (week >= 0) return 'first';
  return null;
}
