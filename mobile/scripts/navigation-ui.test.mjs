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
let openedUrls = [];
let language = 'kk', buttons = [], history = ['/home'], routeParams = {}, navigations = [];
const cache = new Map();
function native(tag) { return function Native({ children, onPress, accessibilityLabel, style, ...props }) { if (onPress) buttons.push({ label: accessibilityLabel || '', onPress, role: props.accessibilityRole, checked: props.accessibilityState?.checked }); return React.createElement(tag, { ...(tag === 'button' ? { type: 'button' } : {}), ...(accessibilityLabel ? { 'aria-label': accessibilityLabel } : {}) }, children); }; }
const NativeView = native('div'), NativeText = native('span');
const nativeApi = { View: NativeView, Text: NativeText, TextInput: native('input'), Image: native('div'), Pressable: native('button'), ScrollView: NativeView, Modal: ({ visible, children }) => visible ? children : null, KeyboardAvoidingView: NativeView, Platform: { OS: 'web' }, Linking: { openURL: async url => { openedUrls.push(url); } }, Share: {}, useWindowDimensions: () => ({ width: 375, height: 812 }), StyleSheet: { create: styles => styles, absoluteFill: { position: 'absolute', inset: 0 } } };
const flow = { profile: { name: 'Fixture', birthday: '01.01.1998', city: 'Астана' }, stage: 'pregnant', pregnancyStart: '2026-10-10', pregnancyNotes: { doctor: '', notes: '' }, checklist: [], trackingFolate: false, saveNow: async () => {}, syncStatus: 'saved', toggleChecklist: id => { flow.checklist = flow.checklist.includes(id) ? flow.checklist.filter(item => item !== id) : [...flow.checklist, id]; } };
const router = { push: value => { navigations.push(value); history.push(typeof value === 'string' ? value : value.pathname); }, canGoBack: () => history.length > 1, back: () => history.pop(), replace: value => { history[history.length - 1] = value; } };
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
  if (name === 'expo-router') return { router, useLocalSearchParams: () => routeParams };
  if (name === 'react-native-safe-area-context') return { useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) };
  if (name === 'firebase/firestore' || name === 'expo-clipboard') return {};
  if (name === 'react-native-qrcode-svg') return { __esModule: true, default: () => null };
  if (name === '@react-native-async-storage/async-storage') return { __esModule: true, default: {} };
  if (name.startsWith('.')) { const candidate = path.resolve(path.dirname(absolute), name); if (/\.(png|jpg)$/.test(candidate)) return {}; const target = [candidate, candidate + '.ts', candidate + '.tsx', candidate + '.json'].find(p => existsSync(p)); assert.ok(target, candidate); return load(target); }
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
const Tasks = load(path.join(root, 'app/tasks.tsx'));
const prenatal = load(path.join(root, 'data/prenatalTasks.ts'));
const TaskInfo = load(path.join(root, 'app/task-info.tsx')).default;
const articles = load(path.join(root, 'data/taskArticles.ts'));
const Connect = load(path.join(root, 'app/connect.tsx')).default;
function render(component) { buttons = []; return renderToStaticMarkup(React.createElement(component)); }
const normalize = text => text.replace(/\s+/g, ' ').trim();
test('mounted and hidden screen copies have isolated gradients and matching paint references', () => {
 const markup = renderToStaticMarkup(React.createElement(React.Fragment, null, ...[PregnantHome, PlanningHome, PregnantHome, Shop, Shop, Tracker, Tracker, Tools, Tools, Connect, Connect, Tasks.default, Tasks.default].map((component, key) => React.createElement(component, { key }))));
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

test('new task cards expand without overwriting personal checklist marks', () => {
 const personalMark = 'todo:first:default:0';
 for (const lang of ['kk', 'ru', 'en']) {
  language = lang;
  const page = render(Tasks.default); assert.ok(page.includes(load(path.join(root, 'i18n/core.ts')).translate('Тапсырмалар тізімі', lang)));
  for (const section of prenatal.prenatalSections) {
   flow.checklist = [personalMark]; let toggled = false;
   render(() => React.createElement(Tasks.TaskSection, { section, open: false, onToggle: () => { toggled = true; } }));
   assert.equal(buttons.filter(button => button.role === 'checkbox').length, 0);
   buttons.find(button => button.role === 'button').onPress(); assert.ok(toggled);
   render(() => React.createElement(Tasks.TaskSection, { section, open: true, onToggle: () => {} }));
   const checks = buttons.filter(button => button.role === 'checkbox'); assert.equal(checks.length, section.tasks.length);
   checks[0].onPress(); assert.ok(flow.checklist.includes(prenatal.prenatalTaskKey(section.id, section.tasks[0].id))); assert.ok(flow.checklist.includes(personalMark));
   render(() => React.createElement(Tasks.TaskSection, { section, open: true, onToggle: () => {} }));
   const saved = buttons.find(button => button.role === 'checkbox'); assert.equal(saved.checked, true); saved.onPress(); assert.deepEqual(flow.checklist, [personalMark]);
  }
 }
 flow.checklist = [];
});

test('every horse opens its own article without changing the checklist', () => {
 const core = load(path.join(root, 'i18n/core.ts'));
 for (const lang of ['kk','ru','en']) {
  language = lang; flow.checklist = ['todo:first:default:0'];
  for (const section of prenatal.prenatalSections) {
   render(() => React.createElement(Tasks.TaskSection, { section, open: true, onToggle: () => {} }));
   const info = buttons.filter(button => button.label.startsWith(core.translate('Ақпарат', lang) + ':'));
   assert.equal(info.length, section.tasks.length);
   for (const button of info) { history = ['/tasks']; button.onPress(); const action = navigations.at(-1); assert.equal(action.pathname, '/task-info'); assert.ok(articles.getTaskArticle(action.params.topic)); assert.deepEqual(flow.checklist, ['todo:first:default:0']); }
  }
  flow.stage = 'planning'; render(PlanningHome);
  const planningInfo = buttons.filter(button => button.label.startsWith(core.translate('Ақпарат', lang) + ':')); assert.equal(planningInfo.length, 8);
  const ids = new Set();
  for (const button of planningInfo) { history = ['/home']; button.onPress(); const action = navigations.at(-1); assert.equal(action.pathname, '/task-info'); assert.equal(action.params.from, 'home'); ids.add(action.params.topic); assert.ok(articles.getTaskArticle(action.params.topic)); }
  assert.equal(ids.size, 8);
 }
 flow.stage = 'pregnant'; flow.checklist = [];
});
test('article close and acknowledgment return to the same list for every topic and language', () => {
 const core = load(path.join(root, 'i18n/core.ts'));
 for (const lang of ['kk','ru','en']) for (const [topic, article] of Object.entries(articles.taskArticles)) {
  language = lang; routeParams = { topic, from: 'tasks' }; history = ['/tasks','/task-info'];
  const html = render(TaskInfo).replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&'); assert.ok(html.includes(core.translate(article.title, lang)), topic + ' title ' + lang); assert.ok(html.includes(core.translate(article.body, lang)), topic + ' body ' + lang);
  const close = buttons.find(button => button.label === core.translate('Жабу', lang)); assert.ok(close); close.onPress(); assert.deepEqual(history, ['/tasks']);
  history = ['/tasks','/task-info']; buttons.find(button => button.role === 'button' && !button.label).onPress(); assert.deepEqual(history, ['/tasks']);
 }
 routeParams = { topic: 'constructor', from: 'home' }; history = ['/task-info']; const html = render(TaskInfo).replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&'); assert.ok(html.includes(articles.getTaskArticle('constructor') === null ? load(path.join(root, 'i18n/core.ts')).translate('Ақпарат табылмады', language) : 'unexpected')); buttons.find(button => button.label === core.translate('Жабу', language)).onPress(); assert.deepEqual(history, ['/home']); routeParams = {};
});

const Hospitals = load(path.join(root, 'app/city-hospitals.tsx')).default;
const cityData = load(path.join(root, 'data/cityLocations.ts'));
const BottomNav = load(path.join(root, 'components/BottomNav.tsx')).BottomNav;
const personal = load(path.join(root, 'utils/tasks.ts'));
test('all personal and prenatal tasks have explanations', () => {
 for (const group of personal.taskGroups) {
  assert.ok(articles.getTaskArticle(`personal-${group.id}`)?.body);
  group.tasks.forEach((_, index) => assert.ok(articles.getTaskArticle(`personal-${group.id}-${index}`)?.body));
 }
 for (const section of prenatal.prenatalSections) for (const task of section.tasks) assert.ok(articles.getTaskArticle(task.article));
});
test('hospital links use only addresses from the saved city and return to the article', async () => {
 const previousCity = flow.profile.city;
 for (const lang of ['kk','ru','en']) for (const city of cityData.cityLocations) {
  language = lang; flow.profile.city = city.city; history = ['/tasks','/task-info','/city-hospitals']; openedUrls = [];
  render(Hospitals);
  const links = buttons.filter(button => button.role === 'link');
  assert.equal(links.length, city.addresses.length);
  for (const link of links) { await link.onPress(); const url = new URL(openedUrls.at(-1)); assert.equal(url.origin, 'https://www.google.com'); assert.equal(url.searchParams.get('query'), link.label + ', Kazakhstan'); }
  buttons.find(button => button.role === 'button').onPress(); assert.deepEqual(history, ['/tasks','/task-info']);
 }
 flow.profile.city = 'unknown'; render(Hospitals); assert.equal(buttons.filter(button => button.role === 'link').length, 0);
 flow.profile.city = previousCity;
});
test('bottom menu retains complete translated labels and each destination', () => {
 const core = load(path.join(root, 'i18n/core.ts'));
 for (const lang of ['kk','ru','en']) {
  language = lang; const destinations = [];
  const html = render(() => React.createElement(BottomNav, { active: 'home', onSelect: name => destinations.push(name) }));
  const tabs = buttons.filter(button => button.role === 'tab'); assert.equal(tabs.length, 4);
  for (const label of ['Басты бет','Қауымдастық','Дүкен','Профиль']) assert.ok(html.includes(core.translate(label, lang)));
  tabs.forEach(button => button.onPress()); assert.deepEqual(destinations, ['home','community','shop','account']);
 }
});
