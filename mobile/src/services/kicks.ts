import { collection, doc, getDocs, getFirestore, limit, orderBy, query, writeBatch } from 'firebase/firestore';
import { auth } from './firebase';
import { firebaseApp } from './firebaseApp';
import { normalizeKickSessions, type KickSession } from '../utils/kicks';

function database(uid: string) {
  if (auth.currentUser?.uid !== uid) throw new Error('Аккаунтқа кіріңіз.');
  return getFirestore(firebaseApp);
}
export async function loadKickSessions(uid: string): Promise<KickSession[]> {
  const snapshot = await getDocs(query(collection(database(uid), 'users', uid, 'kickSessions'), orderBy('startedAt', 'desc'), limit(20)));
  return normalizeKickSessions(snapshot.docs.map(item => item.data()));
}
export async function saveKickSessions(uid: string, sessions: KickSession[], previous: KickSession[]): Promise<void> {
  const db = database(uid), batch = writeBatch(db);
  const changed = sessions.filter(session => !previous.some(old => JSON.stringify(old) === JSON.stringify(session)));
  if (!changed.length) return;
  for (const session of changed) batch.set(doc(db, 'users', uid, 'kickSessions', String(session.startedAt)), session);
  await batch.commit();
}
