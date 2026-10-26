import { collection, doc, getDocs, getFirestore, writeBatch } from 'firebase/firestore';
import { auth } from './firebase';
import { firebaseApp } from './firebaseApp';
import { emptyCustomTasks, normalizeCustomTasks, taskGroupIds, type CustomTasks } from '../utils/tasks';
function database(uid: string) { if (auth.currentUser?.uid !== uid) throw new Error('Аккаунтқа кіріңіз.'); return getFirestore(firebaseApp); }
export async function loadCustomTasks(uid: string, legacy: unknown): Promise<CustomTasks> {
  const snapshot = await getDocs(collection(database(uid), 'users', uid, 'customTasks'));
  const tasks = normalizeCustomTasks(legacy);
  const persisted = emptyCustomTasks();
  for (const item of snapshot.docs) {
    if (taskGroupIds.includes(item.id as typeof taskGroupIds[number])) {
      const group = item.id as typeof taskGroupIds[number];
      persisted[group] = normalizeCustomTasks({ [group]: item.data().tasks })[group];
      tasks[group] = persisted[group];
    }
  }
  // Copy legacy tasks before the main profile can be saved without its old customTasks field.
  if (legacy) await saveCustomTasks(uid, tasks, persisted);
  return tasks;
}
export async function saveCustomTasks(uid: string, tasks: CustomTasks, previous: CustomTasks): Promise<void> {
  const db = database(uid), batch = writeBatch(db);
  const changed = taskGroupIds.filter(group => JSON.stringify(tasks[group]) !== JSON.stringify(previous[group]));
  if (!changed.length) return;
  for (const group of changed) batch.set(doc(db, 'users', uid, 'customTasks', group), { tasks: tasks[group] });
  await batch.commit();
}
