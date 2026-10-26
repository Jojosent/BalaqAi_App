import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useAuthFlow, type LifeStage } from '../components/AuthFlow';
import { AuthScreen, PrimaryButton, useAuthSize } from '../components/AuthUI';

const options = [
  { id: 'pregnant' as const, title: 'Жүктімін', description: 'Жүктілік мерзімін бақылап,\nпайдалы ақпарат алыңыз.', image: require('../../assets/images/mom2.png'), background: '#fff6f3', circle: '#f8e3dd', accent: '#cc978d' },
  { id: 'planning' as const, title: 'Жүктілікті жоспарлап жүрмін', description: 'Дайындық кезеңінде қолдау\nмен кеңестер алыңыз.', image: require('../../assets/images/grass1.png'), background: '#effaf6', circle: '#d9f1e9', accent: '#4da89a' },
];

export default function StageScreen() {
  const { s } = useAuthSize();
  const { stage, setStage } = useAuthFlow();
  function select(value: LifeStage) { setStage(value); }

  return <AuthScreen>
    <View style={{ alignItems: 'center', paddingTop: s(105), paddingHorizontal: s(28) }}>
      <Image source={require('../../assets/images/boy1.png')} accessibilityLabel="Ұлттық киім киген кішкентай ұл" resizeMode="contain" style={{ width: s(155), height: s(140) }} />
      <Text accessibilityRole="header" style={[styles.title, { fontSize: s(25), lineHeight: s(33), marginTop: s(8), marginHorizontal: s(-14) }]}>Қазір қай кезеңдесіз?</Text>
      <Text style={[styles.subtitle, { fontSize: s(12), lineHeight: s(17), marginTop: s(7), marginBottom: s(18) }]}>{'Сізге ыңғайлы әрі жеке ұсыныстар алу\nүшін таңдаңыз.'}</Text>
      <View accessibilityRole="radiogroup" accessibilityLabel="Қазіргі кезеңіңіз" style={{ width: '100%', gap: s(10) }}>
        {options.map(option => {
          const selected = stage === option.id;
          return <Pressable key={option.id} accessibilityRole="radio" accessibilityLabel={option.title} accessibilityState={{ checked: selected }} aria-checked={selected} onPress={() => select(option.id)} style={({ pressed }) => [styles.card, { minHeight: s(76), borderRadius: s(32), paddingLeft: s(10), paddingRight: s(13), paddingVertical: s(5), gap: s(12), backgroundColor: option.background, borderWidth: selected ? 2 : 1, borderColor: selected ? option.accent : 'transparent', opacity: pressed ? 0.8 : 1 }]}>
            <View style={{ width: s(73), height: s(66), borderRadius: s(38), backgroundColor: option.circle, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
              <Image source={option.image} accessible={false} resizeMode="contain" style={{ width: s(option.id === 'planning' ? 82 : 73), height: s(option.id === 'pregnant' ? 92 : 78), marginTop: s(option.id === 'pregnant' ? 12 : 0) }} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[styles.optionTitle, { fontSize: s(option.id === 'planning' ? 11.5 : 14), lineHeight: s(18) }]}>{option.title}</Text>
              <Text style={[styles.optionBody, { fontSize: s(11.5), lineHeight: s(16), marginTop: s(5) }]}>{option.description}</Text>
            </View>
            <View style={{ width: s(29), height: s(29), borderRadius: s(18), backgroundColor: option.circle, alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={s(18)} height={s(18)} viewBox="0 0 24 24" fill="none"><Path d={selected ? 'm5 12 4 4L19 6' : 'm9 5 7 7-7 7'} stroke={option.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></Svg>
            </View>
          </Pressable>;
        })}
      </View>
      <View style={{ width: '100%', paddingHorizontal: s(8), marginTop: s(16) }}><PrimaryButton title="Жалғастыру" scale={s(1)} disabled={!options.some(option => option.id === stage)} onPress={() => { if (stage === 'pregnant') router.push('/pregnancy-dating'); else if (stage === 'planning') router.replace('/home'); }} /></View>
      <Text style={{ color: '#6c9187', fontSize: s(10), textAlign: 'center', marginTop: s(12) }}>Таңдауыңыз жеке аккаунтыңызға сақталады</Text>
    </View>
  </AuthScreen>;
}

const styles = StyleSheet.create({
  title: { color: '#003f39', textAlign: 'center', fontWeight: '800' },
  subtitle: { color: '#809594', textAlign: 'center' },
  card: { width: '100%', flexDirection: 'row', alignItems: 'center', boxShadow: '0px 5px 14px rgba(38,99,87,0.07)' },
  optionTitle: { color: '#173f39', fontWeight: '700' },
  optionBody: { color: '#7a8e8e' },
});

