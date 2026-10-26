import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, Image, Keyboard, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useAuthSize, Notice } from '../components/AuthUI';
import { useAuthFlow } from '../components/AuthFlow';
import { useSession } from '../components/Session';
import { calculatePregnancy, todayKey } from '../utils/pregnancy';
import { loadWeightTracker, saveWeightTracker } from '../services/weight';
import { addWeightEntry, parseWeight, weightText, type WeightEntry, type WeightTracker } from '../utils/weight';

function dayText(at: number) { const date = new Date(at); return date.toDateString() === new Date().toDateString() ? 'Бүгін' : new Intl.DateTimeFormat('kk-KZ', { day: '2-digit', month: 'short' }).format(date); }
export default function WeightTrackerScreen() {
  const { s, pageWidth } = useAuthSize();
  const insets = useSafeAreaInsets();
  const { user } = useSession();
  const { pregnancyStart, stage } = useAuthFlow();
  const [tracker, setTracker] = useState<WeightTracker | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [baseline, setBaseline] = useState('');
  const [current, setCurrent] = useState('');
  const [reminder, setReminder] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<WeightEntry | null>(null);
  const [settings, setSettings] = useState(false);
  useEffect(() => {
    if (!user) return;
    let live = true;
    loadWeightTracker(user.uid).then(data => { if (live) { setTracker(data); setBaseline(data ? String(data.baseline) : ''); setReminder(data?.reminder ?? false); setLoaded(true); setError(''); } }).catch(() => { if (live) setError('Күнделік жүктелмеді. Интернет байланысын тексеріңіз.'); });
    return () => { live = false; };
  }, [user, loadAttempt]);
  const setup = !tracker || settings;
  const baselineKg = parseWeight(baseline), currentKg = parseWeight(current);
  async function save() {
    if (!user || !loaded || busy) return;
    const base = setup ? baselineKg : tracker?.baseline;
    if (base == null || (!settings && currentKg === null) || (current.trim() && currentKg === null)) { setError('20–400 кг аралығындағы санды енгізіңіз (ең көбі бір ондық таңба).'); return; }
    const at = Date.now();
    const result = stage === 'pregnant' && pregnancyStart ? calculatePregnancy(pregnancyStart, todayKey(new Date(at))) : null;
    let next: WeightTracker = { baseline: base, reminder, entries: tracker?.entries || [] };
    if (currentKg !== null) next = addWeightEntry(next, currentKg, at, result ? Math.min(42, result.weeks) : null);
    Keyboard.dismiss(); setBusy(true); setError('');
    try { await saveWeightTracker(user.uid, next, tracker); setTracker(next); setCurrent(''); setSettings(false); }
    catch { setError('Сақталмады. Байланысты тексеріп, қайта сақтаңыз.'); }
    finally { setBusy(false); }
  }
  const inputStyle = { minHeight: s(44), borderWidth: 1, borderColor: '#e6e4e4', borderRadius: s(26), paddingHorizontal: s(20), fontSize: s(16), color: '#151b18' };
  return <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}><View style={{ flex: 1, width: pageWidth }}>
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: Math.max(insets.bottom + s(18), s(28)) }}>
      <View style={{ backgroundColor: '#fff3f4', borderBottomLeftRadius: s(25), borderBottomRightRadius: s(25), overflow: 'hidden', paddingTop: Math.max(insets.top + s(14), s(55)), paddingBottom: s(setup ? 57 : 20) }}>
        <Image source={require('../../assets/images/weight-header.png')} accessible={false} resizeMode="contain" style={{ position: 'absolute', right: 0, top: s(-18), width: s(290), height: s(205) }} />
        <Svg pointerEvents="none" width="100%" height={s(75)} style={{ position: 'absolute', top: s(140) }}><Defs><LinearGradient id="weight-fade" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#fff3f4" stopOpacity={0} /><Stop offset="1" stopColor="#fff3f4" /></LinearGradient></Defs><Rect width="100%" height="100%" fill="url(#weight-fade)" /></Svg>
        <Pressable accessibilityRole="button" accessibilityLabel="Бақылау құралдарына оралу" onPress={() => router.canGoBack() ? router.back() : router.replace('/tracking-tools')} style={{ width: s(44), height: s(44), borderRadius: s(25), backgroundColor: '#fff', marginLeft: s(16), alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#919191', fontSize: s(34) }}>‹</Text></Pressable>
        <Text accessibilityRole="header" style={{ color: '#030807', fontSize: s(30), fontWeight: '700', marginTop: s(22), paddingHorizontal: s(21) }}>Салмақты бақылау</Text>
        {!setup && loaded ? <View style={{ flexDirection: 'row', marginTop: s(49), marginHorizontal: s(11), gap: s(18), alignItems: 'center' }}><TextInput accessibilityLabel="Жаңа салмақ" placeholder="Жаңа салмақ енгізіңіз (кг)" placeholderTextColor="#aaa" keyboardType="decimal-pad" maxLength={5} editable={!busy} value={current} onChangeText={setCurrent} onSubmitEditing={() => void save()} style={[inputStyle, { flex: 1, fontSize: s(13), paddingHorizontal: s(15) }]} /><Pressable accessibilityRole="button" disabled={busy || currentKg === null} onPress={() => void save()} style={{ backgroundColor: '#49baad', minHeight: s(44), borderRadius: s(27), paddingHorizontal: s(29), justifyContent: 'center', opacity: busy || currentKg === null ? 0.5 : 1 }}><Text style={{ color: '#fff', fontWeight: '600', fontSize: s(16) }}>{busy ? '…' : 'Қосу'}</Text></Pressable></View> : null}
      </View>
      {!loaded ? <View style={{ padding: 30 }}>{error ? <><Text accessibilityRole="alert" style={{ color: '#ad5555' }}>{error}</Text><Pressable accessibilityRole="button" onPress={() => { setError(''); setLoadAttempt(previous => previous + 1); }} style={{ padding: 16 }}><Text style={{ color: '#39a897' }}>Қайта жүктеу</Text></Pressable></> : <ActivityIndicator color="#49baad" />}</View> : <>
        {setup ? <>
          <View style={{ paddingHorizontal: s(24), paddingVertical: s(22), borderBottomWidth: 1, borderColor: '#e4e4e4' }}><Text style={{ fontSize: s(18), fontWeight: '600', color: '#090e0b', marginBottom: s(16) }}>Жүктілікке дейінгі салмақ</Text><TextInput accessibilityLabel="Жүктілікке дейінгі салмақ" placeholder="Жүктілікке дейінгі салмақ (кг)" placeholderTextColor="#aaa" keyboardType="decimal-pad" maxLength={5} editable={!busy} value={baseline} onChangeText={setBaseline} style={inputStyle} /></View>
          <View style={{ paddingHorizontal: s(24), paddingVertical: s(22), borderBottomWidth: 1, borderColor: '#e4e4e4' }}><Text style={{ fontSize: s(18), fontWeight: '600', color: '#090e0b', marginBottom: s(16) }}>Қазіргі салмақ</Text><TextInput accessibilityLabel="Қазіргі салмақ" placeholder="Қазіргі салмақ (кг)" placeholderTextColor="#aaa" keyboardType="decimal-pad" maxLength={5} editable={!busy} value={current} onChangeText={setCurrent} style={inputStyle} /></View>
          <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: reminder }} aria-checked={reminder} accessibilityLabel="Салмақ өлшеуді еске салу" disabled={busy} onPress={() => setReminder(previous => !previous)} style={{ paddingHorizontal: s(24), paddingVertical: s(20), borderBottomWidth: 1, borderColor: '#e4e4e4', flexDirection: 'row', alignItems: 'center', gap: s(12) }}><Text style={{ flex: 1, fontSize: s(18), fontWeight: '600', color: '#090e0b' }}>Салмақ өлшеуді еске салу</Text><View style={{ width: s(31), height: s(31), borderRadius: s(18), backgroundColor: reminder ? '#3caeff' : '#f1f1f1', alignItems: 'center', justifyContent: 'center' }}>{reminder ? <Text style={{ color: '#fff', fontSize: s(24) }}>✓</Text> : null}</View></Pressable>
          <Text style={{ color: '#91a098', fontSize: s(10), paddingHorizontal: s(24), paddingTop: s(10) }}>Еске салу осы бетте көрсетіледі. Телефон хабарламалары қосылмаған.</Text>
          <View style={{ flex: 1, minHeight: s(75) }} />
          {error ? <Text accessibilityRole="alert" style={{ color: '#ad5555', paddingHorizontal: s(22), marginBottom: 10 }}>{error}</Text> : null}
          <Pressable accessibilityRole="button" disabled={busy || baselineKg === null || (!settings && currentKg === null)} onPress={() => void save()} style={{ marginHorizontal: s(19), borderRadius: s(34), backgroundColor: '#49baad', minHeight: s(62), paddingHorizontal: s(21), flexDirection: 'row', alignItems: 'center', opacity: busy || baselineKg === null || (!settings && currentKg === null) ? 0.3 : 1 }}><Text style={{ color: '#fff', flex: 1, fontSize: s(20), fontWeight: '600' }}>{busy ? 'Сақталуда…' : 'Сақтау'}</Text><Text style={{ color: '#fff', fontSize: s(29) }}>→</Text></Pressable>
        </> : <View style={{ paddingHorizontal: s(21), paddingTop: s(28) }}>
          <Text accessibilityRole="header" style={{ fontSize: s(30), fontWeight: '700', color: '#030807', marginBottom: s(22) }}>Күнделік</Text>
          {error ? <Text accessibilityRole="alert" style={{ color: '#ad5555', marginBottom: 12 }}>{error}</Text> : null}
          {tracker?.reminder && tracker.entries[0] && new Date(tracker.entries[0].at).toDateString() !== new Date().toDateString() ? <Text style={{ backgroundColor: '#eaf8f4', padding: 12, borderRadius: 12, color: '#479a89', marginBottom: 15 }}>Бүгінгі салмағыңызды енгізуді ұмытпаңыз.</Text> : null}
          <View style={{ flexDirection: 'row', paddingBottom: s(11), borderBottomWidth: 1, borderColor: '#e4e4e4' }}>{['Күні', 'Салмақ', 'Өзгеріс', 'Апта'].map(label => <Text key={label} style={{ flex: 1, color: '#a0a4a1', fontSize: s(14) }}>{label}</Text>)}</View>
          {tracker?.entries.map(entry => { const delta = Math.round((entry.kg - tracker.baseline) * 10) / 10; return <Pressable key={entry.at} accessibilityRole="button" accessibilityLabel={`${dayText(entry.at)}: ${weightText(entry.kg)}`} onPress={() => setSelected(entry)} style={{ flexDirection: 'row', alignItems: 'center', minHeight: s(50), borderBottomWidth: 1, borderColor: '#e4e4e4' }}><Text style={{ flex: 1, fontSize: s(14), color: '#111813' }}>{dayText(entry.at)}</Text><Text style={{ flex: 1, fontSize: s(14), color: '#111813' }}>{weightText(entry.kg)}</Text><Text style={{ flex: 1, fontSize: s(14), color: '#49baff' }}>{delta > 0 ? '+' : ''}{weightText(delta)}</Text><Text style={{ flex: 0.7, fontSize: s(14), color: '#111813' }}>{entry.week ?? '—'}</Text><Text style={{ color: '#969e98', fontSize: s(28) }}>›</Text></Pressable>; })}
          <Text style={{ color: '#99a69e', fontSize: s(11), marginTop: s(18) }}>Бастапқы салмақ: {tracker ? weightText(tracker.baseline) : ''}. Өзгеріс осы салмақпен салыстырылады. Соңғы 30 өлшем аккаунтыңызға сақталады.</Text>
          <Pressable accessibilityRole="button" onPress={() => { setBaseline(String(tracker!.baseline)); setReminder(tracker!.reminder); setSettings(true); setError(''); }} style={{ paddingVertical: 16 }}><Text style={{ color: '#39a897', fontSize: s(13) }}>Бастапқы салмақ пен еске салуды өзгерту</Text></Pressable>
        </View>}
      </>}
    </ScrollView>
    {selected ? <Notice title={dayText(selected.at)} body={`Салмақ: ${weightText(selected.kg)}\nАпта: ${selected.week ?? '—'}`} onClose={() => setSelected(null)} /> : null}
  </View></View>;
}
