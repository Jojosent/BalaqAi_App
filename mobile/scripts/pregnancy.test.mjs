import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePregnancy, draftStart, inputToKey, kazakhDate } from '../src/utils/pregnancy.ts';
import { pregnancyTrimester, trackerIllustration, trackerMeasurements } from '../src/utils/tracker.ts';

test('LMP adds 280 days across a year boundary, not the date in the mockup', () => {
  const result = calculatePregnancy('2026-08-12', '2026-10-10');
  assert.equal(result.weeks, 8);
  assert.equal(result.days, 3);
  assert.equal(result.due, '2027-05-19');
  assert.equal(kazakhDate(result.due), '19 мамыр 2027');
});
test('both methods agree for the same gestational age on the same civil date', () => {
  const reference = '2026-10-20';
  const age = draftStart({ method: 'age', lmp: '', weeks: '8', days: '3' }, reference);
  const lmp = draftStart({ method: 'lmp', lmp: '22.08.2026', weeks: '', days: '' }, reference);
  assert.equal(age, lmp);
  assert.equal(calculatePregnancy(age, reference).due, '2027-05-29');
});
test('invalid, future and out-of-range dates are rejected; leap day works', () => {
  assert.equal(inputToKey('31.02.2026'), '');
  assert.equal(inputToKey('29.02.2023'), '');
  assert.equal(inputToKey('29.02.2024'), '2024-02-29');
  assert.equal(calculatePregnancy('2024-02-29', '2024-03-01').totalDays, 1);
  assert.equal(calculatePregnancy('2024-02-29', '2024-03-01').due, '2024-12-05');
  assert.equal(draftStart({ method: 'lmp', lmp: '21.10.2026' }, '2026-10-20'), null);
  assert.equal(draftStart({ method: 'lmp', lmp: '01.01.2025' }, '2026-10-20'), null);
});
test('age bounds, missing inputs and exact week transitions', () => {
  const draft = { method: 'age', lmp: '', weeks: '42', days: '6' };
  const last = calculatePregnancy(draftStart(draft, '2026-10-20'), '2026-10-20');
  assert.equal(last.totalDays, 300);
  assert.equal(last.progress, 1);
  for (const change of [{ weeks: '43' }, { days: '7' }, { weeks: '' }, { days: '' }, { weeks: '-1' }]) {
    assert.equal(draftStart({ ...draft, ...change }, '2026-10-20'), null);
  }
  assert.equal(draftStart({ ...draft, weeks: '0', days: '0' }, '2026-10-20'), '2026-10-20');
  const nextDay = calculatePregnancy('2026-08-22', '2026-10-24');
  assert.equal(nextDay.weeks, 9);
  assert.equal(nextDay.days, 0);
});

test('tracker switches at 20 completed weeks and trimester boundaries use days', () => {
  assert.equal(trackerIllustration(19), 'moon');
  assert.equal(trackerIllustration(20), 'baby');
  assert.equal(trackerIllustration(42), 'baby');
  assert.equal(pregnancyTrimester(97), 1);
  assert.equal(pregnancyTrimester(98), 2);
  assert.equal(pregnancyTrimester(195), 2);
  assert.equal(pregnancyTrimester(196), 3);
  assert.deepEqual(trackerMeasurements(8), { length: 1.6, weight: 1 });
  assert.deepEqual(trackerMeasurements(4), { length: null, weight: null });
});
