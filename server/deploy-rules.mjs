// Run locally: node --env-file=.env deploy-rules.mjs. Never upload the Admin key.
import { readFileSync } from 'node:fs';
import { cert } from 'firebase-admin/app';
const project = process.env.FIREBASE_PROJECT_ID || 'balaqaidb';
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) throw new Error('GOOGLE_APPLICATION_CREDENTIALS is required locally');
const credential = cert(JSON.parse(readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8')));
const { access_token } = await credential.getAccessToken();
const headers = { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' };
const base = `https://firebaserules.googleapis.com/v1/projects/${project}`;
async function call(path, init) {
  const response = await fetch(`${base}/${path}`, { ...init, headers });
  const result = await response.json();
  if (!response.ok) throw new Error(`Rules API ${response.status}: ${result.error?.message || 'failed'}`);
  return result;
}
const previous = await call('releases/cloud.firestore');
const rules = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');
const created = await call('rulesets', { method: 'POST', body: JSON.stringify({ source: { files: [{ name: 'firestore.rules', content: rules }] } }) });
await call('releases/cloud.firestore', { method: 'PATCH', body: JSON.stringify({ release: { name: `projects/${project}/releases/cloud.firestore`, rulesetName: created.name }, updateMask: 'rulesetName' }) });
console.log(`Rules published: ${created.name}`);
console.log(`Previous ruleset (rollback): ${previous.rulesetName}`);
