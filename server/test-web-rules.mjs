// Uses synthetic accounts to test the deployed client rules. Run only locally.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
initializeApp({ credential: applicationDefault(), projectId: 'balaqaidb' });
const auth = getAuth(), database = getFirestore();
const apiKey = process.env.FIREBASE_WEB_API_KEY;
if (!apiKey) throw new Error('Set FIREBASE_WEB_API_KEY');
const accounts = [];
const base = 'https://firestore.googleapis.com/v1/projects/balaqaidb/databases/(default)/documents';
function value(data) {
  if (data === null) return { nullValue: null };
  if (typeof data === 'string') return { stringValue: data };
  if (typeof data === 'boolean') return { booleanValue: data };
  if (Array.isArray(data)) return { arrayValue: { values: data.map(value) } };
  return { mapValue: { fields: Object.fromEntries(Object.entries(data).map(([key, item]) => [key, value(item)])) } };
}
async function request(uid, token, method = 'GET', data) {
  return fetch(`${base}/users/${uid}?key=${apiKey}`, { method, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), 'Content-Type': 'application/json' }, body: data ? JSON.stringify({ fields: { data: value(data), updatedAt: value(new Date().toISOString()) } }) : undefined });
}
try {
  for (const verified of [true, true, false]) {
    const uid = `balaqai-rules-${randomUUID()}`, email = `${uid}@example.com`, password = `Test-${randomUUID()}!`;
    await auth.createUser({ uid, email, password, emailVerified: verified });
    accounts.push({ uid });
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, returnSecureToken: true }) });
    const signed = await response.json(); assert.ok(signed.idToken, signed.error?.message); accounts.at(-1).token = signed.idToken;
  }
  const [owner, other, unverified] = accounts;
  const fixture = { profile: { name: 'Synthetic web test', birthday: '01.01.1998', city: 'Астана' }, stage: 'pregnant', pregnancyStart: null, pregnancyNotes: { doctor: '', notes: '' }, checklist: ['folate:2026-10-21', 'duchenne'], trackingFolate: true };
  let created;
  for (let attempt = 0; attempt < 6; attempt++) {
    created = await request(owner.uid, owner.token, 'PATCH', fixture);
    if (created.status !== 403) break;
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  assert.equal(created.status, 200, await created.text());
  assert.equal((await request(owner.uid, owner.token)).status, 200);
  assert.equal((await request(owner.uid, other.token)).status, 403);
  assert.equal((await request(owner.uid, other.token, 'PATCH', fixture)).status, 403);
  assert.equal((await request(unverified.uid, unverified.token, 'PATCH', fixture)).status, 403);
  assert.equal((await request(owner.uid)).status, 403);
  assert.equal((await request(owner.uid, owner.token, 'PATCH', { ...fixture, uid: other.uid })).status, 403);
  assert.equal((await request(owner.uid, owner.token, 'PATCH', { ...fixture, profile: { ...fixture.profile, name: 'x'.repeat(81) } })).status, 403);
  assert.equal((await fetch(`${base}/users?key=${apiKey}`, { headers: { Authorization: `Bearer ${owner.token}` } })).status, 403);
  console.log('PASS: direct Web Firestore save/read, own-user isolation, verification, field validation and blocked listing');
} finally {
  for (const { uid } of accounts) { assert.ok(uid.startsWith('balaqai-rules-')); await database.collection('users').doc(uid).delete(); await auth.deleteUser(uid); }
  console.log('Synthetic rules-test accounts and documents removed');
}
