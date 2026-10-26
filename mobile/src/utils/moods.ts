export const moods = [
  { id: 'happiness', title: 'Бақыт', group: 'green' },
  { id: 'joy', title: 'Қуаныш', group: 'green' },
  { id: 'excitement', title: 'Толқу', group: 'green' },
  { id: 'satisfaction', title: 'Қанағаттану', group: 'green' },
  { id: 'love', title: 'Махаббат', group: 'green' },
  { id: 'gratitude', title: 'Алғыс', group: 'green' },
  { id: 'kindness', title: 'Мейірім', group: 'green' },
  { id: 'motivation', title: 'Ынта', group: 'green' },
  { id: 'cheerful', title: 'Көңілді', group: 'green' },
  { id: 'appreciation', title: 'Ризашылық', group: 'green' },
  { id: 'stress', title: 'Күйзеліс', group: 'red' },
  { id: 'fear', title: 'Қорқыныш', group: 'red' },
  { id: 'surprise', title: 'Таңғалу', group: 'red' },
  { id: 'pain', title: 'Ауырсыну', group: 'red' },
  { id: 'anger', title: 'Ашу', group: 'red' },
  { id: 'sadness', title: 'Мұң', group: 'red' },
  { id: 'boredom', title: 'Жалығу', group: 'amber' },
  { id: 'indifference', title: 'Немқұрайлылық', group: 'amber' },
] as const;
export type MoodId = typeof moods[number]['id'];
export type MoodEntry = { at: number; mood: MoodId };
export const moodColors = {
  green: { border: '#62ed43', selected: '#d8fbd0', text: '#46bb36' },
  red: { border: '#ff6868', selected: '#ffe1e1', text: '#e45c64' },
  amber: { border: '#e8b900', selected: '#fff4cf', text: '#e39123' },
};
export function validMoodEntry(value: unknown): value is MoodEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as MoodEntry;
  return Object.keys(entry).length === 2 && Number.isSafeInteger(entry.at) && entry.at > 0 && entry.at <= 253402300799999 && moods.some(mood => mood.id === entry.mood);
}
export function moodDateText(at: number, now = Date.now()) {
  const date = new Date(at);
  const day = date.toDateString() === new Date(now).toDateString() ? 'Бүгін' : new Intl.DateTimeFormat('kk-KZ', { day: '2-digit', month: 'short' }).format(date);
  return `${day} ${new Intl.DateTimeFormat('kk-KZ', { hour: '2-digit', minute: '2-digit' }).format(date)}`;
}
