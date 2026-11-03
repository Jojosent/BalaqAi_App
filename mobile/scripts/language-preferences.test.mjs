import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import test from 'node:test';
const file = path.resolve(import.meta.dirname, '../src/i18n/languagePreferences.ts');
const module = { exports: {} };
vm.runInNewContext(ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: module.exports });
const { createLanguagePreferences } = module.exports;
function fixture(initial = {}, remoteInitial = {}) {
 const local = new Map(Object.entries(initial)), remote = new Map(Object.entries(remoteInitial));
 let failWrite = false;
 const storage = { getItem: async key => local.get(key) ?? null, setItem: async (key, value) => local.set(key, value), removeItem: async key => local.delete(key) };
 const read = async uid => remote.get(uid);
 const write = async (uid, language) => { if (failWrite) throw Error('offline'); remote.set(uid, language); };
 return { local, remote, storage, read, write, preferences: createLanguagePreferences(storage, read, write), fail: value => { failWrite = value; } };
}
test('explicit guest language survives login and overrides an older account language', async () => {
 for (const language of ['kk','ru','en']) {
  const f = fixture({}, { alice: language === 'kk' ? 'en' : 'kk' });
  await f.preferences.select(null, language);
  const seen = []; await f.preferences.load('alice', next => seen.push(next), () => true);
  assert.deepEqual(seen, [language]); assert.equal(f.remote.get('alice'), language);
  assert.equal(f.local.get('balaqai.language.alice'), language);
  assert.equal(f.local.has('balaqai.language.guest.pending'), false);
  const reloaded = createLanguagePreferences(f.storage, f.read, f.write), restored = [];
  await reloaded.load('alice', next => restored.push(next), () => true);
  assert.ok(restored.every(next => next === language));
 }
});
test('without a new guest selection each account keeps its own saved language', async () => {
 const f = fixture({ 'balaqai.language.guest': 'en' }, { alice: 'ru', bob: 'kk' });
 let result;
 await f.preferences.load('alice', next => { result = next; }, () => true); assert.equal(result, 'ru');
 await f.preferences.load('bob', next => { result = next; }, () => true); assert.equal(result, 'kk');
});
test('offline handoff stays bound to its account and retries after reload', async () => {
 const f = fixture({}, { alice: 'kk', bob: 'kk' });
 await f.preferences.select(null, 'en'); f.fail(true);
 await assert.rejects(f.preferences.load('alice', () => {}, () => true));
 assert.equal(f.local.get('balaqai.language.alice.pending'), 'en');
 assert.equal(f.local.has('balaqai.language.guest.pending'), false);
 f.fail(false); let result;
 await f.preferences.load('bob', next => { result = next; }, () => true); assert.equal(result, 'kk');
 await f.preferences.load('alice', next => { result = next; }, () => true); assert.equal(result, 'en');
 assert.equal(f.remote.get('alice'), 'en'); assert.equal(f.local.has('balaqai.language.alice.pending'), false);
});
test('late account reads cannot replace a newer choice', async () => {
 const f = fixture(); let release, current = true;
 const slowRead = () => new Promise(resolve => { release = resolve; });
 const preferences = createLanguagePreferences(f.storage, slowRead, f.write);
 const seen = []; const loading = preferences.load('alice', next => seen.push(next), () => current);
 while (!release) await new Promise(resolve => setTimeout(resolve, 0));
 current = false; const selection = preferences.select('alice', 'ru'); release('en');
 await Promise.all([loading, selection]);
 assert.equal(seen.includes('en'), false); assert.equal(f.remote.get('alice'), 'ru');
});
test('rapid language changes persist the last selection', async () => {
 const f = fixture();
 await Promise.all(['ru','en','kk'].map(language => f.preferences.select(null, language)));
 await f.preferences.load('alice', () => {}, () => true);
 assert.equal(f.remote.get('alice'), 'kk');
});
