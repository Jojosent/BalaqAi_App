const stages = ['pregnant', 'planning', 'postpartum'];
function text(value, max) { return typeof value === 'string' && value.length <= max; }
function validDate(year, month, day) { const date = new Date(Date.UTC(year, month - 1, day)); return year >= 1900 && date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day && date.getTime() <= Date.now(); }
export function validProfile(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  const allowed = ['profile', 'stage', 'pregnancyStart', 'pregnancyNotes', 'checklist', 'trackingFolate', 'customTasks'];
  if (Object.keys(data).some(key => !allowed.includes(key))) return false;
  const { profile, stage, pregnancyStart, pregnancyNotes, checklist, trackingFolate } = data;
  if (data.customTasks !== undefined) {
    const groups = ['first', 'second', 'third', 'bag', 'home'];
    const tasks = data.customTasks;
    if (!tasks || typeof tasks !== 'object' || Array.isArray(tasks) || Object.keys(tasks).length !== groups.length ||
      !groups.every(group => Array.isArray(tasks[group]) && tasks[group].length <= 10 && tasks[group].every(item => text(item, 160) && item.trim().length > 0))) return false;
  }
  if (!profile || !text(profile.name, 80) || !text(profile.birthday, 10) || !text(profile.city, 80) || Object.keys(profile).some(key => !['name', 'birthday', 'city'].includes(key))) return false;
  if (profile.birthday && !/^\d{2}\.\d{2}\.\d{4}$/.test(profile.birthday)) return false;
  if (profile.birthday) { const [day, month, year] = profile.birthday.split('.').map(Number); if (!validDate(year, month, day)) return false; }
  if (stage !== null && !stages.includes(stage)) return false;
  if (pregnancyStart !== null && (!text(pregnancyStart, 10) || !/^\d{4}-\d{2}-\d{2}$/.test(pregnancyStart))) return false;
  if (pregnancyStart !== null && !validDate(...pregnancyStart.split('-').map(Number))) return false;
  if (!pregnancyNotes || !text(pregnancyNotes.doctor, 100) || !text(pregnancyNotes.notes, 1000) || Object.keys(pregnancyNotes).some(key => !['doctor', 'notes'].includes(key))) return false;
  return Array.isArray(checklist) && checklist.length <= 100 && checklist.every(item => text(item, 100)) && typeof trackingFolate === 'boolean';
}
