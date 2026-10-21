import { useState } from 'react';
import { router } from 'expo-router';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { ProviderIcon } from '../components/ProviderIcon';
import { useAuthFlow } from '../components/AuthFlow';

const steps = {
  register: { title: 'Тіркелу', body: 'Тіркелу экраны келесі қадамда қосылады.' },
  login: { title: 'Қош келдіңіз!', body: 'Аккаунтқа кіру экраны келесі қадамда қосылады.' },
  google: { title: 'Google арқылы кіру', body: 'Google арқылы кіру әзірге қосылмаған.' },
  apple: { title: 'Apple арқылы кіру', body: 'Apple арқылы кіру әзірге қосылмаған.' },
};

export default function WelcomeScreen() {
  const { setIntent } = useAuthFlow();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<keyof typeof steps | null>(null);
  const pageWidth = Math.min(width, 500);
  const u = pageWidth / 375;
  const pageHeight = Math.max(height, 754 * u);
  const s = (value: number) => value * u;

  return (
    <View style={styles.root}>
      <View style={[styles.page, { width: pageWidth }]}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: pageHeight }}>
          <View style={[styles.scene, { minHeight: pageHeight }]}>
            <Image source={require('../../assets/images/background.png')} resizeMode="cover" style={[StyleSheet.absoluteFill, { width: pageWidth, height: pageHeight }]} accessible={false} />
            <View style={[styles.content, { paddingTop: Math.max(s(124), pageHeight * 0.165, insets.top + s(80)), paddingHorizontal: s(42), paddingBottom: Math.max(s(100), insets.bottom + s(30)) }]}>
              <Image source={require('../../assets/images/kids.png')} resizeMode="contain" style={{ width: s(205), height: s(137) }} accessibilityLabel="Ұлттық киім киген қыз бен ұл" />
              <Text accessibilityLabel="BalaqAi" style={[styles.wordmark, { fontSize: s(48), lineHeight: s(59), marginTop: s(-8) }]}>Balaq<Text style={styles.ai}>Ai</Text></Text>
              <Text accessibilityRole="header" style={[styles.heading, { fontSize: s(24), lineHeight: s(31), marginTop: s(12), marginHorizontal: s(-12) }]}>BalaqAI-ға қош келдіңіз!</Text>
              <Text style={[styles.subtitle, { fontSize: s(14), lineHeight: s(17), marginTop: s(16) }]}>{'Сіздің ана болу жолыңызда\nсенімді серігіңіз'}</Text>

              <View style={{ width: '100%', gap: s(13), marginTop: s(23) }}>
                <Pressable accessibilityRole="button" onPress={() => { setIntent('register'); router.push('/register'); }} style={({ pressed }) => [styles.button, styles.primary, { minHeight: s(46), borderRadius: s(28), opacity: pressed ? 0.78 : 1 }]}>
                  <Text style={[styles.primaryLabel, { fontSize: s(17) }]}>Тіркелу</Text>
                  <View style={{ position: 'absolute', right: s(25) }}>
                    <Svg width={s(23)} height={s(23)} viewBox="0 0 24 24" fill="none"><Path d="M3 12h18m-8-8 8 8-8 8" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></Svg>
                  </View>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={() => { setIntent('login'); router.push('/login'); }} style={({ pressed }) => [styles.button, styles.secondary, { minHeight: s(46), borderRadius: s(28), opacity: pressed ? 0.78 : 1 }]}>
                  <Text style={[styles.secondaryLabel, { fontSize: s(17) }]}>Менде аккаунт бар</Text>
                </Pressable>
              </View>

              <View style={[styles.divider, { gap: s(9), marginTop: s(26), marginBottom: s(15), paddingHorizontal: s(14) }]}>
                <View style={styles.line} /><Text style={[styles.or, { fontSize: s(14) }]}>Немесе</Text><View style={styles.line} />
              </View>
              <View style={[styles.providers, { gap: s(7) }]}>
                {(['google', 'apple'] as const).map(provider => (
                  <Pressable key={provider} accessibilityRole="button" accessibilityLabel={`${provider === 'google' ? 'Google' : 'Apple'} арқылы кіру`} onPress={() => { setIntent('register'); router.push(provider === 'google' ? '/google-accounts' : '/apple-signin'); }} style={({ pressed }) => [styles.provider, { minHeight: Math.max(44, s(34)), borderRadius: s(22), gap: s(8), opacity: pressed ? 0.7 : 1 }]}>
                    <ProviderIcon provider={provider} size={s(22)} />
                    <Text style={[styles.providerLabel, { fontSize: s(11.5) }]}>{provider === 'google' ? 'Google' : 'Apple'} арқылы</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      <Modal visible={selected !== null} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <View style={styles.scrim}>
          <Pressable style={StyleSheet.absoluteFill} accessibilityLabel="Жабу" onPress={() => setSelected(null)} />
          <View accessibilityViewIsModal style={styles.dialog}>
            <Text style={styles.dialogEyebrow}>BalaqAi</Text>
            <Text accessibilityRole="header" style={styles.dialogTitle}>{selected && steps[selected].title}</Text>
            <Text style={styles.dialogBody}>{selected && steps[selected].body}</Text>
            <Pressable accessibilityRole="button" onPress={() => setSelected(null)} style={({ pressed }) => [styles.close, { opacity: pressed ? 0.8 : 1 }]}><Text style={styles.primaryLabel}>Түсінікті</Text></Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#e6f3f0', alignItems: 'center' },
  page: { flex: 1, overflow: 'hidden' },
  scene: { width: '100%', backgroundColor: '#d6f1ed' },
  content: { alignItems: 'center' },
  wordmark: { color: '#000', fontWeight: '700', letterSpacing: -1.5 },
  ai: { color: '#006b62' },
  heading: { color: '#28635e', fontWeight: '700', textAlign: 'center' },
  subtitle: { color: '#829793', textAlign: 'center', fontWeight: '400' },
  button: { width: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 9 },
  primary: { backgroundColor: '#4dbbad' },
  secondary: { backgroundColor: '#fafbfa' },
  primaryLabel: { color: '#fff', fontSize: 17, fontWeight: '700' },
  secondaryLabel: { color: '#4dbbad', fontWeight: '800', textAlign: 'center' },
  divider: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  line: { flex: 1, height: 1, backgroundColor: '#829d97' },
  or: { color: '#819a95', fontWeight: '700' },
  providers: { flexDirection: 'row', width: '100%' },
  provider: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fbfa', paddingHorizontal: 8, paddingVertical: 6 },
  providerLabel: { color: '#000', fontWeight: '600' },
  scrim: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28, backgroundColor: 'rgba(14, 60, 55, 0.35)' },
  dialog: { width: '100%', maxWidth: 350, backgroundColor: '#f8fcfa', borderRadius: 28, padding: 28 },
  dialogEyebrow: { color: '#4dbbad', fontSize: 16, fontWeight: '800', marginBottom: 20 },
  dialogTitle: { color: '#28635e', fontSize: 24, fontWeight: '700' },
  dialogBody: { color: '#728b85', fontSize: 16, lineHeight: 24, marginTop: 12, marginBottom: 24 },
  close: { alignItems: 'center', backgroundColor: '#4dbbad', borderRadius: 24, padding: 14 },
});
