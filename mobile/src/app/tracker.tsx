import { useLanguage } from '../i18n/Language';
import { getLocale } from '../i18n/core';
import { Pressable, Text, Image, View } from '../i18n/Localized';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { router } from 'expo-router';
import { Linking, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';
import { useAuthFlow } from '../components/AuthFlow';
import { Arrow, PrimaryButton, useAuthSize } from '../components/AuthUI';
import { PickerShell } from '../components/ProfilePickers';
import { useToday } from '../components/PregnancyUI';
import { calculatePregnancy, kazakhDate } from '../utils/pregnancy';
import { pregnancyTrimester, trackerArticle, trackerIllustration, trackerMeasurements, TRACKER_SOURCES } from '../utils/tracker';

export default function TrackerScreen() {
  useLanguage();
  const { pageWidth, s } = useAuthSize();
  const insets = useSafeAreaInsets();
  const { pregnancyStart } = useAuthFlow();
  const today = useToday();
  const result = pregnancyStart ? calculatePregnancy(pregnancyStart, today) : null;
  const currentWeek = Math.min(42, result?.weeks ?? 8);
  const [previewWeek, setPreviewWeek] = useState<number | null>(null);
  const selectedWeek = previewWeek ?? currentWeek;
  const [expanded, setExpanded] = useState<'baby' | 'mother' | 'tips' | null>(null);
  const [sources, setSources] = useState(false);
  const weeksRef = useRef<ComponentRef<typeof ScrollView> | null>(null);
  const itemWidth = s(56), step = s(68);
  const measures = trackerMeasurements(selectedWeek);
  const illustration = trackerIllustration(selectedWeek);
  const article = trackerArticle(selectedWeek);
  const remaining = Math.max(0, 280 - (result?.totalDays ?? 0));
  const top = Math.max(s(48), insets.top + s(14));
  const cards = [{ id: 'baby' as const, title: 'Бала', body: article.baby }, { id: 'mother' as const, title: 'Ана', body: article.mother }, { id: 'tips' as const, title: 'Пайдалы кеңестер', body: article.tips }];

  useEffect(() => { weeksRef.current?.scrollTo({ x: selectedWeek * step, animated: false }); }, [selectedWeek, step]);

  return <View style={{ flex: 1, backgroundColor: '#d9f1ec', alignItems: 'center' }}><View style={{ width: pageWidth, flex: 1, overflow: 'hidden' }}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + s(20), s(30)) }}>
    <View style={{ height: top + s(413), paddingTop: top }}>
      <Svg width={pageWidth} height={top + s(440)} style={StyleSheet.absoluteFill}><Defs><LinearGradient id="trackerHero" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#4bb9ac" /><Stop offset="0.72" stopColor="#bfe7e1" /><Stop offset="1" stopColor="#bfe7e1" /></LinearGradient></Defs><Path d={`M0 0H${pageWidth}V${top + s(440)}H0Z`} fill="url(#trackerHero)" /></Svg>
      <Pressable accessibilityRole="button" accessibilityLabel="Басты бетке оралу" onPress={() => router.canGoBack() ? router.back() : router.replace('/home')} style={{ alignSelf: 'flex-start', minHeight: 44, paddingHorizontal: s(10), flexDirection: 'row', alignItems: 'center', gap: s(8) }}><Arrow back size={s(23)} /><Text style={{ color: '#fff', fontSize: s(20), fontWeight: '500' }}>Басты бет</Text></Pressable>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: s(18), paddingHorizontal: s(13) }}>
        {[{ value: measures.weight === null ? '—' : `≈${measures.weight} г`, label: 'Салмағы' }, { value: measures.length === null ? '—' : `≈${measures.length} см`, label: 'Ұзындығы' }].map(tile => <View key={tile.label} style={{ borderRadius: s(14), padding: s(10), minWidth: s(87), minHeight: s(82), backgroundColor: '#ffffff1f', justifyContent: 'space-between' }}><Text style={{ color: '#fff', fontSize: s(22), fontWeight: '600' }}>{tile.value}</Text><Text style={{ color: '#f2fffa', fontSize: s(13), fontWeight: '600', marginTop: s(11) }}>{tile.label}</Text></View>)}
      </View>
      <View style={{ position: 'absolute', alignSelf: 'center', top: top + s(112), width: s(230), height: s(205), alignItems: 'center', justifyContent: 'center' }}>
        <Image key={illustration} source={illustration === 'baby' ? require('../../assets/images/baby2.png') : require('../../assets/images/moon.png')} resizeMode="contain" accessibilityLabel={illustration === 'baby' ? '20 аптадан бастап сәбидің иллюстрациясы' : '20 аптаға дейінгі ай иллюстрациясы'} style={{ width: s(illustration === 'baby' ? 223 : 172), height: s(illustration === 'baby' ? 185 : 172) }} />
        <Svg width={s(150)} height={s(18)} style={{ marginTop: s(7) }}><Ellipse cx={s(75)} cy={s(9)} rx={s(53)} ry={s(4)} fill="#59a99d" fillOpacity={0.45} /></Svg>
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: s(35) }}>
        <ScrollView ref={weeksRef} horizontal onContentSizeChange={() => weeksRef.current?.scrollTo({ x: selectedWeek * step, animated: false })} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: (pageWidth - itemWidth) / 2, gap: s(12), alignItems: 'center' }}>
          {Array.from({ length: 43 }, (_, week) => <Pressable key={week} accessibilityRole="button" accessibilityLabel={`${week} апта`} accessibilityState={{ selected: selectedWeek === week }} aria-selected={selectedWeek === week} onPress={() => setPreviewWeek(week === currentWeek ? null : week)} style={{ width: itemWidth, height: itemWidth, borderRadius: s(30), borderWidth: 2, borderColor: '#43b8a7', backgroundColor: selectedWeek === week ? '#66c5b8' : 'transparent', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: s(28), fontWeight: '500', color: selectedWeek === week ? '#fff' : '#2b9f8e' }}>{week}</Text></Pressable>)}
        </ScrollView>
      </View>
      <Pressable accessibilityRole="button" onPress={() => setPreviewWeek(null)} style={{ position: 'absolute', bottom: 0, alignSelf: 'center', minHeight: 35, justifyContent: 'center' }}><Text style={{ color: '#269e8c', fontSize: s(12), fontWeight: '600', letterSpacing: 1 }}>{previewWeek === null ? (result ? 'Қазіргі апта' : 'Апталарды қарау') : `${selectedWeek}-апта · Қазіргі аптаға оралу`}</Text></Pressable>
    </View>

    <View style={{ backgroundColor: '#fff', borderTopLeftRadius: s(28), borderTopRightRadius: s(28), marginTop: s(17), padding: s(21) }}>
      {result ? <>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: s(15) }}><Text style={{ color: '#4ab9a8', fontSize: s(21), fontWeight: '700' }}>{result.weeks} апта {result.days} күн</Text><Text style={{ color: '#4ab9a8', fontSize: s(15), fontWeight: '600' }}>{pregnancyTrimester(result.totalDays)}-триместр</Text></View>
        <View accessibilityRole="progressbar" aria-valuemin={0} aria-valuemax={280} aria-valuenow={Math.min(280, result.totalDays)} style={{ height: s(7), backgroundColor: '#eaf7f3', borderRadius: s(6), marginVertical: s(18), overflow: 'hidden' }}><View style={{ width: `${result.progress * 100}%`, height: '100%', backgroundColor: '#4ab9a8', borderRadius: s(6) }} /></View>
        <View style={{ flexDirection: 'row', gap: s(10), justifyContent: 'space-between' }}><Text style={{ color: '#4ab9a8', flex: 1, fontSize: s(12), lineHeight: s(16), fontWeight: '600' }}>Болжамды босану күні:{'\n'}{kazakhDate(result.due, getLocale())}</Text><Text style={{ color: '#4ab9a8', fontSize: s(12), lineHeight: s(17) }}>{Math.floor(remaining / 7)} апта {remaining % 7} күн қалды</Text></View>
      </> : <><Text style={{ color: '#4ab9a8', fontSize: s(17), marginBottom: s(15), textAlign: 'center' }}>Жүктілік мерзімі әлі енгізілмеген</Text><PrimaryButton title="Мерзімді енгізу" onPress={() => router.push('/pregnancy-dating')} /></>}
    </View>
    {cards.map((card, index) => <View key={card.id} style={{ backgroundColor: index === 1 ? '#fff' : '#289e8e', borderRadius: s(28), paddingHorizontal: s(21), paddingTop: s(20), paddingBottom: s(25), marginTop: s(-5) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: s(10) }}><Text accessibilityRole="header" style={{ color: index === 1 ? '#4ab9a8' : '#fff', fontSize: s(21), fontWeight: '700' }}>{card.title}</Text><Pressable accessibilityRole="button" accessibilityLabel={`${card.title}: толығырақ`} onPress={() => setExpanded(card.id)} style={{ width: 44, height: 44, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: index === 1 ? '#4ab9a8' : '#fff' }}><Svg width={s(21)} height={s(21)} viewBox="0 0 24 24" fill="none"><Path d="m9 4 8 8-8 8" stroke={index === 1 ? '#fff' : '#4ab9a8'} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" /></Svg></Pressable></View>
      <Text style={{ color: index === 1 ? '#4ab9a8' : '#fff', fontSize: s(13), lineHeight: s(18) }}>{card.body}</Text>
    </View>)}
    <Text style={{ paddingHorizontal: s(22), marginTop: s(15), textAlign: 'center', color: '#608b81', fontSize: s(10), lineHeight: s(15) }}>Өлшемдер — {selectedWeek}-аптаға арналған анықтамалық шамалар, жеке УДЗ нәтижесі емес. Есеп пен дамуды дәрігер нақтылайды. Иллюстрация көркем түрде берілген.</Text>
    <Pressable accessibilityRole="button" onPress={() => setSources(true)} style={{ alignSelf: 'center', padding: 14 }}><Text style={{ color: '#278d7c', fontSize: s(11) }}>Дереккөздер</Text></Pressable>
  </ScrollView></View>

  {expanded ? <PickerShell title={`${cards.find(card => card.id === expanded)?.title} · ${selectedWeek}-апта`} onClose={() => setExpanded(null)}><Text style={styles.modalBody}>{article[expanded]}</Text><Text style={styles.modalNote}>Бұл жалпы кезеңдік ақпарат. Жеке өзгерістер әртүрлі болады.</Text><Pressable accessibilityRole="link" onPress={() => { void Linking.openURL(expanded === 'mother' && selectedWeek < 14 ? TRACKER_SOURCES.early : TRACKER_SOURCES.development); }} style={{ paddingVertical: 15 }}><Text style={{ color: '#289e8e' }}>Медициналық дереккөз ↗</Text></Pressable><PrimaryButton title="Түсінікті" onPress={() => setExpanded(null)} /></PickerShell> : null}
  {sources ? <PickerShell title="Дереккөздер" onClose={() => setSources(false)}>{[{ name: 'Vinmec · анықтамалық өлшемдер', url: TRACKER_SOURCES.growth }, { name: 'ACOG · даму және триместрлер', url: TRACKER_SOURCES.development }, { name: 'NHS · ерте кезеңдегі өзгерістер', url: TRACKER_SOURCES.early }].map(source => <Pressable key={source.name} accessibilityRole="link" onPress={() => { void Linking.openURL(source.url); }} style={{ paddingVertical: 16 }}><Text style={{ color: '#289e8e', fontSize: 15 }}>{source.name} ↗</Text></Pressable>)}</PickerShell> : null}
  </View>;
}

const styles = StyleSheet.create({ modalBody: { color: '#527e70', fontSize: 16, lineHeight: 24 }, modalNote: { color: '#8c9f97', fontSize: 12, lineHeight: 18, marginTop: 16 } });
