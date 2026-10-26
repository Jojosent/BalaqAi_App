import { Pressable, Text, TextInput, Image, View } from '../i18n/Localized';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Keyboard, ScrollView, StyleSheet } from 'react-native';
import { useAuthFlow } from '../components/AuthFlow';
import { AuthScreen, colors, PrimaryButton, useAuthSize } from '../components/AuthUI';
import { DatePicker, formatBirthday, PickerShell } from '../components/ProfilePickers';
import { BabySummary, CalendarIcon, EstimateNote, useToday } from '../components/PregnancyUI';
import { calculatePregnancy, draftStart, keyToInput, type PregnancyDraft } from '../utils/pregnancy';

export default function PregnancyDatingScreen() {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { s } = useAuthSize();
  const today = useToday();
  const { pregnancyDraft: draft, setPregnancyDraft, setPregnancyStart } = useAuthFlow();
  const [picker, setPicker] = useState<'date' | 'weeks' | 'days' | null>(null);
  const [error, setError] = useState('');
  const start = draftStart(draft, today);
  const result = start ? calculatePregnancy(start, today) : null;
  function update(value: Partial<PregnancyDraft>) { setPregnancyDraft({ ...draft, ...value }); setError(''); }
  function open(value: 'date' | 'weeks' | 'days') { Keyboard.dismiss(); setPicker(value); }
  function next() {
    if (!start) { setError(draft.method === 'lmp' ? 'Бүгіннен бұрынғы немесе бүгінгі күнді таңдаңыз (соңғы 300 күн).' : 'Аптаны 0–42, күнді 0–6 аралығында енгізіңіз.'); return; }
    Keyboard.dismiss(); setPregnancyStart(start);
    if (returnTo === 'account') { if (router.canGoBack()) router.back(); else router.replace('/account'); }
    else router.push('/pregnancy-result');
  }
  const method = (id: 'lmp' | 'age', title: string, description: string) => <Pressable accessibilityRole="radio" aria-checked={draft.method === id} accessibilityState={{ checked: draft.method === id }} accessibilityLabel={title} onPress={() => update({ method: id })} style={{ flexDirection: 'row', gap: s(12), alignItems: 'flex-start' }}>
    <View style={{ width: s(20), height: s(20), borderRadius: s(11), borderWidth: 1.5, borderColor: draft.method === id ? '#2aac9c' : '#b5c5c5', alignItems: 'center', justifyContent: 'center', marginTop: s(1) }}>{draft.method === id ? <View style={{ width: s(12), height: s(12), borderRadius: s(7), backgroundColor: '#2aac9c' }} /> : null}</View>
    <View style={{ flex: 1 }}><Text style={{ color: '#174e49', fontSize: s(13), lineHeight: s(18), fontWeight: '600' }}>{title}</Text><Text style={{ color: '#819593', fontSize: s(11.5), lineHeight: s(16), marginTop: s(4) }}>{description}</Text></View>
  </Pressable>;

  return <AuthScreen>
    <View style={{ alignItems: 'center', paddingTop: s(96), paddingHorizontal: s(27) }}>
      <Image source={require('../../assets/images/boy1.png')} accessibilityLabel="Ұлттық киім киген кішкентай ұл" resizeMode="contain" style={{ width: s(145), height: s(132) }} />
      <Text accessibilityRole="header" style={[styles.title, { fontSize: s(19), lineHeight: s(26), marginTop: s(7), marginHorizontal: s(-10) }]}>Жүктілік мерзімін анықтайық</Text>
      <Text style={[styles.subtitle, { fontSize: s(12), lineHeight: s(17), marginTop: s(6), marginBottom: s(14) }]}>Дұрыс есептеу үшін келесі әдістердің бірін таңдаңыз.</Text>
      <View accessibilityRole="radiogroup" accessibilityLabel="Есептеу әдісі" style={{ width: '100%', gap: s(10) }}>
        <View style={[styles.card, { padding: s(14), borderRadius: s(25) }]}>
          {method('lmp', 'Соңғы етеккірдің бірінші күнін білемін', 'Күнтізбеден күнді таңдаңыз')}
          <View style={[styles.inputRow, { gap: s(10), paddingLeft: s(14), marginTop: s(12), borderRadius: s(26), minHeight: s(40) }]}><CalendarIcon size={s(21)} /><TextInput accessibilityLabel="Соңғы етеккірдің бірінші күні" placeholder="КК.АА.ЖЖЖЖ" placeholderTextColor="#a2b5b1" value={draft.lmp} onChangeText={text => update({ method: 'lmp', lmp: formatBirthday(text) })} keyboardType="number-pad" inputMode="numeric" maxLength={10} style={[styles.input, { fontSize: s(14) }]} /><Pressable accessibilityRole="button" accessibilityLabel="Етеккір күнін таңдау" onPress={() => { update({ method: 'lmp' }); open('date'); }} style={styles.pickerButton}><Text style={{ color: '#78968e', fontSize: s(26) }}>›</Text></Pressable></View>
        </View>
        <View style={[styles.card, { padding: s(14), borderRadius: s(25) }]}>
          {method('age', 'Жүктілік мерзімімді білемін', 'Апта мен күнді енгізіңіз')}
          <View style={{ flexDirection: 'row', gap: s(10), marginTop: s(12) }}>{(['weeks', 'days'] as const).map(field => <View key={field} style={[styles.inputRow, { flex: 1, paddingLeft: s(15), borderRadius: s(26), minHeight: s(40) }]}><TextInput accessibilityLabel={field === 'weeks' ? 'Апта саны' : 'Күн саны'} placeholder={field === 'weeks' ? '8' : '3'} placeholderTextColor="#a2b5b1" value={draft[field]} onChangeText={text => update({ method: 'age', [field]: text.replace(/\D/g, '').slice(0, field === 'weeks' ? 2 : 1) })} keyboardType="number-pad" inputMode="numeric" maxLength={field === 'weeks' ? 2 : 1} style={[styles.input, { flex: 0, minWidth: s(22), fontSize: s(14) }]} /><Text style={{ color: '#174e49', fontSize: s(13), flex: 1 }}>{field === 'weeks' ? 'апта' : 'күн'}</Text><Pressable accessibilityRole="button" accessibilityLabel={field === 'weeks' ? 'Аптаны таңдау' : 'Күн санын таңдау'} onPress={() => { update({ method: 'age' }); open(field); }} style={styles.pickerButton}><Text style={{ color: '#78968e', fontSize: s(20) }}>⌄</Text></Pressable></View>)}</View>
        </View>
      </View>
      {error ? <Text accessibilityRole="alert" style={{ fontSize: s(11), color: '#ac4e45', marginTop: s(8) }}>{error}</Text> : null}
      {result ? <BabySummary result={result} scale={s(1)} /> : <Text style={[styles.subtitle, { fontSize: s(12), marginTop: s(16), marginBottom: s(8) }]}>Күнді немесе апта мен күнді енгізіңіз.</Text>}
      <View style={{ width: '100%', marginTop: s(13) }}><PrimaryButton title={returnTo === 'account' ? 'Сақтау' : 'Жалғастыру'} scale={s(1)} onPress={next} /></View>
      <EstimateNote scale={s(1)} />
    </View>
    {picker === 'date' ? <DatePicker title="Етеккірдің бірінші күні" value={draft.lmp} defaultValue={keyToInput(today)} minYear={Number(today.slice(0, 4)) - 1} isValid={value => draftStart({ ...draft, method: 'lmp', lmp: value }, today) !== null} onClose={() => setPicker(null)} onSelect={value => { update({ method: 'lmp', lmp: value }); setPicker(null); }} /> : null}
    {picker === 'weeks' || picker === 'days' ? <PickerShell title={picker === 'weeks' ? 'Апта саны' : 'Күн саны'} onClose={() => setPicker(null)}><ScrollView style={{ maxHeight: 300 }}>{Array.from({ length: picker === 'weeks' ? 43 : 7 }, (_, value) => <Pressable key={value} accessibilityRole="button" onPress={() => { update({ method: 'age', [picker]: String(value) }); setPicker(null); }} style={{ minHeight: 44, padding: 13, borderRadius: 12, backgroundColor: draft[picker] === String(value) ? '#daf2e8' : 'transparent' }}><Text style={{ color: colors.dark, fontSize: 16 }}>{value} {picker === 'weeks' ? 'апта' : 'күн'}</Text></Pressable>)}</ScrollView></PickerShell> : null}
  </AuthScreen>;
}
const styles = StyleSheet.create({
  title: { color: '#003f39', textAlign: 'center', fontWeight: '800' }, subtitle: { color: '#809594', textAlign: 'center' },
  card: { backgroundColor: 'rgba(255,255,255,0.93)', width: '100%' }, inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5eeea' },
  input: { flex: 1, minWidth: 0, paddingVertical: 8, paddingHorizontal: 0, outlineWidth: 0, color: '#174e49' }, pickerButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
