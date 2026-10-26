// Uses synthetic accounts to test the deployed client rules. Run only locally.
import assert from 'node:assert/strict';
import { randomUUID, randomBytes } from 'node:crypto';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
initializeApp({ credential: applicationDefault(), projectId: 'balaqaidb' });
const auth = getAuth(), database = getFirestore();
const apiKey = process.env.FIREBASE_WEB_API_KEY;
if (!apiKey) throw new Error('Set FIREBASE_WEB_API_KEY');
const accounts = [];
const testInvites = [];
const base = 'https://firestore.googleapis.com/v1/projects/balaqaidb/databases/(default)/documents';
function value(data) {
  if (data instanceof Date) return { timestampValue: data.toISOString() };
  if (data === null) return { nullValue: null };
  if (typeof data === 'string') return { stringValue: data };
  if (typeof data === 'boolean') return { booleanValue: data };
  if (typeof data === 'number') return Number.isInteger(data) ? { integerValue: String(data) } : { doubleValue: data };
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
  const customTasks = { first: ['Synthetic custom task'], second: [], third: [], bag: [], home: [] };
  const savedTasks = { ...fixture, customTasks, checklist: [...fixture.checklist, 'todo:first:custom:0'] };
  assert.equal((await request(owner.uid, owner.token, 'PATCH', savedTasks)).status, 200);
  const restored = await (await request(owner.uid, owner.token)).json();
  assert.equal(restored.fields.data.mapValue.fields.customTasks.mapValue.fields.first.arrayValue.values[0].stringValue, 'Synthetic custom task');
  async function tracking(path, token, method = 'GET', data) {
    return fetch(base + '/users/' + owner.uid + '/' + path + '?key=' + apiKey, { method, headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: data ? JSON.stringify({ fields: Object.fromEntries(Object.entries(data).map(([key, item]) => [key, value(item)])) }) : undefined });
  }
  const startedAt = Date.now(), kick = { startedAt, endedAt: null, count: 2 };
  let kicked;
  for (let attempt = 0; attempt < 12; attempt++) {
    kicked = await tracking('kickSessions/' + startedAt, owner.token, 'PATCH', kick);
    if (kicked.status !== 403) break;
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  assert.equal(kicked.status, 200, await kicked.text());
  assert.equal((await tracking('kickSessions/' + startedAt, other.token)).status, 403);
  const restoredKick = await (await tracking('kickSessions/' + startedAt, owner.token)).json();
  assert.equal(restoredKick.fields.count.integerValue, '2');
  assert.equal((await tracking('kickSessions/' + startedAt, owner.token, 'PATCH', { ...kick, count: -1 })).status, 403);
  assert.equal((await tracking('kickSessions/wrong-id', owner.token, 'PATCH', kick)).status, 403);
  const weight = { baseline: 61, reminder: true };
  assert.equal((await tracking('tracking/weight', owner.token, 'PATCH', weight)).status, 200);
  assert.equal((await tracking('tracking/weight', other.token)).status, 403);
  const weightEntry = { at: startedAt, kg: 64.5, week: 8 };
  assert.equal((await tracking('weightEntries/' + startedAt, owner.token, 'PATCH', weightEntry)).status, 200);
  const restoredWeight = await (await tracking('weightEntries/' + startedAt, owner.token)).json();
  assert.equal(restoredWeight.fields.kg.doubleValue, 64.5);
  assert.equal((await tracking('weightEntries/' + startedAt, other.token)).status, 403);
  assert.equal((await tracking('weightEntries/' + startedAt, owner.token, 'PATCH', { ...weightEntry, kg: 0 })).status, 403);
  assert.equal((await tracking('tracking/weight', owner.token, 'PATCH', { ...weight, baseline: 0 })).status, 403);
  const moodEntry = { at: startedAt, mood: 'cheerful' };
  let savedMood;
  for (let attempt = 0; attempt < 12; attempt++) {
    savedMood = await tracking('moodEntries/' + startedAt, owner.token, 'PATCH', moodEntry);
    if (savedMood.status !== 403) break;
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  assert.equal(savedMood.status, 200, await savedMood.text());
  const restoredMood = await (await tracking('moodEntries/' + startedAt, owner.token)).json();
  assert.equal(restoredMood.fields.mood.stringValue, 'cheerful');
  assert.equal((await tracking('moodEntries/' + startedAt, other.token)).status, 403);
  assert.equal((await tracking('moodEntries/' + startedAt, other.token, 'PATCH', moodEntry)).status, 403);
  assert.equal((await tracking('moodEntries/' + startedAt, owner.token, 'PATCH', { ...moodEntry, mood: 'unknown' })).status, 403);
  assert.equal((await tracking('moodEntries/wrong-id', owner.token, 'PATCH', moodEntry)).status, 403);
  assert.equal((await fetch(base + '/users/' + owner.uid + '/moodEntries?key=' + apiKey)).status, 403);
  for (const group of ['first', 'second', 'third', 'bag', 'home']) {
    const maximum = await tracking('customTasks/' + group, owner.token, 'PATCH', { tasks: Array(10).fill('Task') });
    assert.equal(maximum.status, 200, await maximum.text());
    assert.equal((await tracking('customTasks/' + group, other.token)).status, 403);
  }
  assert.equal((await tracking('customTasks/first', owner.token, 'PATCH', { tasks: Array(11).fill('Task') })).status, 403);
  assert.equal((await tracking('customTasks/first', owner.token, 'PATCH', { tasks: [5] })).status, 403);
  assert.equal((await request(owner.uid, owner.token, 'PATCH', { ...fixture, customTasks: { ...customTasks, first: ['x'.repeat(161)] } })).status, 403);
  assert.equal((await request(owner.uid, owner.token, 'PATCH', { ...fixture, customTasks: { ...customTasks, bag: Array(11).fill('Task') } })).status, 403);
  assert.equal((await request(owner.uid, other.token)).status, 403);
  assert.equal((await request(owner.uid, other.token, 'PATCH', fixture)).status, 403);
  assert.equal((await request(unverified.uid, unverified.token, 'PATCH', fixture)).status, 200);
  assert.equal((await request(unverified.uid, unverified.token)).status, 200);
  assert.equal((await request(unverified.uid, owner.token)).status, 403);
  assert.equal((await request(owner.uid)).status, 403);
  assert.equal((await request(owner.uid, owner.token, 'PATCH', { ...fixture, uid: other.uid })).status, 403);
  assert.equal((await request(owner.uid, owner.token, 'PATCH', { ...fixture, profile: { ...fixture.profile, name: 'x'.repeat(81) } })).status, 403);
  assert.equal((await fetch(`${base}/users?key=${apiKey}`, { headers: { Authorization: `Bearer ${owner.token}` } })).status, 403);
  for (const [path, data] of [['settings/preferences', { language: 'en' }], ['settings/shop', { favourites: ['pillow'] }], ['settings/community', { liked: ['kamala'], saved: [], followed: [] }], ['reminders/test', { title: 'Synthetic reminder', at: startedAt, done: false }]]) {
    let response;
    for (let attempt = 0; attempt < 12; attempt++) { response = await tracking(path, owner.token, 'PATCH', data); if (response.status !== 403) break; await new Promise(resolve => setTimeout(resolve, 5000)); }
    assert.equal(response.status, 200, await response.text());
    assert.equal((await tracking(path, other.token)).status, 403);
  }
  async function feature(path, token, method = 'GET', data) { return fetch(base + '/' + path + '?key=' + apiKey, { method, headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: data ? JSON.stringify({ fields: Object.fromEntries(Object.entries(data).map(([key, item]) => [key, value(item)])) }) : undefined }); }
  async function batchFeature(token, writes) { return fetch(base + ':commit?key=' + apiKey, { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ writes: writes.map(({ path, data, time }) => ({ update: { name: 'projects/balaqaidb/databases/(default)/documents/' + path, fields: Object.fromEntries(Object.entries(data).map(([key, item]) => [key, value(item)])) }, ...(time ? { updateTransforms: [{ fieldPath: time, setToServerValue: 'REQUEST_TIME' }] } : {}) })) }) }); }
  const inviteId = randomBytes(24).toString('hex'); testInvites.push(inviteId);
  const shared = { ownerUid: owner.uid, name: 'Synthetic test', pregnancyStart: null, completed: 0, scope: { name: true, pregnancy: false, progress: false } };
  const madeInvite = await batchFeature(owner.token, [{ path: 'shareInvites/' + inviteId, data: { ownerUid: owner.uid, enabled: true, expiresAt: new Date(Date.now() + 86400000) }, time: 'createdAt' }, { path: 'shareData/' + inviteId, data: shared }, { path: 'users/' + owner.uid + '/settings/sharing', data: { inviteId } }]);
  assert.equal(madeInvite.status, 200, await madeInvite.text());
  assert.equal((await feature('shareData/' + inviteId, other.token)).status, 403);
  const joined = await batchFeature(other.token, [{ path: 'shareInvites/' + inviteId + '/members/' + other.uid, data: { active: true } }, { path: 'users/' + other.uid + '/connections/' + inviteId, data: { ownerUid: owner.uid } }]);
  assert.equal(joined.status, 200, await joined.text());
  assert.equal((await feature('shareData/' + inviteId, other.token)).status, 200);
  assert.equal((await feature('shareData/' + inviteId, unverified.token)).status, 403);
  assert.equal((await feature('shareInvites/' + inviteId + '/members/' + other.uid, owner.token, 'PATCH', { active: false })).status, 200);
  assert.equal((await feature('shareData/' + inviteId, other.token)).status, 403);
  assert.equal((await feature('shareInvites/' + inviteId + '/members/' + other.uid, other.token, 'PATCH', { active: true })).status, 403);
  console.log('PASS: sharing acceptance/revocation, private settings and reminders');
  console.log('PASS: direct Web Firestore save/read, own-user isolation, email/password without verification, field validation and blocked listing');
} finally {
  for (const id of testInvites) { const invite = database.collection('shareInvites').doc(id); const members = await invite.collection('members').get(); for (const member of members.docs) await member.ref.delete(); await database.collection('shareData').doc(id).delete(); await invite.delete(); }
  for (const { uid } of accounts) { assert.ok(uid.startsWith('balaqai-rules-')); const root = database.collection('users').doc(uid); for (const name of ['kickSessions', 'tracking', 'weightEntries', 'customTasks', 'moodEntries', 'settings', 'reminders', 'connections']) { const children = await root.collection(name).get(); for (const item of children.docs) await item.ref.delete(); } await root.delete(); await auth.deleteUser(uid); }
  console.log('Synthetic rules-test accounts and documents removed');
}
