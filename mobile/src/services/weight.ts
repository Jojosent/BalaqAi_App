import { collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, writeBatch } from 'firebase/firestore';
import { auth } from './firebase';
import { firebaseApp } from './firebaseApp';
import { validWeightTracker, type WeightTracker } from '../utils/weight';

function reference(uid: string) {
  if (auth.currentUser?.uid !== uid) throw new Error('Аккаунтқа кіріңіз.');
  return doc(getFirestore(firebaseApp), 'users', uid, 'tracking', 'weight');
}
export async function loadWeightTracker(uid: string): Promise<WeightTracker | null> {
  const ref = reference(uid);
  const [snapshot, entries] = await Promise.all([getDoc(ref), getDocs(query(collection(getFirestore(firebaseApp), 'users', uid, 'weightEntries'), orderBy('at', 'desc'), limit(30)))]);
  if (!snapshot.exists()) return null;
  const data = { ...snapshot.data(), entries: entries.docs.map(item => item.data()) };
  if (!validWeightTracker(data)) throw new Error('Салмақ күнделігі оқылмады.');
  return data;
}
export async function saveWeightTracker(uid: string, tracker: WeightTracker, previous: WeightTracker | null): Promise<void> {
  if (!validWeightTracker(tracker)) throw new Error('Салмақ мәндерін тексеріңіз.');
  const ref = reference(uid), db = getFirestore(firebaseApp), batch = writeBatch(db);
  batch.set(ref, { baseline: tracker.baseline, reminder: tracker.reminder });
  for (const entry of tracker.entries) {
    if (!previous?.entries.some(old => JSON.stringify(old) === JSON.stringify(entry))) batch.set(doc(db, 'users', uid, 'weightEntries', String(entry.at)), entry);
  }
  await batch.commit();
}
