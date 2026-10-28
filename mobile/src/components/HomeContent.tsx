import { InfoBadge } from './InfoBadge';
import { useSvgId } from './useSvgId';
import { useLanguage } from '../i18n/Language';
import { Pressable, Text, TextInput, Image, View } from '../i18n/Localized';
import { useState } from 'react';
import { router } from 'expo-router';
import { Linking, Modal, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useAuthFlow } from './AuthFlow';
import { PrimaryButton, useAuthSize } from './AuthUI';
import { MainIcon } from './MainIcon';
import { useToday } from './PregnancyUI';
import { calculatePregnancy } from '../utils/pregnancy';

const sections = [
  { id: 'geneticist', title: 'Генетик кеңесі', button: 'Бақылауды бастау', colors: ['#cdeee7', '#46bbae'], image: require('../../assets/images/genetic-counseling.png'), rows: [{ id: 'geneticist', title: 'Консультация генетика' }] },
  { id: 'folate', title: 'Фолиевая кислота', button: 'Бақылауды бастау', colors: ['#cdeee7', '#46bbae'], image: require('../../assets/images/ultrasound.png'), rows: [{ id: 'folate', title: 'Фолиевая кислота 400 мкг ежедневно' }] },
  { id: 'specialists', title: 'Узкие специалисты', button: 'Қарау', colors: ['#378eff', '#63e8f2'], image: require('../../assets/images/medic.png'), rows: [{ id: 'specialists', title: 'Консультация узких специалистов' }] },
  { id: 'screening', title: 'Тест на\nносительство', button: 'Генетические заболевания', colors: ['#a97aed', '#8064f1'], image: require('../../assets/images/genetics.png'), rows: [{ id: 'sma', title: 'Спинальная мышечная атрофия' }, { id: 'duchenne', title: 'Мышечная дистрофия Дюшенна' }, { id: 'hearing', title: 'Тугоухость' }, { id: 'pku', title: 'Фенилкетонурия' }, { id: 'cf', title: 'Муковисцидоз' }] },
];
const details: Record<string, { title: string; body: string; source?: string }> = {
  folate: { title: 'Фолиевая кислота', body: 'В общих рекомендациях ВОЗ по ведению беременности указана фолиевая кислота 400 мкг в день. Подходящую вам дозировку и препарат уточните у врача. Здесь можно вести отметку за сегодня; уведомления пока не отправляются.', source: 'https://www.who.int/tools/elena/interventions/daily-iron-pregnancy' },
  specialists: { title: 'Узкие специалисты', body: 'Обсудите с врачом, какие консультации нужны именно вам. Отметка ниже — ваша личная запись о прохождении консультации. Запись на приём пока не подключена.' },
  screening: { title: 'Тест на носительство', body: 'Скрининг на носительство помогает оценить риск отдельных наследственных заболеваний. Состав исследований выбирают с врачом с учётом семейной истории и обстоятельств. Пункты на главной — список для обсуждения, а не назначение всех анализов.', source: 'https://www.acog.org/womens-health/faqs/carrier-screening' },
  geneticist: { title: 'Консультация генетика', body: 'Генетик поможет обсудить семейную историю и результаты исследований. Можно отметить консультацию в личном списке. Автоматического назначения анализов и записи на приём здесь нет.' },
};

export function PregnancyHeader({ onSearch, scale: s, planning = false }: { onSearch: () => void; scale: (n: number) => number; planning?: boolean }) {
  const heroId = useSvgId('home-hero');
  const { pregnancyStart } = useAuthFlow();
  const today = useToday();
  const result = pregnancyStart ? calculatePregnancy(pregnancyStart, today) : null;
  const { pageWidth } = useAuthSize();
  const insets = useSafeAreaInsets();
  const top = Math.max(insets.top + s(18), s(42));
  const height = s(planning ? 115 : 324) + Math.max(0, top - s(42));
  const radius = 79, circumference = 2 * Math.PI * radius;
  return <View style={{ height, width: '100%', paddingTop: top }}>
    <Svg pointerEvents="none" width={pageWidth} height={height} style={StyleSheet.absoluteFill} viewBox={`0 0 ${pageWidth} ${height}`}><Defs><LinearGradient id={heroId} x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#4ebeb1" /><Stop offset="1" stopColor="#007366" /></LinearGradient></Defs><Path d={`M0 0H${pageWidth}V${height - s(18)}Q${pageWidth / 2} ${height + s(18)} 0 ${height - s(22)}Z`} fill="#087f70" /><Path d={`M0 0H${pageWidth}V${height - s(18)}Q${pageWidth / 2} ${height + s(18)} 0 ${height - s(22)}Z`} fill={`url(#${heroId})`} /></Svg>
    <Text accessibilityRole="header" style={{ textAlign: 'center', color: '#fff', fontSize: s(20), fontWeight: '600', letterSpacing: 1 }}>Басты бет</Text>
    <Pressable accessibilityRole="button" accessibilityLabel="Іздеуді ашу" onPress={onSearch} style={{ position: 'absolute', right: s(8), top: top - s(6), width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><MainIcon name="search" color="#fff" size={s(22)} /></Pressable>
    {!planning ? <><View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: s(22), paddingHorizontal: s(12) }}>
      <View style={{ flex: 1, alignItems: 'center' }}><Text style={ [styles.headerStat, { fontSize: s(20) }] }>{result ? `${(result.progress * 100).toFixed(1)}%` : '—'}</Text><Text style={[styles.headerCaption, { fontSize: s(8) }]}>өтті</Text></View>
      <View accessibilityLabel={result ? `${result.weeks} апта ${result.days} күн` : 'Мерзім енгізілмеген'} style={{ width: s(166), height: s(166), alignItems: 'center', justifyContent: 'center' }}>
        <Svg pointerEvents="none" width={s(166)} height={s(166)} viewBox="0 0 166 166" style={StyleSheet.absoluteFill}><Circle cx="83" cy="83" r={radius} fill="none" stroke="#66c7b9" strokeOpacity={0.55} strokeWidth={2.5} /><Circle cx="83" cy="83" r={radius} fill="none" stroke="#fff" strokeWidth={2.5} strokeDasharray={`${circumference}`} strokeDashoffset={circumference * (1 - (result?.progress || 0))} transform="rotate(-90 83 83)" /></Svg>
        <Text style={{ color: '#e7fcf7', fontSize: s(10), fontWeight: '600', letterSpacing: 1 }}>АПТА</Text><Text style={{ color: '#fff', fontSize: s(44), lineHeight: s(55), fontWeight: '700' }}>{result?.weeks ?? '—'}</Text><Text style={{ color: '#e7fcf7', fontSize: s(14), fontWeight: '600' }}>{result ? `+${result.days} күн` : 'мерзімді енгізіңіз'}</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}><Text style={[styles.headerStat, { fontSize: s(20) }]}>{result ? Math.max(0, 280 - result.totalDays) : '—'}</Text><Text style={[styles.headerCaption, { fontSize: s(8) }]}>күн қалды</Text></View>
    </View>
    <Pressable accessibilityRole="button" onPress={() => router.push(result ? '/tracker' : '/pregnancy-dating')} style={({ pressed }) => ({ alignSelf: 'center', paddingHorizontal: s(18), paddingVertical: s(7), borderRadius: s(22), backgroundColor: '#ffffff30', marginTop: s(9), opacity: pressed ? 0.7 : 1 })}><Text style={{ color: '#e1f8f1', fontSize: s(13), fontWeight: '600' }}>{result ? 'Толығырақ' : 'Мерзімді енгізу'} →</Text></Pressable></> : null}
  </View>;
}

function Banner({ section, s, tracking, onPress }: { section: typeof sections[number]; s: (value: number) => number; tracking: boolean; onPress: () => void }) {
  const { pageWidth } = useAuthSize();
  const bannerId = useSvgId('planning-card');
  const width = pageWidth - s(48), height = s(126);
  return <View style={[styles.banner, { height, borderRadius: s(11), backgroundColor: section.colors[1] }]}>
    <Svg pointerEvents="none" width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={StyleSheet.absoluteFill}><Defs><LinearGradient id={bannerId} x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor={section.colors[0]} /><Stop offset="1" stopColor={section.colors[1]} /></LinearGradient></Defs><Path d={`M0 0H${width}V${height}H0Z`} fill={`url(#${bannerId})`} />{[0, 1, 2, 3, 4].map(i => <Circle key={i} cx={s([12, 94, 215, 33, 174][i])} cy={s([54, 19, 43, 113, 107][i])} r={s([9, 11, 8, 13, 10][i])} fill="none" stroke="white" strokeOpacity={0.2} strokeWidth={s(2)} />)}</Svg>
    <Image source={section.image} tintColor={section.id === 'geneticist' ? '#ffffff' : undefined} accessible={false} resizeMode="contain" style={{ position: 'absolute', right: section.id === 'specialists' ? s(-26) : s(-4), bottom: section.id === 'screening' ? s(-4) : 0, width: s(section.id === 'specialists' ? 178 : 130), height: s(section.id === 'screening' ? 99 : section.id === 'specialists' ? 146 : 132) }} />
    <View style={{ position: 'absolute', left: s(22), bottom: s(11), right: s(10), alignItems: 'flex-start' }}><Text style={{ color: '#071f1d', fontSize: s(20), lineHeight: s(26), fontWeight: '500', maxWidth: s(section.id === 'geneticist' ? 170 : 245), marginBottom: s(13) }}>{section.title}</Text><Pressable accessibilityRole="button" accessibilityLabel={section.title.replace('\n', ' ')} onPress={onPress} style={({ pressed }) => ({ backgroundColor: '#fff', borderRadius: s(23), minHeight: 32, paddingHorizontal: s(section.id === 'screening' ? 18 : 23), justifyContent: 'center', opacity: pressed ? 0.75 : 1 })}><Text style={{ color: section.id === 'screening' ? '#9975e8' : section.id === 'specialists' ? '#44c9f4' : '#40aa9e', fontSize: s(14), fontWeight: '600' }}>{section.id === 'folate' && tracking ? 'Бақылау жүріп жатыр' : section.button}</Text></Pressable></View>
  </View>;
}

export default function HomeContent() {
  const { t } = useLanguage();
  const { s } = useAuthSize();
  const today = useToday();
  const { stage, checklist, toggleChecklist, trackingFolate, setTrackingFolate } = useAuthFlow();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [detail, setDetail] = useState<string | null>(null);
  const q = query.trim().toLocaleLowerCase();
  const filtered = sections.filter(section => `${t(section.title)} ${t(section.button)} ${section.rows.map(row => t(row.title)).join(' ')}`.toLocaleLowerCase().includes(q));
  const info = detail ? details[detail] : null;

  return <View style={{ flex: 1, backgroundColor: '#fff' }}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(28) }}>
    <PregnancyHeader planning={stage === 'planning'} scale={s} onSearch={() => { setSearchOpen(value => !value); setQuery(''); }} />
    <View style={{ paddingHorizontal: s(24), paddingTop: s(47) }}>
      {searchOpen ? <View style={{ marginBottom: s(20) }}><TextInput accessibilityLabel="Іздеу" placeholder="Іздеу / Поиск" placeholderTextColor="#89a49b" value={query} onChangeText={setQuery} style={{ backgroundColor: '#eff7f3', borderRadius: 18, padding: 14, color: '#174e49', fontSize: 15, outlineWidth: 0 }} /><Text style={{ color: '#8a9d95', fontSize: 11, marginTop: 7 }}>Карточкалар мен тізімнен іздеу</Text></View> : null}
      {filtered.map(section => <View key={section.id} style={{ marginBottom: s(21) }}>
        <Banner section={section} s={s} tracking={trackingFolate} onPress={() => setDetail(section.id)} />
        <View style={{ gap: s(7), marginTop: s(section.id === 'screening' ? 15 : 21) }}>{section.rows.filter(row => !q || `${section.title} ${section.button}`.toLocaleLowerCase().includes(q) || row.title.toLocaleLowerCase().includes(q)).map(row => {
          const key = row.id === 'folate' ? `folate:${today}` : row.id;
          const checked = checklist.includes(key);
          return <View key={row.id} style={[styles.checklistRow, { borderRadius: s(11), paddingLeft: s(7), paddingRight: s(5), minHeight: s(44) }]}>
            <Pressable accessibilityRole="checkbox" accessibilityLabel={row.title} accessibilityState={{ checked }} aria-checked={checked} onPress={() => { if (row.id === 'folate') setTrackingFolate(true); toggleChecklist(key); }} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: s(16), minHeight: 44, paddingVertical: s(7) }}><View style={{ width: s(28), height: s(28), borderRadius: s(15), backgroundColor: checked ? '#51bca9' : '#fff', borderColor: checked ? '#51bca9' : '#ff9d98', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>{checked ? <Text style={{ color: '#fff', fontSize: s(18) }}>✓</Text> : null}</View><Text style={{ color: '#333', flex: 1, fontSize: s(11.5), lineHeight: s(16), textDecorationLine: checked ? 'line-through' : 'none' }}>{row.title}</Text></Pressable>
            <InfoBadge topic={row.id} from="home" />
          </View>;
        })}</View>
      </View>)}
      {!filtered.length ? <Text style={{ textAlign: 'center', color: '#7a9389', paddingVertical: 30 }}>Ештеңе табылмады</Text> : null}
      <Text style={{ textAlign: 'center', color: '#8d9e96', fontSize: s(10), lineHeight: s(15), paddingHorizontal: s(10) }}>Тізім — дәрігермен талқылауға арналған жеке белгі. Тағайындауларды дәрігермен нақтылаңыз. Белгілер жеке аккаунтыңызға сақталады.</Text>
    </View>
  </ScrollView>
  {info ? <Modal transparent animationType="fade" onRequestClose={() => setDetail(null)}><View style={styles.scrim}><Pressable style={StyleSheet.absoluteFill} accessibilityLabel="Жабу" onPress={() => setDetail(null)} /><View accessibilityViewIsModal style={styles.dialog}><Text accessibilityRole="header" style={styles.detailTitle}>{info.title}</Text><Text style={styles.detailBody}>{info.body}</Text>{info.source ? <Pressable accessibilityRole="link" onPress={() => { void Linking.openURL(info.source!); }} style={{ paddingVertical: 12 }}><Text style={{ color: '#26a793', fontSize: 13 }}>Дереккөз: {detail === 'folate' ? 'WHO' : 'ACOG'} ↗</Text></Pressable> : null}<PrimaryButton title={detail === 'folate' && !trackingFolate ? 'Бақылауды бастау' : 'Түсінікті'} onPress={() => { if (detail === 'folate') setTrackingFolate(true); setDetail(null); }} /></View></View></Modal> : null}
  </View>;
}

const styles = StyleSheet.create({
  headerStat: { color: '#fff', fontWeight: '600' }, headerCaption: { color: '#e6fff5', fontWeight: '600', letterSpacing: 1, marginTop: 5 },
  banner: { width: '100%', overflow: 'hidden', backgroundColor: '#b5e5dd', boxShadow: '0px 3px 4px rgba(0,0,0,0.18)' }, checklistRow: { backgroundColor: '#fceeee', flexDirection: 'row', alignItems: 'center' },
  scrim: { flex: 1, backgroundColor: 'rgba(14,60,55,0.35)', padding: 25, alignItems: 'center', justifyContent: 'center' }, dialog: { width: '100%', maxWidth: 375, backgroundColor: '#fcfffd', borderRadius: 27, padding: 25 },
  detailTitle: { fontSize: 23, color: '#174e49', fontWeight: '700' }, detailBody: { color: '#708c81', fontSize: 15, lineHeight: 23, marginTop: 15, marginBottom: 16 },
});

