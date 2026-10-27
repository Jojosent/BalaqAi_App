export type PrenatalTask = { id: string; title: string; subtitle?: string; article?: string };
export type PrenatalSection = { id: string; title: string; subtitle: string; color: string; crop: { x: number; y: number; width: number; height: number }; tasks: PrenatalTask[] };
export const prenatalSections: PrenatalSection[] = [
  { id: 'visit', title: 'Алғашқы қабылдау', subtitle: 'Жүктілік анықталған кезде', color: '#ff63ae', crop: { x: 360, y: 390, width: 340, height: 268 }, tasks: [
    { id: 'clinic', title: 'Емханаға немесе пренаталдық орталыққа жүгіну' },
  ] },
  { id: 'first', title: 'I триместр', subtitle: '11–13 апта 6 күн', color: '#98d15f', crop: { x: 420, y: 800, width: 280, height: 220 }, tasks: [
    { id: 'ultrasound', title: 'I УДЗ-скрининг — мойын қатпарының қалыңдығы', subtitle: '11–13 апта 6 күн', article: 'scan-first' },
    { id: 'papp-a', title: 'Биохимиялық скрининг PAPP-A', article: 'papp-a' },
    { id: 'beta-hcg', title: 'Биохимиялық скрининг β-ХГЧ', article: 'beta-hcg' },
    { id: 'geneticist', title: 'Генетик кеңесі', subtitle: 'Дәрігер жолдамасы бойынша' },
  ] },
  { id: 'second', title: 'II триместр', subtitle: '19–21 апта', color: '#f56669', crop: { x: 390, y: 1160, width: 310, height: 222 }, tasks: [
    { id: 'ultrasound', title: 'II УДЗ-скрининг', subtitle: 'Ұрықтың дамуы', article: 'scan-second' },
  ] },
  { id: 'third', title: 'III триместр', subtitle: '30–32 апта', color: '#67a6ed', crop: { x: 400, y: 1520, width: 300, height: 225 }, tasks: [
    { id: 'ultrasound', title: 'III УДЗ-скрининг', subtitle: 'Ұрықтың дамуы', article: 'scan-third' },
  ] },
];
// Separate namespace: existing personal-task and daily checklist marks keep their meaning.
export const prenatalTaskKey = (section: string, task: string) => `prenatal:${section}:${task}`;
export const prenatalSource = 'https://www.gov.kz/org/dsm/documents/details/242451?lang=ru';
