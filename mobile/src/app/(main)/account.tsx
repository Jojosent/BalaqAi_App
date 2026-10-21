import { useState } from 'react';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useAuthFlow } from '../../components/AuthFlow';
import { PrimaryButton, useAuthSize } from '../../components/AuthUI';
import { PickerShell } from '../../components/ProfilePickers';
import { ProfileIcon, type ProfileIconName } from '../../components/ProfileIcon';
import { useToday } from '../../components/PregnancyUI';
import { calculatePregnancy, kazakhDate } from '../../utils/pregnancy';
import { profileAge } from '../../utils/profile';
import { useSession } from '../../components/Session';

const menu: { title: string; subtitle: string; icon: ProfileIconName; color: string; background: string }[] = [
  { title: 'Жеке ақпарат', subtitle: 'Атыңыз, жасыңыз, байланыс деректері', icon: 'user', color: '#39b69f', background: '#b4eddf' },
  { title: 'Жүктілік деректері', subtitle: 'Болжамды күн, дәрігер, ескертулер', icon: 'calendar', color: '#f27688', background: '#ffc3cb' },
  { title: 'Жақындармен бөлісу', subtitle: 'Серіктес, отбасы мүшелері', icon: 'heart', color: '#be65c6', background: '#f0b8ef' },
  { title: 'Ескертулер', subtitle: 'Салмақ, дәрігер қабылдауы және т.б.', icon: 'bell', color: '#459ed0', background: '#b5e0ff' },
  { title: 'Жазылым', subtitle: 'Артықшылықтар мен мүмкіндіктер', icon: 'star', color: '#ee963b', background: '#ffda8c' },
  { title: 'Құпиялылық және қауіпсіздік', subtitle: 'Деректерді басқару', icon: 'shield', color: '#36b49e', background: '#b0eadc' },
  { title: 'Көмек және қолдау', subtitle: 'Жиі қойылатын сұрақтар, байланыс', icon: 'help', color: '#9470db', background: '#d5b8fc' },
];
const information: Record<string, string> = {
  'Жақындармен бөлісу': 'Жақындарыңызға қолжетімділік беру мүмкіндігі әзірленуде. Қазір деректер ешкімге жіберілмейді.',
  'Ескертулер': 'Дәрігер мен жазбаларды «Жүктілік деректері» бөлімінде енгізе аласыз. Телефонға хабарлама жіберу әлі қосылмаған.',
  'Жазылым': 'Бұл демо нұсқада ақылы жазылым қосылмаған.',
  'Құпиялылық және қауіпсіздік': 'Анкета мен жүктілік деректері Firebase Firestore базасында жеке аккаунтыңызға сақталады. Сервер Firebase токенін тексеріп, тек өз деректеріңізге қолжетімділік береді. Қоғамдастық пен дүкен әрекеттері әзірге демо режимінде.',
  'Көмек және қолдау': 'Атыңызды, туған күніңізді және қалаңызды «Жеке ақпарат» арқылы өзгертіңіз. Жүктілік мерзімін «Жүктілік деректері» арқылы түзетіңіз. «Толығырақ» апталық трекерді ашады.',
  'Хабарламалар': 'BalaqAi-ға қош келдіңіз! Анкетаңызды толтырып, жүктілік сапарыңызды бақылаңыз.',
};

export default function AccountScreen() {
  const { profile, pregnancyStart, pregnancyNotes, setPregnancyNotes, syncStatus, syncError, saveNow } = useAuthFlow();
  const { user, logout } = useSession();
  const [logoutError, setLogoutError] = useState('');
  async function exitAccount() { try { await saveNow(); await logout(); } catch { setLogoutError('Өзгерістер сақталмады. Байланысты тексеріп, қайта шығыңыз.'); } }
  const { s } = useAuthSize();
  const insets = useSafeAreaInsets();
  const today = useToday();
  const pregnancy = pregnancyStart ? calculatePregnancy(pregnancyStart, today) : null;
  const age = profileAge(profile.birthday, today);
  const [sheet, setSheet] = useState<string | null>(null);
  const [unread, setUnread] = useState(true);
  const [draft, setDraft] = useState(pregnancyNotes);
  const edit = () => router.push({ pathname: '/profile', params: { mode: 'edit' } });
  const dating = () => { setSheet(null); router.push({ pathname: '/pregnancy-dating', params: { returnTo: 'account' } }); };
  const details = () => pregnancy ? router.push('/tracker') : dating();
  const openPregnancy = () => { setDraft(pregnancyNotes); setSheet('Жүктілік деректері'); };
  const open = (title: string) => title === 'Жеке ақпарат' ? edit() : title === 'Жүктілік деректері' ? openPregnancy() : setSheet(title);
  const row = (title: string, action: () => void) => <Pressable accessibilityRole="button" onPress={action} style={styles.sheetRow}><Text style={{ fontSize: 16, color: '#293b38' }}>{title}</Text><Text style={styles.chevron}>›</Text></Pressable>;
  return <>
    <ScrollView style={{ backgroundColor: '#fcf6fb' }} contentContainerStyle={{ paddingHorizontal: s(13), paddingTop: Math.max(s(46), insets.top + s(16)), paddingBottom: s(25) }} showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: s(16), gap: s(10) }}>
        <Text accessibilityRole="header" style={{ flex: 1, fontSize: s(25), fontWeight: '700', color: '#151716' }}>Профиль</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Баптаулар" onPress={() => setSheet('Баптаулар')} style={[styles.round, { width: s(34), height: s(34) }]}><ProfileIcon name="gear" color="#252a28" size={s(22)} /></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={unread ? 'Хабарламалар: жаңа хабарлама' : 'Хабарламалар'} onPress={() => { setUnread(false); setSheet('Хабарламалар'); }} style={[styles.round, { width: s(34), height: s(34) }]}><ProfileIcon name="bell" color="#252a28" size={s(22)} />{unread ? <View style={styles.dot} /> : null}</Pressable>
      </View>
      <View style={{ backgroundColor: '#fde1ed', borderRadius: s(19), padding: s(12), minHeight: s(114), flexDirection: 'row', alignItems: 'center', overflow: 'hidden', gap: s(12) }}>
        <Svg pointerEvents="none" width={s(72)} height={s(117)} viewBox="0 0 80 125" style={{ position: 'absolute', right: s(4), bottom: 0 }}><Path d="M30 27c-17-6-8-26 10-24 20 1 26 19 25 32 12 13 4 20-4 24 27 28 12 48-13 53l9 13M29 14c4 13 19 12 27 13M27 24c-5 16 0 21 10 23l-3 12-17 13c-9 10-7 20 1 28l25 6M20 86l23 8 18-9M28 112l19-8M29 91c-14-19 0-18 0-12 4-9 13-5 0 12Z" fill="none" stroke="#f6a5c3" opacity={0.5} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></Svg>
        <Pressable accessibilityRole="button" accessibilityLabel="Жеке ақпаратты өзгерту" onPress={edit} style={{ width: s(85), height: s(85) }}><View style={{ width: s(83), height: s(83), borderRadius: s(45), overflow: 'hidden', backgroundColor: '#e9b9cf' }}><Image source={require('../../../assets/images/mom2.png')} style={{ width: s(86), height: s(107), position: 'absolute', top: s(4), left: 0 }} resizeMode="contain" /></View><View style={[styles.round, { position: 'absolute', right: 0, bottom: 0, width: s(25), height: s(25) }]}><ProfileIcon name="edit" color="#64616a" size={s(15)} /></View></Pressable>
        <View style={{ flex: 1, paddingRight: s(25) }}><Text numberOfLines={2} style={{ fontSize: s(17), fontWeight: '700', color: '#222022' }}>{profile.name || 'Атыңызды енгізіңіз'}</Text><Text style={{ color: '#73717e', fontSize: s(12), marginTop: s(5) }}>{age === null ? 'Жасы енгізілмеген' : `${age} жаста`}</Text><Pressable accessibilityRole="button" accessibilityLabel="Жүктілік мерзімін өзгерту" onPress={dating} style={{ flexDirection: 'row', gap: s(5), alignItems: 'center', marginTop: s(11) }}><ProfileIcon name="calendar" color="#777881" size={s(14)} /><Text style={{ color: '#73717e', fontSize: s(11), flexShrink: 1 }}>{pregnancy ? `Жүктіліктің ${pregnancy.weeks}-аптасы` : 'Мерзімді енгізіңіз'}  ›</Text></Pressable></View>
      </View>
      <View style={[styles.card, { padding: s(14), borderRadius: s(17), marginTop: s(9) }]}>
        <View style={styles.between}><Text style={{ fontSize: s(14), fontWeight: '700', color: '#222' }}>Жүктілік сапарыңыз</Text><Pressable accessibilityRole="button" accessibilityLabel="Жүктілік туралы толығырақ" onPress={details}><Text style={{ color: '#ff7b83', fontSize: s(11) }}>Толығырақ ›</Text></Pressable></View>
        <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round((pregnancy?.progress || 0) * 100) }} style={{ height: s(14), backgroundColor: '#f6f5f9', borderRadius: s(10), overflow: 'hidden', marginVertical: s(12) }}><View style={{ width: `${(pregnancy?.progress || 0) * 100}%`, height: '100%', backgroundColor: '#40d0b5', borderRadius: s(10) }} /></View>
        <View style={styles.between}>{[{ value: pregnancy ? `${(pregnancy.progress * 100).toFixed(1)}%` : '—', label: 'өтті' }, { value: pregnancy ? String(pregnancy.weeks) : '—', label: `апта${pregnancy ? `\n+${pregnancy.days} күн` : ''}` }, { value: pregnancy ? String(Math.max(0, 280 - pregnancy.totalDays)) : '—', label: 'күн қалды' }].map((stat, i) => <View key={i} style={{ alignItems: i === 0 ? 'flex-start' : i === 1 ? 'center' : 'flex-end' }}><Text style={{ fontSize: s(15), fontWeight: '700', color: '#252526' }}>{stat.value}</Text><Text style={{ fontSize: s(11), color: '#92919d', textAlign: i === 1 ? 'center' : 'left', marginTop: s(2) }}>{stat.label}</Text></View>)}</View>
      </View>
      <View style={{ gap: s(8), marginTop: s(13) }}>{menu.map(item => <Pressable key={item.title} accessibilityRole="button" onPress={() => open(item.title)} style={[styles.card, { minHeight: s(57), borderRadius: s(15), paddingHorizontal: s(11), paddingVertical: s(10), flexDirection: 'row', alignItems: 'center', gap: s(14) }]}><View style={{ width: s(40), height: s(40), borderRadius: s(17), backgroundColor: item.background, alignItems: 'center', justifyContent: 'center' }}><ProfileIcon name={item.icon} color={item.color} size={s(23)} /></View><View style={{ flex: 1 }}><Text style={{ fontSize: s(13), fontWeight: '600', color: '#272727' }}>{item.title}</Text><Text style={{ fontSize: s(10.5), color: '#93939f', marginTop: s(3), lineHeight: s(14) }}>{item.subtitle}</Text></View><Text style={[styles.chevron, { fontSize: s(23) }]}>›</Text></Pressable>)}</View>
      <Text style={{ color: syncStatus === 'error' ? '#ae534a' : '#8c9e97', fontSize: 11, textAlign: 'center', marginTop: 16 }}>{syncStatus === 'error' ? syncError : syncStatus === 'saving' ? 'Сақталуда…' : 'Firebase-де сақталған'}{'\n'}{user?.email}</Text>
      {syncStatus === 'error' ? <Pressable accessibilityRole="button" onPress={() => void saveNow().catch(() => {})} style={{ padding: 14 }}><Text style={{ color: '#389f8f', textAlign: 'center' }}>Қайта сақтау</Text></Pressable> : null}
      {logoutError ? <Text accessibilityRole="alert" style={{ color: '#ae534a', textAlign: 'center', marginTop: 12 }}>{logoutError}</Text> : null}
      <Pressable accessibilityRole="button" onPress={() => void exitAccount()} style={{ padding: 18 }}><Text style={{ textAlign: 'center', color: '#d47177' }}>Аккаунттан шығу</Text></Pressable>
    </ScrollView>
    {sheet ? <PickerShell title={sheet} onClose={() => setSheet(null)}><ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 440 }}>
      {sheet === 'Жүктілік деректері' ? <View style={{ gap: 14 }}><Text style={styles.body}>Болжамды босану күні: {pregnancy ? kazakhDate(pregnancy.due) : 'Әлі енгізілмеген'}</Text>{row('Мерзімді өзгерту', dating)}<TextInput accessibilityLabel="Дәрігер" placeholder="Дәрігердің аты-жөні" value={draft.doctor} onChangeText={doctor => setDraft({ ...draft, doctor })} maxLength={100} style={styles.input} /><TextInput accessibilityLabel="Жүктілік туралы жазбалар" placeholder="Жазбалар" value={draft.notes} onChangeText={notes => setDraft({ ...draft, notes })} multiline maxLength={1000} style={[styles.input, { minHeight: 90, textAlignVertical: 'top' }]} /><Text style={styles.hint}>Жазбалар жеке аккаунтыңызға сақталады.</Text><PrimaryButton title="Сақтау" onPress={() => { setPregnancyNotes({ doctor: draft.doctor.trim(), notes: draft.notes.trim() }); setSheet(null); }} /></View> : sheet === 'Баптаулар' ? <View>{row('Жеке ақпарат', () => { setSheet(null); edit(); })}{row('Жүктілік деректері', openPregnancy)}{row('Құпиялылық және қауіпсіздік', () => setSheet('Құпиялылық және қауіпсіздік'))}</View> : <Text style={styles.body}>{information[sheet]}</Text>}
    </ScrollView></PickerShell> : null}
  </>;
}
const styles = StyleSheet.create({
  card: { backgroundColor: '#fff' }, round: { backgroundColor: '#fff', borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 2, right: 3, backgroundColor: '#ff727b', borderRadius: 5, width: 7, height: 7, borderWidth: 1, borderColor: '#fff' },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, chevron: { color: '#9697a2', fontSize: 24 },
  body: { fontSize: 15, lineHeight: 24, color: '#657a75', paddingBottom: 16 }, sheetRow: { paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderBottomColor: '#eff1f0', borderBottomWidth: 1 },
  input: { backgroundColor: '#f2f7f5', borderRadius: 15, padding: 14, fontSize: 15, color: '#294b43' }, hint: { fontSize: 11, color: '#8c9e97' },
});

