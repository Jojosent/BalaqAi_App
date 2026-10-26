export const taskGroupIds = ['first', 'second', 'third', 'bag', 'home'] as const;
export type TaskGroupId = typeof taskGroupIds[number];
export type CustomTasks = Record<TaskGroupId, string[]>;
export const emptyCustomTasks = (): CustomTasks => ({ first: [], second: [], third: [], bag: [], home: [] });
export function normalizeCustomTasks(value: unknown): CustomTasks {
  const result = emptyCustomTasks();
  if (!value || typeof value !== 'object') return result;
  for (const key of taskGroupIds) {
    const items = (value as Record<string, unknown>)[key];
    if (Array.isArray(items)) result[key] = items.filter((item): item is string => typeof item === 'string' && item.trim().length > 0 && item.length <= 160).slice(0, 10);
  }
  return result;
}
export const taskGroups: { id: TaskGroupId; title: string; tasks: string[] }[] = [
  { id: 'first', title: '1-триместр', tasks: [
    'Зиянды әдеттерден бас тартыңыз (темекі, алкоголь, кофеинді көп қолдану)',
    'Жүктілікті растау және келесі қадамдарды дәрігермен талқылау',
    'Акушер-гинеколог пен перзентхананы таңдаңыз',
    'Алғашқы дәрігер қабылдауына сұрақтар тізімін дайындаңыз',
    'Медициналық сақтандыруды тексеріңіз (егер жоқ болса, рәсімдеңіз)',
    'Дәрігермен қабылдаулар кестесін келісіңіз',
    'Дәрігер ұсынған талдаулардың мерзімін белгілеңіз',
  ] },
  { id: 'second', title: '2-триместр', tasks: [
    'Жоспарлы дәрігер қабылдауына сұрақтар дайындаңыз',
    'Дәрігермен УДЗ және тексерулер кестесін нақтылаңыз',
    'Босануға дайындық сабақтарын қарастырыңыз',
    'Серіктесіңізбен қолдау және дайындық туралы сөйлесіңіз',
  ] },
  { id: 'third', title: '3-триместр', tasks: [
    'Дәрігермен босану жоспары мен қалауларыңызды талқылаңыз',
    'Перзентхананың байланыс нөмірін сақтаңыз',
    'Перзентханаға бару жолын және көлікті жоспарлаңыз',
    'Үйге оралғаннан кейін көмектесетін жақындарыңызбен келісіңіз',
  ] },
  { id: 'bag', title: 'Перзентхана сөмкесі', tasks: [
    'Құжаттар мен медициналық жазбаларды жинаңыз',
    'Ыңғайлы киім, түнгі көйлек және тәпішке дайындаңыз',
    'Жеке гигиена заттары мен сүлгі салыңыз',
    'Сәбиге киім, жөргек және көрпе дайындаңыз',
    'Телефон мен қуаттағышты салыңыз',
    'Су бөтелкесі мен жеңіл тіскебасар дайындаңыз',
  ] },
  { id: 'home', title: 'Баланы үйге әкелуге дайындық', tasks: [
    'Сәбидің ұйықтайтын орнын дайындаңыз',
    'Сәбидің киімдерін жуып, реттеңіз',
    'Жөргек пен күтім заттарын дайындаңыз',
    'Көлікпен қайтсаңыз, автокресло дайындаңыз',
    'Үйдегі күнделікті көмек пен тамақтануды жоспарлаңыз',
  ] },
];
export const taskKey = (group: TaskGroupId, index: number, custom = false) => `todo:${group}:${custom ? 'custom' : 'default'}:${index}`;
