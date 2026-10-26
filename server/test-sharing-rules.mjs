// Run with the Firestore emulator only. No real accounts or production data are used.
import assert from 'node:assert/strict';
const host = process.env.FIRESTORE_EMULATOR_HOST;
assert.ok(host, 'Start this test with firebase emulators:exec');
const project = 'demo-balaqai';
const root = `projects/${project}/databases/(default)/documents`;
const base = `http://${host}/v1/${root}`;
function token(uid) { const now = Math.floor(Date.now() / 1000); return Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url') + '.' + Buffer.from(JSON.stringify({ iss: `https://securetoken.google.com/${project}`, aud: project, sub: uid, user_id: uid, iat: now, exp: now + 3600, firebase: { identities: {}, sign_in_provider: 'password' } })).toString('base64url') + '.'; }
function value(data) { if (data === null) return { nullValue: null }; if (data instanceof Date) return { timestampValue: data.toISOString() }; if (typeof data === 'string') return { stringValue: data }; if (typeof data === 'boolean') return { booleanValue: data }; if (typeof data === 'number') return { integerValue: String(data) }; if (Array.isArray(data)) return { arrayValue: { values: data.map(value) } }; return { mapValue: { fields: fields(data) } }; }
const fields = data => Object.fromEntries(Object.entries(data).map(([key, item]) => [key, value(item)]));
async function request(path, uid, method = 'GET', data) { return fetch(`${base}/${path}`, { method, headers: { ...(uid ? { Authorization: 'Bearer ' + token(uid) } : {}), 'Content-Type': 'application/json' }, body: data ? JSON.stringify({ fields: fields(data) }) : undefined }); }
async function status(response, expected, label) { const r = await response; assert.equal(r.status, expected, `${label}: ${r.status} ${r.ok ? '' : await r.text()}`); }
async function commit(uid, writes) { return fetch(`http://${host}/v1/projects/${project}/databases/(default)/documents:commit`, { method: 'POST', headers: { Authorization: 'Bearer ' + token(uid), 'Content-Type': 'application/json' }, body: JSON.stringify({ writes: writes.map(({ path, data, time }) => ({ update: { name: `${root}/${path}`, fields: fields(data) }, ...(time ? { updateTransforms: [{ fieldPath: time, setToServerValue: 'REQUEST_TIME' }] } : {}) })) }) }); }
const id = 'a'.repeat(48), id2 = 'b'.repeat(48), owner = 'sharing-owner', member = 'sharing-member', other = 'sharing-other';
const invite = { ownerUid: owner, enabled: true, expiresAt: new Date(Date.now() + 86400000) };
const summary = { ownerUid: owner, name: 'Synthetic name', pregnancyStart: null, completed: 0, scope: { name: true, pregnancy: false, progress: false } };
await status(commit(owner, [{ path: `shareInvites/${id}`, data: invite, time: 'createdAt' }, { path: `shareData/${id}`, data: summary }, { path: `users/${owner}/settings/sharing`, data: { inviteId: id } }]), 200, 'atomic create invitation');
await status(request(`shareData/${id}`, owner), 200, 'owner read');
await status(request(`shareData/${id}`, member), 403, 'non-member denied');
await status(request(`shareData/${id}`, null), 403, 'anonymous denied');
await status(request(`shareInvites/${id}`, member), 200, 'invitation metadata');
await status(request('shareInvites', member), 403, 'no invitation enumeration');
await status(request(`shareInvites/${id}/members/${other}`, member, 'PATCH', { active: true }), 403, 'cannot add another viewer');
await status(commit(member, [{ path: `shareInvites/${id}/members/${member}`, data: { active: true } }, { path: `users/${member}/connections/${id}`, data: { ownerUid: owner } }]), 200, 'accept invitation');
await status(request(`shareData/${id}`, member), 200, 'accepted viewer read');
await status(request(`shareData/${id}`, other), 403, 'unrelated viewer denied');
await status(request(`users/${owner}`, member), 403, 'no access to whole profile');
await status(request(`shareData/${id}`, member, 'PATCH', summary), 403, 'viewer cannot write summary');
await status(request(`shareData/${id}`, owner, 'PATCH', { ...summary, pregnancyStart: '2026-01-01' }), 403, 'unselected pregnancy cannot be shared');
await status(request(`shareData/${id}`, owner, 'PATCH', { ...summary, notes: 'private' }), 403, 'private extra fields denied');
await status(request(`shareInvites/${id}/members/${member}`, owner, 'PATCH', { active: false }), 200, 'revoke member');
await status(request(`shareData/${id}`, member), 403, 'revocation effective');
await status(request(`shareInvites/${id}/members/${member}`, member, 'PATCH', { active: true }), 403, 'cannot undo revocation');
await status(request(`shareInvites/${id}`, owner, 'PATCH', { ...invite, createdAt: new Date(), enabled: false }), 403, 'cannot alter immutable invitation');
const invitation = await (await request(`shareInvites/${id}`, owner)).json();
const disable = await fetch(`${base}/shareInvites/${id}?updateMask.fieldPaths=enabled`, { method: 'PATCH', headers: { Authorization: 'Bearer ' + token(owner), 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: { enabled: value(false) } }) });
assert.equal(disable.status, 200, await disable.text());
await status(request(`shareInvites/${id}/members/${other}`, other, 'PATCH', { active: true }), 403, 'disabled invitation rejected');
await status(commit(owner, [{ path: `shareInvites/${id2}`, data: { ...invite, expiresAt: new Date(Date.now() - 1000) }, time: 'createdAt' }]), 403, 'past expiry denied');
await status(request(`users/${owner}/settings/preferences`, owner, 'PATCH', { language: 'ru' }), 200, 'save locale');
await status(request(`users/${owner}/settings/preferences`, member), 403, 'private locale');
await status(request(`users/${owner}/settings/preferences`, owner, 'PATCH', { language: 'xx' }), 403, 'invalid locale');
await status(request(`users/${owner}/settings/shop`, owner, 'PATCH', { favourites: ['pillow'] }), 200, 'save wishlist');
await status(request(`users/${owner}/settings/community`, owner, 'PATCH', { liked: ['kamala'], saved: [], followed: ['sneha'] }), 200, 'save community actions');
await status(request(`users/${owner}/settings/community`, other, 'PATCH', { liked: [], saved: [], followed: [] }), 403, 'foreign actions denied');
await status(request(`users/${owner}/reminders/test`, owner, 'PATCH', { title: 'Synthetic reminder', at: Date.now(), done: false }), 200, 'save reminder');
await status(request(`users/${owner}/reminders/test`, other), 403, 'private reminder');
await status(request(`users/${owner}/reminders/test`, owner, 'PATCH', { title: '', at: 1, done: false }), 403, 'invalid reminder');
await status(commit(member, [{ path: 'communityPosts/kamala/comments/test', data: { uid: member, postId: 'kamala', author: 'Synthetic member', text: 'Synthetic comment' }, time: 'at' }]), 200, 'publish comment');
await status(request('communityPosts/kamala/comments/test', owner), 200, 'signed-in reader');
await status(request('communityPosts/kamala/comments/test', null), 403, 'anonymous comment access denied');
await status(request('communityPosts/kamala/comments/test', owner, 'DELETE'), 403, 'cannot delete another comment');
await status(request('communityPosts/kamala/comments/test', member, 'DELETE'), 200, 'delete own comment');
console.log('Sharing, revocation, privacy, preferences, reminders and community rules passed.');
