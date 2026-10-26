import test from 'node:test';
import assert from 'node:assert/strict';
import { parseWeight, addWeightEntry, validWeightTracker, weightText } from '../src/utils/weight.ts';
test('weight input accepts comma and dot, rejects invalid or out-of-range input', () => {
  assert.equal(parseWeight(' 64,5 '), 64.5);
  assert.equal(parseWeight('61'), 61);
  assert.equal(parseWeight('400.0'), 400);
  for (const text of ['', '0', '19.9', '400.1', '64kg', '1e2', '64.55', 'NaN']) assert.equal(parseWeight(text), null, text);
});
test('save diary, maintain newest-first limit and restore valid measurements', () => {
  let value = { baseline: 61, reminder: true, entries: [] };
  for (let i = 1; i <= 35; i++) value = addWeightEntry(value, 64.5, 1000 + i, 8);
  assert.equal(value.entries.length, 30);
  assert.equal(value.entries[0].at, 1035);
  assert.equal(value.entries[29].at, 1006);
  assert.equal(validWeightTracker(JSON.parse(JSON.stringify(value))), true);
  assert.equal(weightText(64.5), '64.5 кг');
  assert.equal(validWeightTracker({ ...value, baseline: 0 }), false);
  assert.equal(validWeightTracker({ ...value, entries: [{ at: 1000, kg: -1, week: 8 }] }), false);
});
