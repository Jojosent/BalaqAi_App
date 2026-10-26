import { useSvgId } from './useSvgId';
import { useLanguage } from '../i18n/Language';
import { Pressable, Text, TextInput, Image, View } from '../i18n/Localized';
import { useState } from 'react';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useAuthSize } from './AuthUI';
import { PregnancyHeader } from './HomeContent';

const cards = [
  { id: 'health', title: 'Ана денсаулығы\nжәне бақылау\nқұралдары', button: 'Бақылауды бастау', image: require('../../assets/images/ultrasound.png'), colors: ['#d7f1eb', '#46bbae'], accent: '#40aa9e' },
  { id: 'tv', title: 'MomCare TV', button: 'Қарау', image: require('../../assets/images/medic.png'), colors: ['#66e5f2', '#378eff'], accent: '#44bff0' },
  { id: 'tasks', title: 'Тапсырмалар\nтізімі', button: 'Тексеру', image: require('../../assets/images/genetics.png'), colors: ['#ac80ef', '#775ce8'], accent: '#9470e9' },
];

export default function PregnantHome() {
  const gradientPrefix = useSvgId('pregnancy-cards');
  const { t } = useLanguage();
  const { s, pageWidth } = useAuthSize();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const q = query.trim().toLocaleLowerCase();
  const visibleCards = cards.filter(card => `${t(card.title)} ${t(card.button)}`.toLocaleLowerCase().includes(q));
  const shareVisible = !q || t('Жақындарыңызбен бөлісіңіз').toLocaleLowerCase().includes(q);
  const width = pageWidth - s(48), height = s(170);
  return <View style={{ flex: 1, backgroundColor: '#fceeee' }}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(50) }}>
      <PregnancyHeader scale={s} onSearch={() => { setSearchOpen(value => !value); setQuery(''); }} />
      <View style={{ paddingHorizontal: s(24), paddingTop: s(30), gap: s(40) }}>
        {searchOpen ? <TextInput accessibilityLabel="Іздеу" placeholder="Іздеу" value={query} onChangeText={setQuery} style={{ backgroundColor: '#fff', borderRadius: 18, padding: 14, fontSize: 15, color: '#174e49' }} /> : null}
        {shareVisible ? <Pressable accessibilityRole="button" accessibilityLabel="Жақындарыңызбен бөлісіңіз" onPress={() => router.push('/connect')} style={({ pressed }) => ({ minHeight: s(87), backgroundColor: '#49b9ad', borderRadius: s(11), padding: s(19), paddingRight: s(85), justifyContent: 'center', opacity: pressed ? 0.8 : 1, boxShadow: '0px 3px 4px rgba(0,0,0,0.18)' })}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: s(20), lineHeight: s(25) }}>{'Жақындарыңызбен\nбөлісіңіз'}</Text>
          <Image source={require('../../assets/images/share-heart.png')} accessible={false} resizeMode="contain" style={{ position: 'absolute', right: s(10), width: s(72), height: s(72) }} />
        </Pressable> : null}
        {visibleCards.map(card => <View key={card.id} style={{ height, backgroundColor: card.colors[1], borderRadius: s(11), overflow: 'hidden', boxShadow: '0px 3px 4px rgba(0,0,0,0.18)' }}>
          <Svg pointerEvents="none" width={width} height={height} style={{ position: 'absolute' }}><Defs><LinearGradient id={`${gradientPrefix}-${card.id}`} x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor={card.colors[0]} /><Stop offset="1" stopColor={card.colors[1]} /></LinearGradient></Defs><Path d={`M0 0H${width}V${height}H0Z`} fill={`url(#${gradientPrefix}-${card.id})`} />{[0, 1, 2, 3].map(i => <Circle key={i} cx={s([18, 90, 190, 35][i])} cy={s([25, 60, 24, 130][i])} r={s(11)} stroke="#fff" strokeOpacity={0.18} strokeWidth={3} fill="none" />)}</Svg>
          <Image source={card.image} accessible={false} resizeMode="contain" style={{ position: 'absolute', right: s(card.id === 'tv' ? -27 : -8), bottom: 0, width: s(card.id === 'tv' ? 166 : 127), height: s(card.id === 'tasks' ? 134 : 177) }} />
          <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-start', padding: s(15) }}>
            <Text style={{ color: '#fff', fontSize: s(card.id === 'health' ? 23 : 28), lineHeight: s(card.id === 'health' ? 28 : 33), fontWeight: '700', marginBottom: s(10), maxWidth: s(220) }}>{card.title}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={`${card.title.replace(/\n/g, ' ')}: ${card.button}`} onPress={() => router.push(card.id === 'tv' ? '/momcare-tv' : card.id === 'health' ? '/tracking-tools' : '/tasks')} style={({ pressed }) => ({ backgroundColor: '#fff', borderRadius: s(20), paddingHorizontal: s(20), minHeight: 34, justifyContent: 'center', opacity: pressed ? 0.75 : 1 })}><Text style={{ color: card.accent, fontSize: s(15), fontWeight: '600' }}>{card.button}</Text></Pressable>
          </View>
        </View>)}
        {q && !visibleCards.length && !shareVisible ? <Text style={{ color: '#7a9389', textAlign: 'center' }}>Ештеңе табылмады</Text> : null}
      </View>
    </ScrollView>
  </View>;
}
