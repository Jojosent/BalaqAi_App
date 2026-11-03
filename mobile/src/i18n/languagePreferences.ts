import type { Language } from './core';
type Storage = { getItem: (key: string) => Promise<string | null>; setItem: (key: string, value: string) => Promise<unknown>; removeItem: (key: string) => Promise<unknown> };
export const validLanguage = (value: unknown): value is Language => value === 'kk' || value === 'ru' || value === 'en';
const guestKey = 'balaqai.language.guest';
const guestChoiceKey = 'balaqai.language.guest.pending';
const accountKey = (uid: string) => `balaqai.language.${uid}`;
const pendingKey = (uid: string) => `${accountKey(uid)}.pending`;

// Serialize persistence so a slow remote request cannot overwrite a newer selection.
export function createLanguagePreferences(storage: Storage, readRemote: (uid: string) => Promise<unknown>, writeRemote: (uid: string, language: Language) => Promise<unknown>) {
 let queue = Promise.resolve();
 function enqueue(work: () => Promise<void>) {
  const next = queue.then(work);
  queue = next.catch(() => {});
  return next;
 }
 async function persist(uid: string | null, language: Language) {
  await storage.setItem(guestKey, language);
  if (!uid) { await storage.setItem(guestChoiceKey, language); return; }
  await storage.setItem(accountKey(uid), language);
  await storage.setItem(pendingKey(uid), language);
  await storage.removeItem(guestChoiceKey);
  await writeRemote(uid, language);
  await storage.removeItem(pendingKey(uid));
 }
 return {
  select: (uid: string | null, language: Language) => enqueue(() => persist(uid, language)),
  load: (uid: string | null, apply: (language: Language) => void, isCurrent: () => boolean) => enqueue(async () => {
   if (!isCurrent()) return;
   const guest = await storage.getItem(guestKey);
   if (!uid) { if (isCurrent()) apply(validLanguage(guest) ? guest : 'kk'); return; }
   const guestChoice = await storage.getItem(guestChoiceKey);
   const pending = await storage.getItem(pendingKey(uid));
   const local = await storage.getItem(accountKey(uid));
   if (!isCurrent()) return;
   const selected = validLanguage(guestChoice) ? guestChoice : validLanguage(pending) ? pending : null;
   // Keep the current choice visible while Firebase loads, including offline sessions.
   apply(selected || (validLanguage(local) ? local : validLanguage(guest) ? guest : 'kk'));
   if (selected) {
    await storage.setItem(accountKey(uid), selected);
    await storage.setItem(pendingKey(uid), selected);
    if (validLanguage(guestChoice)) await storage.removeItem(guestChoiceKey);
    if (!isCurrent()) return;
    await storage.setItem(guestKey, selected);
    await writeRemote(uid, selected);
    await storage.removeItem(pendingKey(uid));
    return;
   }
   const remote = await readRemote(uid);
   if (!isCurrent()) return;
   if (validLanguage(remote)) {
    apply(remote);
    await storage.setItem(accountKey(uid), remote);
    await storage.setItem(guestKey, remote);
   } else {
    await persist(uid, validLanguage(local) ? local : validLanguage(guest) ? guest : 'kk');
   }
  }),
 };
}
