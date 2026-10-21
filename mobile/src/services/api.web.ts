import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { auth } from './firebase';
import { firebaseApp } from './firebaseApp';
import type { SavedData } from './api';
export type { SavedData } from './api';

const database = getFirestore(firebaseApp);
export async function loadUserData(): Promise<SavedData | null> {
  const user = auth.currentUser;
  if (!user) throw new Error('Аккаунтқа кіріңіз.');
  await user.getIdToken(true);
  const snapshot = await getDoc(doc(database, 'users', user.uid));
  return snapshot.exists() ? (snapshot.data().data as SavedData) : null;
}
export async function saveUserData(data: SavedData, expectedUid: string): Promise<void> {
  const user = auth.currentUser;
  if (!user || user.uid !== expectedUid) throw new Error('Аккаунтқа кіріңіз.');
  await setDoc(doc(database, 'users', user.uid), { data, updatedAt: new Date().toISOString() });
}
