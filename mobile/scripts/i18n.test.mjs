import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import test from 'node:test';
const root = path.resolve(import.meta.dirname, '..');
const catalog = JSON.parse(readFileSync(path.join(root, 'src/i18n/catalog.json'), 'utf8'));
const module = { exports: {} };
const compiled = ts.transpileModule(readFileSync(path.join(root, 'src/i18n/core.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
vm.runInNewContext(compiled, { exports: module.exports, require: () => catalog });
const { translate, setCurrentLanguage, getLocale } = module.exports;
test('Kazakh is the default and saved locale changes the date locale', () => {
 assert.equal(getLocale(), 'kk-KZ'); setCurrentLanguage('en'); assert.equal(getLocale(), 'en-GB'); setCurrentLanguage('ru'); assert.equal(getLocale(), 'ru-RU'); setCurrentLanguage('kk');
});
test('static labels, legacy Russian copy and dynamic values translate', () => {
 assert.equal(translate('Қолданба тілі', 'en'), 'App language');
 assert.equal(translate('Фолиевая кислота', 'kk'), 'Фолий қышқылы');
 assert.equal(translate('Жүктіліктің 8-аптасы', 'ru'), '8-я неделя беременности');
 assert.equal(translate('8 апта 3 күн', 'en'), '8 weeks 3 days');
 assert.equal(translate('1 апта 1 күн', 'en'), '1 week 1 day');
 assert.equal(translate('21 жаста', 'ru'), '21 год');
 assert.equal(translate('Google арқылы кіру', 'en'), 'Sign in with Google');
 assert.equal(translate('Жақындарыңызбен\nбөлісіңіз', 'en'), 'Share with loved ones');
 assert.equal(translate('YouTube: Жүктілік сапары: алғашқы қадамдар', 'en'), 'YouTube: Pregnancy journey: first steps');
});
test('every Cyrillic UI literal and template has a complete catalog entry', () => {
 const sources = new Set(catalog.flat().filter(Boolean).map(text => text.replace(/\s+/g, ' ').trim()));
 const missing = new Set();
 function check(text) { if (/[\u0400-\u04ff]/.test(text) && !sources.has(text.replace(/\s+/g, ' ').trim())) missing.add(text.trim()); }
 function walk(dir) { for (const entry of readdirSync(dir, { withFileTypes: true })) { const file = path.join(dir, entry.name); if (entry.isDirectory()) { if (entry.name !== 'i18n') walk(file); } else if (/\.tsx?$/.test(file)) { const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true); function visit(node) { if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isJsxText(node)) check(node.text); if (ts.isTemplateExpression(node)) check(node.head.text + node.templateSpans.map((span, i) => '{v' + i + '}' + span.literal.text).join('')); ts.forEachChild(node, visit); } visit(source); } } }
 walk(path.join(root, 'src')); assert.deepEqual([...missing], []);
 for (const row of catalog) { assert.ok(row[0] && row[1] && row[2]); assert.ok(!/[\u0400-\u04ff]/.test(row[2]), row[2]); }
});
