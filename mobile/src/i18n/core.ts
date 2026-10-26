import catalog from './catalog.json';
export type Language = 'kk' | 'ru' | 'en';
export const languageNames: Record<Language, string> = { kk: 'Қазақша', ru: 'Русский', en: 'English' };
let current: Language = 'kk';
export const getLanguage = () => current;
export const getLocale = () => ({ kk: 'kk-KZ', ru: 'ru-RU', en: 'en-GB' })[current];
export function setCurrentLanguage(value: Language) { current = value; }
const entries = catalog as [string, string, string, string?][];
const exact = new Map<string, typeof entries[number]>();
for (const row of entries) for (const alias of row) if (alias) exact.set(alias.replace(/\s+/g, ' ').trim(), row);
const patterns = entries.filter(row => row[0].includes('{')).map(row => {
 const keys: string[] = [];
 const parts = row[0].replace(/\s+/g, ' ').trim().split(/(\{\w+\})/g).map(part => /^\{/.test(part) ? (keys.push(part.slice(1, -1)), '(.+?)') : part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
 return { row, keys, regex: new RegExp(`^${parts.join('')}$`) };
});
function pluralize(text: string, language: Language) {
 if (language === 'en') return text.replace(/(\d+) (weeks|days|movements|years)\b/g, (_, count, unit) => Number(count) === 1 ? count + ' ' + unit.slice(0, -1) : count + ' ' + unit);
 if (language === 'ru') { const forms: Record<string, string[]> = { 'лет': ['год', 'года', 'лет'], 'недель': ['неделя', 'недели', 'недель'], 'дней': ['день', 'дня', 'дней'], 'движений': ['движение', 'движения', 'движений'] }; return text.replace(/(\d+) (лет|недель|дней|движений)(?![а-яё])/g, (_, count, unit) => { const category = new Intl.PluralRules('ru').select(Number(count)); return count + ' ' + forms[unit][category === 'one' ? 0 : category === 'few' ? 1 : 2]; }); }
 return text;
}
export function translate(text: string, language: Language = current): string {
 const normalized = text.replace(/\s+/g, ' ').trim();
 const index = language === 'kk' ? 0 : language === 'ru' ? 1 : 2;
 const found = exact.get(normalized);
 if (found) return pluralize(text.replace(text.trim(), found[index]), language);
 for (const { row, keys, regex } of patterns) {
  const match = normalized.match(regex);
  if (match) return pluralize(row[index].replace(/\{(\w+)\}/g, (_, key) => translate(match[keys.indexOf(key) + 1], language)), language);
 }
 return text;
}
