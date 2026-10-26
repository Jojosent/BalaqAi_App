import { useLanguage } from '../i18n/Language';
import { getLocale } from '../i18n/core';
import { Text, Image, View } from '../i18n/Localized';
import { useEffect, useState } from 'react';

import Svg, { Path } from 'react-native-svg';
import { todayKey, kazakhDate, calculatePregnancy } from '../utils/pregnancy';

export function useToday() {
  const [today, setToday] = useState(() => todayKey());
  useEffect(() => { const timer = setInterval(() => setToday(todayKey()), 60_000); return () => clearInterval(timer); }, []);
  return today;
}

export function CalendarIcon({ size = 22 }: { size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M4 5h16v16H4V5Zm0 5h16M8 3v5m8-5v5M8 13h1m3 0h1m3 0h1m-9 4h1m3 0h1m3 0h1" stroke="#35ad9e" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
}

export function BabySummary({ result, scale }: { result: NonNullable<ReturnType<typeof calculatePregnancy>>; scale: number }) {
  useLanguage();
  return <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 14 * scale, padding: 12 * scale, borderRadius: 26 * scale, backgroundColor: '#effaf7', marginTop: 10 * scale }}>
    <Image source={require('../../assets/images/baby1.png')} resizeMode="contain" accessibilityLabel="Сәбидің иллюстрациясы" style={{ width: 79 * scale, height: 79 * scale }} />
    <View style={{ flex: 1 }}><Text style={{ fontSize: 13 * scale, color: '#174e49', fontWeight: '600', lineHeight: 18 * scale }}>{result.weeks} апта {result.days} күн</Text><Text style={{ fontSize: 11 * scale, color: '#839793', marginTop: 7 * scale }}>Болжамды босану күні:</Text><Text style={{ fontSize: 14 * scale, color: '#21a798', fontWeight: '600', marginTop: 5 * scale }}>{kazakhDate(result.due, getLocale())}</Text></View>
  </View>;
}

export function EstimateNote({ scale }: { scale: number }) {
  return <Text style={{ color: '#738e87', fontSize: 10 * scale, lineHeight: 15 * scale, textAlign: 'center', marginTop: 12 * scale }}>Болжамды есеп. Мерзімді дәрігер немесе УДЗ нақтылайды.</Text>;
}
