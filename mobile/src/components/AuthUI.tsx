import type { PropsWithChildren } from 'react';
import { Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { ProviderIcon } from './ProviderIcon';

export const colors = { teal: '#4dbbad', dark: '#28635e', muted: '#819692' };

export function useAuthSize(baseHeight = 812) {
  const { width, height } = useWindowDimensions();
  const pageWidth = Math.min(width, 500);
  const unit = pageWidth / 375;
  return { pageWidth, pageHeight: Math.max(height, baseHeight * unit), s: (n: number) => n * unit };
}

export function AuthScreen({ children, baseHeight = 812 }: PropsWithChildren<{ baseHeight?: number }>) {
  const { pageWidth, pageHeight, s } = useAuthSize(baseHeight);
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.page, { width: pageWidth }]}>
        <Image source={require('../../assets/images/background.png')} accessible={false} resizeMode="cover" style={[StyleSheet.absoluteFill, { width: pageWidth, height: pageHeight }]} />
        <ScrollView keyboardShouldPersistTaps="handled" bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: pageHeight, paddingBottom: Math.max(insets.bottom + s(30), s(70)) }}>
          {children}
        </ScrollView>
        <Pressable accessibilityRole="button" accessibilityLabel="Артқа" hitSlop={8} onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={({ pressed }) => [styles.back, { top: Math.max(insets.top + s(10), s(40)), left: s(28), width: Math.max(44, s(38)), height: Math.max(44, s(38)), opacity: pressed ? 0.7 : 1 }]}>
          <Arrow back size={s(24)} color={colors.teal} />
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
}

export function Arrow({ back = false, size = 24, color = 'white' }: { back?: boolean; size?: number; color?: string }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d={back ? 'M21 12H3m8-8-8 8 8 8' : 'M3 12h18m-8-8 8 8-8 8'} stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
}

export function PrimaryButton({ title, onPress, disabled = false, scale = 1 }: { title: string; onPress: () => void; disabled?: boolean; scale?: number }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.primary, { minHeight: 46 * scale, borderRadius: 30 * scale, opacity: disabled ? 0.5 : pressed ? 0.78 : 1 }]}>
      <Text style={{ color: '#fff', fontSize: 17 * scale, fontWeight: '600' }}>{title}</Text>
      <View style={{ position: 'absolute', right: 24 * scale }}><Arrow size={23 * scale} /></View>
    </Pressable>
  );
}

export function Notice({ title, body, onClose }: { title: string; body: string; onClose: () => void }) {
  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.scrim}>
        <Pressable style={StyleSheet.absoluteFill} accessibilityLabel="Жабу" onPress={onClose} />
        <View accessibilityViewIsModal style={styles.dialog}>
          <Text style={styles.eyebrow}>BalaqAi</Text>
          <Text accessibilityRole="header" style={styles.dialogTitle}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <PrimaryButton title="Түсінікті" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

export function SocialButtons({ scale, onPress }: { scale: number; onPress: (provider: 'google' | 'apple') => void }) {
  return <View style={{ gap: 7 * scale, width: '100%' }}>{(['google', 'apple'] as const).map(provider => (
    <Pressable key={provider} accessibilityRole="button" onPress={() => onPress(provider)} style={({ pressed }) => [styles.social, { minHeight: Math.max(44, 34 * scale), borderRadius: 24 * scale, gap: 14 * scale, opacity: pressed ? 0.75 : 1 }]}>
      <ProviderIcon provider={provider} size={22 * scale} />
      <Text style={{ color: '#174e49', fontSize: 13 * scale, fontWeight: '600' }}>{provider === 'google' ? 'Google' : 'Apple'} арқылы кіру</Text>
    </Pressable>
  ))}</View>;
}

export function LoginGirl({ height }: { height: number }) {
  const ratio = height / 780;
  return (
    <View accessibilityLabel="Қош келдіңіз деген кішкентай қыз" accessibilityRole="image" style={{ width: 395 * ratio, height, overflow: 'hidden' }}>
      <Image source={require('../../assets/images/characters.png')} accessible={false} resizeMode="stretch" style={{ position: 'absolute', width: 2048 * ratio, height: (3760 / 6688) * 2048 * ratio, left: -395 * ratio, top: -150 * ratio }} />
    </View>
  );
}

export function RegisterGirl({ height }: { height: number }) {
  // Display only the rightmost girl from the original transparent character sheet.
  // Coordinates use a 2048px-wide reference; the original 6688px file is preserved.
  const ratio = height / 820;
  return (
    <View accessibilityLabel="Ұлттық киім киген кішкентай қыз" accessibilityRole="image" style={{ width: 393 * ratio, height, overflow: 'hidden' }}>
      <Image source={require('../../assets/images/characters.png')} accessible={false} resizeMode="stretch" style={{ position: 'absolute', width: 2048 * ratio, height: (3760 / 6688) * 2048 * ratio, left: -1655 * ratio, top: -110 * ratio }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#e6f3f0', alignItems: 'center' },
  page: { flex: 1, overflow: 'hidden' },
  back: { position: 'absolute', backgroundColor: '#fff', borderRadius: 30, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  primary: { backgroundColor: colors.teal, width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingVertical: 12 },
  scrim: { flex: 1, backgroundColor: 'rgba(14,60,55,0.35)', justifyContent: 'center', alignItems: 'center', padding: 28 },
  dialog: { width: '100%', maxWidth: 350, padding: 28, backgroundColor: '#f8fcfa', borderRadius: 28 },
  eyebrow: { color: colors.teal, fontSize: 16, fontWeight: '800', marginBottom: 20 },
  dialogTitle: { color: colors.dark, fontSize: 24, fontWeight: '700' },
  body: { color: colors.muted, fontSize: 16, lineHeight: 24, marginTop: 12, marginBottom: 24 },
  social: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 8 },
});
