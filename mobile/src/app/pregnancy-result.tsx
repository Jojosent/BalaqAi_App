import { useEffect } from 'react';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AuthScreen, colors, PrimaryButton, useAuthSize } from '../components/AuthUI';
import { useAuthFlow } from '../components/AuthFlow';
import { CalendarIcon, EstimateNote, useToday } from '../components/PregnancyUI';
import { calculatePregnancy, kazakhDate } from '../utils/pregnancy';

export default function PregnancyResultScreen() {
  const { s } = useAuthSize();
  const { pregnancyStart } = useAuthFlow();
  const today = useToday();
  const result = pregnancyStart ? calculatePregnancy(pregnancyStart, today) : null;
  useEffect(() => { if (!pregnancyStart) router.replace('/pregnancy-dating'); }, [pregnancyStart]);
  if (!result) return null;
  return <AuthScreen>
    <View style={{ alignItems: 'center', paddingTop: s(92), paddingHorizontal: s(27) }}>
      <Image source={require('../../assets/images/mom.png')} resizeMode="contain" accessibilityLabel="Сәбиін күтіп жүрген ана" style={{ width: s(148), height: s(174) }} />
      <Text accessibilityRole="header" style={[styles.title, { fontSize: s(29), lineHeight: s(38), marginTop: s(5) }]}>Құттықтаймыз!</Text>
      <Text style={[styles.muted, { fontSize: s(13), lineHeight: s(18), marginTop: s(7), textAlign: 'center', marginBottom: s(16) }]}>Сіздің жүктілік мерзіміңіз есептелді <Text style={{ color: '#8bcdc0' }}>♥</Text></Text>
      <View style={[styles.card, { padding: s(16), borderRadius: s(25), gap: s(14) }]}>
        <Image source={require('../../assets/images/baby1.png')} resizeMode="contain" accessibilityLabel="Сәбидің иллюстрациясы" style={{ width: s(96), height: s(96) }} />
        <View style={{ flex: 1 }}><Text style={[styles.muted, { fontSize: s(12), lineHeight: s(17) }]}>Сіздің жүктілік мерзіміңіз</Text><Text style={{ color: '#003f39', fontSize: s(24), lineHeight: s(32), fontWeight: '800', marginTop: s(4) }}>{result.weeks} апта {result.days} күн</Text><View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 280, now: Math.min(result.totalDays, 280), text: `${result.weeks} апта ${result.days} күн` }} style={{ height: s(8), borderRadius: s(6), backgroundColor: '#e7efeb', overflow: 'hidden', marginTop: s(10) }}><View style={{ height: '100%', width: `${result.progress * 100}%`, backgroundColor: colors.teal, borderRadius: s(6) }} /></View><Text style={[styles.muted, { fontSize: s(12), marginTop: s(10) }]}>Барлығы 40 апта</Text></View>
      </View>
      <View style={[styles.card, { padding: s(18), marginTop: s(8), gap: s(17), borderRadius: s(25) }]}><View style={{ backgroundColor: '#e0f3ec', padding: s(12), borderRadius: s(28) }}><CalendarIcon size={s(26)} /></View><View style={{ flex: 1 }}><Text style={[styles.muted, { fontSize: s(12) }]}>Болжамды босану күні</Text><Text style={{ color: '#003f39', fontWeight: '700', fontSize: s(20), marginTop: s(5) }}>{kazakhDate(result.due)}</Text></View></View>
      <View style={[styles.card, { padding: s(14), marginTop: s(10), gap: s(13), borderRadius: s(25), backgroundColor: '#e1f3ed' }]}><Image source={require('../../assets/images/grass1.png')} accessible={false} resizeMode="contain" style={{ width: s(52), height: s(52), backgroundColor: '#f2faf5', borderRadius: s(27) }} /><View style={{ flex: 1 }}><Text style={{ color: '#275f54', fontSize: s(12), lineHeight: s(17) }}>«Әрбір үлкен саяхат кішкентай қадамнан басталады»</Text><Text style={[styles.muted, { fontSize: s(11), lineHeight: s(16), marginTop: s(4) }]}>Біз сізбен әр қадамда бірге боламыз ♥</Text></View></View>
      <View style={{ width: '100%', marginTop: s(14) }}><PrimaryButton title="Жалғастыру" scale={s(1)} onPress={() => router.replace('/home')} /></View>
      <EstimateNote scale={s(1)} />
    </View>
  </AuthScreen>;
}
const styles = StyleSheet.create({ title: { color: '#003f39', fontWeight: '800', textAlign: 'center' }, muted: { color: '#849b94' }, card: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: 'rgba(255,255,255,0.94)' } });
