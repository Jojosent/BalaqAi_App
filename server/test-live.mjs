// Disposable synthetic accounts only. No real emails are sent by this test.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
initializeApp({ credential: applicationDefault(), projectId: 'balaqaidb' });
const auth = getAuth(), db = getFirestore();
const ids = [];
const apiKey = process.env.FIREBASE_WEB_API_KEY;
if (!apiKey) throw new Error('Set FIREBASE_WEB_API_KEY');
const base = process.env.API_URL || 'http://127.0.0.1:3001';
try {
  const tokens = [];
  for (const verified of [true, true, false]) {
    const uid = `balaqai-e2e-${randomUUID()}`;
    const password = `Test-${randomUUID()}!`;
    await auth.createUser({ uid, email: `${uid}@example.com`, password, emailVerified: verified }); ids.push(uid);
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: `${uid}@example.com`, password, returnSecureToken: true }) });
    const data = await response.json(); assert.ok(data.idToken, data.error?.message); tokens.push(data.idToken);
  }
  const headers = token => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
  assert.equal((await fetch(`${base}/v1/me`)).status, 401);
  assert.equal((await fetch(`${base}/v1/me`, { headers: headers(tokens[2]) })).status, 403);
  const fixture = { profile: { name: 'Synthetic E2E', birthday: '', city: '' }, stage: null, pregnancyStart: null, pregnancyNotes: { doctor: '', notes: 'Disposable test data' }, checklist: [], trackingFolate: false };
  assert.equal((await fetch(`${base}/v1/me`, { method: 'PUT', headers: headers(tokens[0]), body: JSON.stringify(fixture) })).status, 200);
  assert.deepEqual((await (await fetch(`${base}/v1/me`, { headers: headers(tokens[0]) })).json()).data, fixture);
  assert.equal((await (await fetch(`${base}/v1/me`, { headers: headers(tokens[1]) })).json()).data, null);
  console.log('PASS: real Firebase tokens, verification gate, Firestore round-trip and user isolation');
} finally {
  for (const uid of ids) { assert.ok(uid.startsWith('balaqai-e2e-')); await db.collection('users').doc(uid).delete(); await auth.deleteUser(uid); }
  console.log('Synthetic test accounts and documents removed');
}
