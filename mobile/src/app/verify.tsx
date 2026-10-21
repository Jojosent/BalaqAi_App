import { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { sendEmailVerification } from 'firebase/auth';
import { useSession } from '../components/Session';
import { AuthScreen, PrimaryButton, useAuthSize } from '../components/AuthUI';
import { authError } from '../services/authErrors';
export default function VerifyScreen() {
  const { user, refresh, logout } = useSession();
  const { s } = useAuthSize();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [until, setUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const remaining = Math.max(0, Math.ceil((until - now) / 1000));
  async function check() {
    setBusy(true); setError('');
    try { await refresh(); if (!user?.emailVerified) setMessage('Email әлі расталмады. Поштадағы сілтемені ашып, қайта тексеріңіз.'); }
    catch (reason) { setError(authError(reason)); } finally { setBusy(false); }
  }
  async function resend() {
    if (!user || busy || remaining) return;
    setBusy(true); setError('');
    try { await sendEmailVerification(user); setUntil(Date.now() + 60_000); setNow(Date.now()); setMessage('Растау хаты жіберілді. Спам қалтасын да тексеріңіз.'); }
    catch (reason) { setError(authError(reason)); } finally { setBusy(false); }
  }
  return <AuthScreen><View style={{ alignItems: 'center', paddingTop: s(110), paddingHorizontal: s(30) }}><Image source={require('../../assets/images/kids.png')} resizeMode="contain" style={{ width: s(220), height: s(150) }} /><Text accessibilityRole="header" style={{ fontSize: s(27), fontWeight: '700', color: '#28635e', marginTop: 20 }}>Email мекенжайын растау</Text><Text style={{ color: '#819692', textAlign: 'center', fontSize: s(15), lineHeight: s(23), marginVertical: 18 }}>{user?.email}{'\n'}Поштаңыздағы Firebase растау сілтемесін ашыңыз, содан кейін төмендегі батырманы басыңыз.</Text>{message ? <Text accessibilityRole="status" style={{ color: '#478c7c', textAlign: 'center', marginBottom: 15 }}>{message}</Text> : null}{error ? <Text accessibilityRole="alert" style={{ color: '#ae534a', marginBottom: 15 }}>{error}</Text> : null}<View style={{ width: '100%' }}><PrimaryButton title={busy ? 'Күтіңіз…' : 'Растадым, жалғастыру'} disabled={busy} onPress={() => void check()} scale={s(1)} /></View><Pressable accessibilityRole="button" disabled={busy || remaining > 0} onPress={() => void resend()} style={{ padding: 18 }}><Text style={{ color: '#348f7f' }}>Хатты қайта жіберу{remaining ? ` (${remaining})` : ''}</Text></Pressable><Pressable accessibilityRole="button" disabled={busy} onPress={() => void logout()} style={{ padding: 14 }}><Text style={{ color: '#7c958b' }}>Басқа email арқылы кіру</Text></Pressable></View></AuthScreen>;
}
