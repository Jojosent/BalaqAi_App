// Render real screen components with platform/service adapters; no browser or user account required.
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, '..', 'src');
let language = 'kk', buttons = [], history = ['/home'];
const cache = new Map();
function native(tag) { return function Native({ children, onPress, accessibilityLabel, style, ...props }) { if (onPress) buttons.push({ label: accessibilityLabel || '', onPress }); return React.createElement(tag, { ...(tag === 'button' ? { type: 'button' } : {}), ...(accessibilityLabel ? { 'aria-label': accessibilityLabel } : {}) }, children); }; }
const NativeView = native('div'), NativeText = native('span');
const nativeApi = { View: NativeView, Text: NativeText, TextInput: native('input'), Image: native('div'), Pressable: native('button'), ScrollView: NativeView, Modal: ({ visible, children }) => visible ? children : null, KeyboardAvoidingView: NativeView, Platform: { OS: 'web' }, Linking: {}, Share: {}, useWindowDimensions: () => ({ width: 375, height: 812 }), StyleSheet: { create: styles => styles, absoluteFill: { position: 'absolute', inset: 0 } } };
const flow = { profile: { name: 'Fixture', birthday: '01.01.1998', city: 'Астана' }, stage: 'pregnant', pregnancyStart: '2026-10-10', pregnancyNotes: { doctor: '', notes: '' }, checklist: [], trackingFolate: false, saveNow: async () => {}, syncStatus: 'saved' };
const router = { push: value => history.push(typeof value === 'string' ? value : value.pathname), canGoBack: () => history.length > 1, back: () => history.pop(), replace: value => { history[history.length - 1] = value; } };
function load(file) {
 const absolute = path.resolve(file);
 if (cache.has(absolute)) return cache.get(absolute).exports;
 if (absolute.endsWith('.json')) return JSON.parse(readFileSync(absolute, 'utf8'));
 if (absolute.endsWith('/Language') || /[\\/]i18n[\\/]Language\.tsx$/.test(absolute)) return { useLanguage: () => ({ language, t: text => load(path.join(root, 'i18n/core.ts')).translate(text, language), changeLanguage: async () => {}, error: '' }) };
 if (/[\\/]components[\\/]AuthFlow\.tsx$/.test(absolute)) return { useAuthFlow: () => flow };
 if (/[\\/]components[\\/]Session\.tsx$/.test(absolute)) return { useSession: () => ({ user: { uid: 'fixture', email: 'fixture@example.com' }, ready: true }) };
 if (/[\\/]services[\\/]privateState\.ts$/.test(absolute)) return { db: {}, usePrivateState: (_key, initial) => ({ value: initial, ready: true, error: '', update: async () => {} }) };
 if (/[\\/]services[\\/]sharing\.ts$/.test(absolute)) return { validInviteId: () => false };
 const module = { exports: {} }; cache.set(absolute, module);
 function localRequire(name) {
  if (name === 'react-native') return nativeApi;
  if (name === 'react-native-svg') { const names = ['Circle','Defs','LinearGradient','Path','Stop','Rect','Ellipse']; return { __esModule: true, default: ({ accessible: _accessible, ...props }) => React.createElement('svg', props), ...Object.fromEntries(names.map(key => [key, props => React.createElement(key === 'LinearGradient' ? 'linearGradient' : key.toLowerCase(), props)])) }; }
  if (name === 'expo-router') return { router, useLocalSearchParams: () => ({}) };
  if (name === 'react-native-safe-area-context') return { useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) };
  if (name === 'firebase/firestore' || name === 'expo-clipboard') return {};
  if (name === 'react-native-qrcode-svg') return { __esModule: true, default: () => null };
  if (name === '@react-native-async-storage/async-storage') return { __esModule: true, default: {} };
  if (name.startsWith('.')) { const candidate = path.resolve(path.dirname(absolute), name); if (/\.png$/.test(candidate)) return {}; const target = [candidate, candidate + '.ts', candidate + '.tsx', candidate + '.json'].find(p => existsSync(p)); assert.ok(target, candidate); return load(target); }
  return require(name);
 }
 const compiled = ts.transpileModule(readFileSync(absolute, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
 vm.runInNewContext(compiled, { exports: module.exports, require: localRequire, console, setTimeout, clearTimeout, setInterval, clearInterval, Date, Intl });
 return module.exports;
}
const PregnantHome = load(path.join(root, 'components/PregnantHome.tsx')).default;
const PlanningHome = load(path.join(root, 'components/HomeContent.tsx')).default;
const Tracker = load(path.join(root, 'app/tracker.tsx')).default;
const Tools = load(path.join(root, 'app/tracking-tools.tsx')).default;
const Shop = load(path.join(root, 'app/(main)/shop.tsx')).default;
const Connect = load(path.join(root, 'app/connect.tsx')).default;
function render(component) { buttons = []; return renderToStaticMarkup(React.createElement(component)); }
const normalize = text => text.replace(/\s+/g, ' ').trim();
test('mounted and hidden screen copies have isolated gradients and matching paint references', () => {
 const markup = renderToStaticMarkup(React.createElement(React.Fragment, null, ...[PregnantHome, PlanningHome, PregnantHome, Shop, Shop, Tracker, Tracker, Tools, Tools, Connect, Connect].map((component, key) => React.createElement(component, { key }))));
 const ids = [...markup.matchAll(/<linearGradient[^>]+id="([^"]+)"/g)].map(match => match[1]);
 assert.ok(ids.length >= 12); assert.equal(new Set(ids).size, ids.length);
 for (const svg of markup.matchAll(/<svg\b[\s\S]*?<\/svg>/g)) {
  for (const ref of svg[0].matchAll(/url\(#([^)]*)\)/g)) assert.ok(svg[0].includes(`id="${ref[1]}"`), 'paint reference must resolve within its own SVG');
 }
 assert.ok(markup.includes('fill="#087f70"'), 'curved header keeps a solid turquoise fallback');
});
test('share action and Back preserve the originating tab in all three languages', () => {
 const core = load(path.join(root, 'i18n/core.ts'));
 for (const lang of ['kk','ru','en']) {
  language = lang;
  for (const origin of ['/home','/account']) {
   history = [origin];
   if (origin === '/home') { render(PregnantHome); const share = buttons.find(button => normalize(button.label) === normalize(core.translate('Жақындарыңызбен бөлісіңіз', lang))); assert.ok(share, 'share card is present'); share.onPress(); } else router.push('/connect');
   const markup = render(Connect); assert.ok(markup.includes('‹'), 'Back arrow stays visible');
   const back = buttons.find(button => button.label === core.translate('Артқа', lang)); assert.ok(back); back.onPress();
   assert.deepEqual(history, [origin], 'Back must not replace the originating home with Profile');
  }
 }
});
test('a directly opened sharing screen returns safely to home without previous app history', () => {
 history = ['/connect']; render(Connect); buttons.find(button => button.label === load(path.join(root, 'i18n/core.ts')).translate('Артқа', language)).onPress(); assert.deepEqual(history, ['/home']);
});

test('home actions retain their destination and tracker/tools return to home in each language', () => {
 for (const lang of ['kk', 'ru', 'en']) {
  language = lang;
  for (const route of ['/tracking-tools','/momcare-tv','/tasks']) {
   render(PregnantHome); let found = false;
   for (const button of buttons) { history = ['/home']; button.onPress(); if (history.at(-1) === route) { found = true; break; } }
   assert.ok(found, 'home button reaches ' + route);
  }
  for (const Screen of [Tracker, Tools]) {
   history = ['/home','/detail']; render(Screen);
   const label = load(path.join(root, 'i18n/core.ts')).translate('Басты бетке оралу', lang);
   const back = buttons.find(button => button.label === label); assert.ok(back); back.onPress(); assert.deepEqual(history, ['/home']);
  }
 }
});
