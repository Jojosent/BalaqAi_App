import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import ts from 'typescript';
import test from 'node:test';
const root = path.resolve(import.meta.dirname, '..');
const module = { exports: {} };
vm.runInNewContext(ts.transpileModule(readFileSync(path.join(root, 'src/utils/rosie.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: module.exports });
test('animation boundaries match the requested week ranges without overlap', () => {
 const pick = module.exports.rosieForWeek;
 for (const [week, expected] of [[-1,null],[0,'first'],[1,'first'],[4,'first'],[5,'early'],[8,'early'],[9,'baby'],[12,'baby'],[13,'star'],[19,'star'],[20,'sleeping'],[21,'sleeping'],[41,'sleeping'],[42,'final']]) assert.equal(pick(week), expected, String(week));
});
test('all web animations contain multiple frames and an infinite loop, with transparency preserved where available', () => {
 const files = readdirSync(path.join(root, 'assets/animations')).filter(file => file.endsWith('.webp'));
 assert.equal(files.length, 8);
 for (const file of files) {
  const data = readFileSync(path.join(root, 'assets/animations', file));
  assert.equal(data.toString('ascii', 0, 4), 'RIFF');
  assert.equal(data.toString('ascii', 8, 12), 'WEBP');
  let frames = 0, alpha = false, loop;
  for (let offset = 12; offset + 8 <= data.length;) {
   const chunk = data.toString('ascii', offset, offset + 4), size = data.readUInt32LE(offset + 4);
   if (chunk === 'VP8X') alpha = Boolean(data[offset + 8] & 0x10);
   if (chunk === 'ANIM') loop = data.readUInt16LE(offset + 12);
   if (chunk === 'ANMF') frames++;
   offset += 8 + size + (size % 2);
  }
  if (file !== 'rosie-weeks-1-4.webp') assert.ok(alpha, file + ' alpha'); assert.ok(frames >= 20, file + ' motion'); assert.equal(loop, 0, file + ' loop');
  assert.ok(data.length < 3_500_000, file + ' mobile size');
 }
});
