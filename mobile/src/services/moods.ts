import { collection, doc, getDocs, getFirestore, limit, orderBy, query, setDoc } from 'firebase/firestore';
import { auth } from './firebase';
import { firebaseApp } from './firebaseApp';
import { validMoodEntry, type MoodEntry } from '../utils/moods';

function database(uid: string) { if (auth.currentUser?.uid !== uid) throw new Error('Аккаунтқа кіріңіз.'); return getFirestore(firebaseApp); }
export async function loadMoodEntries(uid: string): Promise<MoodEntry[]> {
  const snapshot = await getDocs(query(collection(database(uid), 'users', uid, 'moodEntries'), orderBy('at', 'desc'), limit(50)));
  const entries = snapshot.docs.map(item => item.data());
  if (!entries.every(validMoodEntry)) throw new Error('Көңіл-күй күнделігі оқылмады.');
  return entries;
}
export async function saveMoodEntry(uid: string, entry: MoodEntry): Promise<void> {
  if (!validMoodEntry(entry)) throw new Error('Көңіл-күйді таңдаңыз.');
  await setDoc(doc(database(uid), 'users', uid, 'moodEntries', String(entry.at)), entry);
}
