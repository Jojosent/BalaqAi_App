import { useLanguage } from '../i18n/Language';
import { getLocale } from '../i18n/core';
import { Pressable, Text, View } from '../i18n/Localized';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthSize } from '../components/AuthUI';
import { MoodIllustration } from '../components/MoodIllustration';
import { useSession } from '../components/Session';
import { loadMoodEntries, saveMoodEntry } from '../services/moods';
import { moodColors, moodDateText, moods, type MoodEntry, type MoodId } from '../utils/moods';

export default function MoodTrackerScreen() {
  useLanguage();
  const { s, pageWidth } = useAuthSize();
  const insets = useSafeAreaInsets();
  const { user } = useSession();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selected, setSelected] = useState<MoodId | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [diary, setDiary] = useState(false);
  useEffect(() => {
    if (!user) return;
    let live = true;
    loadMoodEntries(user.uid).then(data => { if (live) { setEntries(data); setDiary(data.length > 0); setLoaded(true); setError(''); } }).catch(() => { if (live) setError('Күнделік жүктелмеді. Байланысты тексеріп, қайталаңыз.'); });
    return () => { live = false; };
  }, [user, attempt]);
  async function save() {
    if (!user || !loaded || !selected || busy) return;
    setBusy(true); setError('');
    const entry: MoodEntry = { at: Date.now(), mood: selected };
    try {
      await saveMoodEntry(user.uid, entry);
      setEntries(previous => [entry, ...previous].slice(0, 50)); setSelected(null); setDiary(true);
    } catch { setError('Сақталмады. Байланысты тексеріп, қайта сақтаңыз.'); }
    finally { setBusy(false); }
  }
  function back() {
    if (!diary && entries.length) { setDiary(true); setError(''); return; }
    if (router.canGoBack()) router.back(); else router.replace('/tracking-tools');
  }
  return <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}><View style={{ flex: 1, width: pageWidth }}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: Math.max(insets.bottom + s(18), s(35)) }}>
      <View style={{ backgroundColor: '#48b9ad', borderBottomLeftRadius: s(28), borderBottomRightRadius: s(28), minHeight: s(220), paddingTop: Math.max(s(58), insets.top + s(16)), paddingHorizontal: s(18), overflow: 'hidden' }}>
        <View pointerEvents="none" style={{ position: 'absolute', right: s(3), bottom: s(15) }}><MoodIllustration size={s(155)} /></View>
        <Pressable accessibilityRole="button" accessibilityLabel={!diary && entries.length ? 'Күнделікке оралу' : 'Бақылау құралдарына оралу'} disabled={busy} onPress={back} style={{ width: s(44), height: s(44), borderRadius: s(25), backgroundColor: '#ffffff80', alignItems: 'center', justifyContent: 'center', marginLeft: s(-2) }}><Text style={{ color: '#8d9892', fontSize: s(34), lineHeight: s(38) }}>‹</Text></Pressable>
        <Text accessibilityRole="header" style={{ fontSize: s(30), lineHeight: s(35), fontWeight: '700', color: '#fff', marginTop: s(5), maxWidth: s(225) }}>{'Көңіл-күйді\nбақылау'}</Text>
      </View>
      {!loaded ? <View style={{ padding: 28 }}>{error ? <><Text accessibilityRole="alert" style={{ color: '#a45050' }}>{error}</Text><Pressable accessibilityRole="button" onPress={() => { setError(''); setAttempt(previous => previous + 1); }} style={{ padding: 16 }}><Text style={{ color: '#3da996' }}>Қайта жүктеу</Text></Pressable></> : <ActivityIndicator color="#48b9ad" />}</View> : diary ? <View style={{ paddingHorizontal: s(20), paddingTop: s(26) }}>
        <Text accessibilityRole="header" style={{ color: '#050907', fontSize: s(30), fontWeight: '700', marginBottom: s(21) }}>Күнделік</Text>
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e4e4e4', paddingBottom: s(10) }}><Text style={{ width: '42%', fontSize: s(14), color: '#a0a6a2' }}>Күні мен уақыты</Text><Text style={{ flex: 1, fontSize: s(14), color: '#a0a6a2' }}>Көңіл-күй</Text></View>
        {entries.map(entry => { const mood = moods.find(item => item.id === entry.mood)!; return <View key={entry.at} style={{ minHeight: s(50), flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#e4e4e4', paddingVertical: s(10) }}><Text style={{ width: '42%', fontSize: s(14), lineHeight: s(19), color: '#151c18' }}>{moodDateText(entry.at, undefined, getLocale())}</Text><Text style={{ flex: 1, fontSize: s(14), lineHeight: s(19), color: moodColors[mood.group].text }}>{mood.title}</Text></View>; })}
        <Pressable accessibilityRole="button" onPress={() => { setDiary(false); setError(''); }} style={({ pressed }) => ({ backgroundColor: '#48b9ad', borderRadius: s(30), minHeight: s(50), alignItems: 'center', justifyContent: 'center', marginTop: s(25), opacity: pressed ? 0.75 : 1 })}><Text style={{ fontSize: s(18), color: '#fff', fontWeight: '600' }}>+ Көңіл-күй қосу</Text></Pressable>
        <Text style={{ textAlign: 'center', color: '#96a69c', fontSize: s(10), marginTop: s(13) }}>Соңғы 50 жазба жеке аккаунтыңызда көрсетіледі.</Text>
      </View> : <View style={{ paddingHorizontal: s(18), paddingTop: s(27), flex: 1 }}>
        <Text style={{ color: '#0b100d', fontSize: s(18), lineHeight: s(24), fontWeight: '600', marginBottom: s(23) }}>Қазір өзіңізді қалай сезініп тұрсыз?</Text>
        <View accessibilityRole="radiogroup" accessibilityLabel="Көңіл-күйді таңдаңыз" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: s(8), rowGap: s(9) }}>
          {moods.map(mood => { const checked = selected === mood.id, colors = moodColors[mood.group]; return <Pressable key={mood.id} accessibilityRole="radio" accessibilityLabel={mood.title} accessibilityState={{ checked, disabled: busy }} aria-checked={checked} disabled={busy} onPress={() => { setSelected(mood.id); setError(''); }} style={({ pressed }) => ({ borderRadius: s(26), borderWidth: 1, borderColor: colors.border, backgroundColor: checked ? colors.selected : '#fff', minHeight: s(44), paddingHorizontal: s(16), alignItems: 'center', justifyContent: 'center', opacity: pressed || busy ? 0.7 : 1 })}><Text style={{ color: checked ? '#486048' : '#a0a0a0', fontSize: s(14), fontWeight: '500' }}>{mood.title}</Text></Pressable>; })}
        </View>
        <View style={{ flex: 1, minHeight: s(47) }} />
        {error ? <Text accessibilityRole="alert" style={{ color: '#a45050', fontSize: s(12), lineHeight: s(17), paddingBottom: 12 }}>{error}</Text> : null}
        <Pressable accessibilityRole="button" disabled={!selected || busy} onPress={() => void save()} style={({ pressed }) => ({ backgroundColor: '#48b9ad', borderRadius: s(34), minHeight: s(62), flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(25), opacity: !selected || busy ? 0.25 : pressed ? 0.75 : 1 })}><Text style={{ flex: 1, color: '#fff', fontSize: s(23), fontWeight: '600' }}>{busy ? 'Сақталуда…' : 'Сақтау'}</Text><View style={{ width: s(30), height: s(30), borderRadius: s(17), borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontSize: s(25), lineHeight: s(28) }}>→</Text></View></Pressable>
        {entries.length ? <Pressable accessibilityRole="button" disabled={busy} onPress={() => { setDiary(true); setError(''); }} style={{ alignSelf: 'center', padding: 14 }}><Text style={{ color: '#3da996', fontSize: s(13) }}>Күнделікті ашу</Text></Pressable> : null}
      </View>}
    </ScrollView>
  </View></View>;
}
