import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, runTransaction, type DocumentData } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { firebaseApp } from './firebaseApp';
import { useSession } from '../components/Session';

export const db = getFirestore(firebaseApp);
// Each screen owns a separate document; no generic access to other users' state.
export function usePrivateState<T extends DocumentData>(key: 'shop' | 'community' | 'preferences', initial: T) {
  const { user } = useSession();
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    if (!user) return;
    return onSnapshot(doc(db, 'users', user.uid, 'settings', key), snap => { setValue(snap.exists() ? snap.data() as T : initial); setReady(true); setError(''); }, () => setError('Деректер жүктелмеді. Интернет байланысын тексеріп, қайталаңыз.'));
    // initial is only the fallback for this mounted screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, key]);
  function update(next: T | ((previous: T) => T)) {
    if (!user || !ready) return Promise.resolve();
    setError('');
    const task = queue.current.catch(() => {}).then(() => runTransaction(db, async transaction => { const target = doc(db, 'users', user.uid, 'settings', key); const stored = await transaction.get(target); const previous = stored.exists() ? stored.data() as T : initial; transaction.set(target, typeof next === 'function' ? next(previous) : next); }));
    queue.current = task;
    return task.catch(() => { setError('Сақталмады. Байланысты тексеріп, қайта сақтаңыз.'); });
  }
  return { value, update, ready, error };
}
export async function exportPrivateData(uid: string) {
  const root = await getDoc(doc(db, 'users', uid));
  const names = ['customTasks', 'kickSessions', 'weightEntries', 'moodEntries', 'settings', 'reminders'];
  const collections = await Promise.all(names.map(async name => [name, (await getDocs(collection(db, 'users', uid, name))).docs.map(snap => ({ id: snap.id, ...snap.data() }))]));
  return JSON.stringify({ exportedAt: new Date().toISOString(), profile: root.data(), weightSettings: (await getDoc(doc(db, 'users', uid, 'tracking', 'weight'))).data() || null, ...Object.fromEntries(collections) }, null, 2);
}
