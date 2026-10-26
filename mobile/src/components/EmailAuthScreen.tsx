import { useState } from 'react';
import { router } from 'expo-router';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { authError } from '../services/authErrors';
import { AuthScreen, PrimaryButton, RegisterGirl, LoginGirl, SocialButtons, useAuthSize } from './AuthUI';

export function EmailAuthScreen({ mode }: { mode: 'register' | 'login' }) {
  const login = mode === 'login';
  const { s } = useAuthSize();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit() {
    if (busy) return;
    const address = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) { setError('Дұрыс email мекенжайын енгізіңіз.'); return; }
    if (!password || (!login && password.length < 8)) { setError('Құпиясөз кемінде 8 таңбадан тұрсын.'); return; }
    if (!login && password !== confirm) { setError('Құпиясөздер сәйкес емес.'); return; }
    Keyboard.dismiss(); setBusy(true); setError('');
    try {
      if (login) await signInWithEmailAndPassword(auth, address, password);
      else await createUserWithEmailAndPassword(auth, address, password);
      setPassword(''); setConfirm('');
      router.replace('/login');
    } catch (reason) { setError(authError(reason)); }
    finally { setBusy(false); }
  }
  return <AuthScreen><View style={{ paddingTop: s(95), paddingHorizontal: s(28), alignItems: 'center' }}>
    {login ? <LoginGirl height={s(170)} /> : <RegisterGirl height={s(175)} />}
    <Text accessibilityRole="header" style={{ fontSize: s(login ? 26 : 34), fontWeight: '800', color: '#003f39', textAlign: 'center', marginTop: 8 }}>{login ? 'Қайта қош келдіңіз!' : 'Тіркелу'}</Text>
    <Text style={{ color: '#819692', fontSize: s(14), textAlign: 'center', marginVertical: s(12) }}>{login ? 'Email және құпиясөз арқылы кіріңіз.' : 'Email енгізіп, құпиясөз жасаңыз.'}</Text>
    <View style={{ width: '100%', gap: s(10) }}>
      <TextInput accessibilityLabel="Email" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" autoCapitalize="none" autoCorrect={false} maxLength={254} editable={!busy} style={styles.input} />
      <View style={styles.password}><TextInput accessibilityLabel="Құпиясөз" placeholder={login ? 'Құпиясөз' : 'Құпиясөз (кемінде 8 таңба)'} secureTextEntry={!showPassword} value={password} onChangeText={setPassword} autoComplete={login ? 'current-password' : 'new-password'} textContentType={login ? 'password' : 'newPassword'} autoCapitalize="none" autoCorrect={false} editable={!busy} style={[styles.input, { flex: 1, paddingRight: 0 }]} /><Pressable accessibilityRole="button" accessibilityLabel={showPassword ? 'Құпиясөзді жасыру' : 'Құпиясөзді көрсету'} onPress={() => setShowPassword(!showPassword)} style={{ padding: 12 }}><Text style={{ color: '#43b3a2', fontSize: 12 }}>{showPassword ? 'Жасыру' : 'Көрсету'}</Text></Pressable></View>
      {!login ? <TextInput accessibilityLabel="Құпиясөзді қайталау" placeholder="Құпиясөзді қайталау" secureTextEntry={!showPassword} value={confirm} onChangeText={setConfirm} autoComplete="new-password" textContentType="newPassword" autoCapitalize="none" autoCorrect={false} editable={!busy} style={styles.input} /> : <Pressable accessibilityRole="button" onPress={() => router.push('/reset-password')} style={{ alignSelf: 'flex-end', padding: 8 }}><Text style={{ color: '#389f90' }}>Құпиясөзді ұмыттыңыз ба?</Text></Pressable>}
      {error ? <Text accessibilityRole="alert" style={{ color: '#ae534a', fontSize: 12 }}>{error}</Text> : null}
      <PrimaryButton title={busy ? 'Күтіңіз…' : login ? 'Кіру' : 'Тіркелу'} disabled={busy} onPress={() => void submit()} scale={s(1)} />
    </View>
    <Text style={{ color: '#8aa49d', marginVertical: s(16) }}>Немесе</Text>
    <View style={{ width: '100%' }}><SocialButtons scale={s(1)} onPress={provider => router.push(provider === 'google' ? '/google-accounts' : '/apple-signin')} /></View>
    <Pressable accessibilityRole="button" onPress={() => router.replace(login ? '/register' : '/login')} style={{ padding: 18 }}><Text style={{ color: '#348e80' }}>{login ? 'Аккаунт жоқ па? Тіркелу' : 'Менде аккаунт бар'}</Text></Pressable>
  </View></AuthScreen>;
}
const styles = StyleSheet.create({ input: { backgroundColor: '#fff', borderRadius: 26, minHeight: 50, paddingHorizontal: 18, paddingVertical: 12, fontSize: 15, color: '#174e49' }, password: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 26 } });
