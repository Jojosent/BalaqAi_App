import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { AuthScreen, PrimaryButton, useAuthSize } from './AuthUI';
import { ProviderIcon } from './ProviderIcon';
import { socialSignIn } from '../services/social';
import { authError } from '../services/authErrors';
type Mode = 'google-accounts' | 'google-consent' | 'apple-signin' | 'apple-consent';
export function SocialAuthScreen({ mode }: { mode: Mode }) {
  const provider = mode.startsWith('google') ? 'google' : 'apple';
  const { s } = useAuthSize();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function signIn() {
    if (busy) return;
    setBusy(true); setError('');
    try { await socialSignIn(provider); }
    catch (reason) { setError(authError(reason)); }
    finally { setBusy(false); }
  }
  return <AuthScreen><View style={{ paddingTop: s(85), alignItems: 'center', paddingHorizontal: s(28) }}><Image source={require('../../assets/images/mom.png')} resizeMode="contain" style={{ width: s(180), height: s(210) }} /><View style={{ backgroundColor: '#fff', width: '100%', borderRadius: s(25), padding: s(22), alignItems: 'center' }}><ProviderIcon provider={provider} size={s(40)} /><Text accessibilityRole="header" style={{ fontSize: s(23), color: '#174e49', textAlign: 'center', fontWeight: '700', marginTop: 18 }}>{provider === 'google' ? 'Google' : 'Apple'} арқылы кіру</Text><Text style={{ color: '#819692', textAlign: 'center', lineHeight: 22, marginVertical: 20 }}>Аккаунтыңызды провайдердің қауіпсіз терезесінде таңдаңыз. Құпиясөзіңізді BalaqAi алмайды.</Text>{error ? <Text accessibilityRole="alert" style={{ color: '#ae534a', textAlign: 'center', marginBottom: 15 }}>{error}</Text> : null}<View style={{ width: '100%' }}><PrimaryButton title={busy ? 'Күтіңіз…' : 'Жалғастыру'} disabled={busy} onPress={() => void signIn()} scale={s(1)} /></View></View></View></AuthScreen>;
}
