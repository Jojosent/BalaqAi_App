import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { collection, doc, getDoc, getDocs, onSnapshot, serverTimestamp, Timestamp, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from './privateState';
import type { SavedData } from './api';
export const pendingInviteKey = 'balaqai.pendingInvite';
export const validInviteId = (id: string) => /^[a-f0-9]{48}$/.test(id);
export type ShareScope = { name: boolean; pregnancy: boolean; progress: boolean };
export type SharedSummary = { name: string; pregnancyStart: string | null; completed: number; scope: ShareScope };
export function summary(data: SavedData, scope: ShareScope): SharedSummary {
  return { name: scope.name ? data.profile.name : '', pregnancyStart: scope.pregnancy && data.stage === 'pregnant' ? data.pregnancyStart : null, completed: scope.progress ? data.checklist.length : 0, scope };
}
export function inviteUrl(id: string) { return `${process.env.EXPO_PUBLIC_WEB_URL || 'https://balaqai-app-five.vercel.app'}/connect?invite=${id}`; }
export async function createInvite(uid: string, data: SavedData, scope: ShareScope) {
  const previous = await getDoc(doc(db, 'users', uid, 'settings', 'sharing'));
  const id = Array.from(Crypto.getRandomBytes(24), byte => byte.toString(16).padStart(2, '0')).join('');
  const batch = writeBatch(db);
  if (previous.exists()) batch.update(doc(db, 'shareInvites', previous.data().inviteId), { enabled: false });
  batch.set(doc(db, 'shareInvites', id), { ownerUid: uid, enabled: true, createdAt: serverTimestamp(), expiresAt: Timestamp.fromMillis(Date.now() + 6 * 86400000) });
  batch.set(doc(db, 'shareData', id), { ownerUid: uid, ...summary(data, scope) });
  batch.set(doc(db, 'users', uid, 'settings', 'sharing'), { inviteId: id });
  await batch.commit(); return id;
}
export async function acceptInvite(uid: string, id: string) {
  const invite = await getDoc(doc(db, 'shareInvites', id));
  if (!invite.exists() || !invite.data().enabled || invite.data().expiresAt.toMillis() < Date.now()) throw new Error('Шақыру мерзімі аяқталды немесе тоқтатылды.');
  if (invite.data().ownerUid === uid) return;
  const batch = writeBatch(db);
  batch.set(doc(db, 'shareInvites', id, 'members', uid), { active: true });
  batch.set(doc(db, 'users', uid, 'connections', id), { ownerUid: invite.data().ownerUid });
  await batch.commit();
}
export async function syncSharedSummary(uid: string, data: SavedData) {
  const pointer = await getDoc(doc(db, 'users', uid, 'settings', 'sharing'));
  if (!pointer.exists()) return;
  const id = pointer.data().inviteId;
  const [invite, stored] = await Promise.all([getDoc(doc(db, 'shareInvites', id)), getDoc(doc(db, 'shareData', id))]);
  if (!invite.data()?.enabled || !stored.exists()) return;
  const next = { ownerUid: uid, ...summary(data, stored.data().scope) };
  if (JSON.stringify(next) !== JSON.stringify(stored.data())) await updateDoc(doc(db, 'shareData', id), next);
}
export async function loadConnections(uid: string) { return (await getDocs(collection(db, 'users', uid, 'connections'))).docs.map(item => item.id); }
export function listenSummary(id: string, next: (value: SharedSummary) => void, error: () => void) { return onSnapshot(doc(db, 'shareData', id), snap => snap.exists() ? next(snap.data() as SharedSummary) : error(), error); }
export async function clearPendingInvite() { await AsyncStorage.removeItem(pendingInviteKey); }
