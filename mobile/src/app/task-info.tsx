import { useAuthFlow } from '../components/AuthFlow';
import { normalizeCustomTasks, type TaskGroupId } from '../utils/tasks';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AddressPin } from '../components/AddressPin';
import { Image, Pressable, Text, View } from '../i18n/Localized';
import { useAuthSize } from '../components/AuthUI';
import { AnswerBackdrop } from '../components/AnswerBackdrop';
import { CradleIllustration } from '../components/CradleIllustration';
import { getTaskArticle } from '../data/taskArticles';

export default function TaskInfoScreen() {
  const { topic, from, customIndex } = useLocalSearchParams<{ topic?: string; from?: string; customIndex?: string }>();
  const { customTasks } = useAuthFlow();
  const group = typeof topic === 'string' && /^personal-(first|second|third|bag|home)$/.test(topic) ? topic.slice(9) as TaskGroupId : null;
  const customTitle = group && typeof customIndex === 'string' && /^\d$/.test(customIndex) ? normalizeCustomTasks(customTasks)[group][Number(customIndex)] : undefined;
  const article = getTaskArticle(typeof topic === 'string' ? topic : undefined);
  const { s, pageWidth } = useAuthSize();
  const insets = useSafeAreaInsets();
  const [error, setError] = useState('');
  const close = () => router.canGoBack() ? router.back() : router.replace(from === 'home' ? '/home' : from === 'personal-tasks' ? '/personal-tasks' : '/tasks');
  return <View style={{ flex: 1, backgroundColor: '#faf7f1', alignItems: 'center' }}><View style={{ flex: 1, width: pageWidth, overflow: 'hidden' }}>
    <AnswerBackdrop />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: '100%', paddingHorizontal: s(20), paddingTop: Math.max(insets.top + s(12), s(40)), paddingBottom: Math.max(insets.bottom + s(25), s(35)) }}>
      <View style={{ height: s(60), alignItems: 'center', justifyContent: 'center', marginBottom: s(12) }}>
        <Image accessible={false} source={require('../../assets/images/illustrated-moon.png')} resizeMode="contain" style={{ width: s(54), height: s(54), borderRadius: s(12) }} />
        <Pressable accessibilityRole="button" accessibilityLabel="Жабу" onPress={close} style={({ pressed }) => ({ position: 'absolute', left: 0, top: 0, width: 44, height: 44, borderRadius: 24, borderWidth: 2, borderColor: '#b5d8cd', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff66', opacity: pressed ? 0.65 : 1 })}><Text style={{ color: '#078879', fontSize: 31, lineHeight: 34 }}>×</Text></Pressable>
      </View>
      {article ? <>
        <View style={{ width: '83%', alignSelf: 'center', backgroundColor: '#ffffffeb', borderRadius: s(24), overflow: 'hidden' }}><CradleIllustration /></View>
        <Text verbatim={!!customTitle} accessibilityRole="header" style={{ fontSize: s(16), color: '#35b4a3', lineHeight: s(22), marginTop: s(13), marginBottom: s(12) }}>{!!customTitle ? customTitle : article.title}</Text>
        <View style={{ backgroundColor: '#fff', borderColor: '#078e7d', borderWidth: 1, borderRadius: s(46), paddingHorizontal: s(24), paddingVertical: s(26) }}><Text style={{ fontSize: s(16), lineHeight: s(29), color: '#078577', textAlign: 'center' }}>{article.body}</Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Қалаңыздағы емханалар" onPress={() => router.push('/city-hospitals')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: s(18), padding: 16, borderRadius: 22, backgroundColor: '#e3f3ec', minHeight: 54 }}><AddressPin /><Text style={{ flex: 1, color: '#087f70', fontSize: s(14), fontWeight: '600' }}>Қалаңыздағы емханалар</Text><Text style={{ color: '#087f70', fontSize: 23 }}>›</Text></Pressable>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>{[{ url: article.source, name: article.sourceName }, ...(article.references || [])].map(source => <Pressable key={source.url} accessibilityRole="link" onPress={() => { setError(''); void Linking.openURL(source.url).catch(() => setError('Сілтеме ашылмады. Қайта көріңіз.')); }} style={{ padding: 14 }}><Text style={{ color: '#187e70', fontSize: s(11), textAlign: 'center' }}>Дереккөз: {source.name} ↗</Text></Pressable>)}</View>
      </> : <View style={{ backgroundColor: '#fff', borderRadius: 28, padding: 26 }}><Text accessibilityRole="header" style={{ color: '#087f70', fontSize: 23 }}>Ақпарат табылмады</Text></View>}

      {error ? <Text accessibilityRole="alert" style={{ color: '#a45050', marginBottom: 12 }}>{error}</Text> : null}
      <Pressable accessibilityRole="button" onPress={close} style={({ pressed }) => ({ minHeight: s(60), borderRadius: s(32), marginTop: s(8), backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 7px 0px #dcd6ea', opacity: pressed ? 0.7 : 1 })}><Text style={{ color: '#077e70', fontSize: s(20), fontWeight: '700' }}>Түсінікті</Text></Pressable>
    </ScrollView>
  </View></View>;
}
