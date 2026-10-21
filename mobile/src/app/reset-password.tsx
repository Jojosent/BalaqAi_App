import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';
import { authError } from '../services/authErrors';
import { AuthScreen, PrimaryButton } from '../components/AuthUI';
export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function reset() {
    if (busy) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Дұрыс email енгізіңіз.'); return; }
    setBusy(true); setError('');
    try { await sendPasswordResetEmail(auth, email.trim()); setMessage('Егер бұл email тіркелген болса, қалпына келтіру хаты жіберіледі. Спам қалтасын да тексеріңіз.'); }
    catch (reason) { setError(authError(reason)); } finally { setBusy(false); }
  }
  return <AuthScreen><View style={{ paddingHorizontal: 28, paddingTop: 170, gap: 20 }}><Text accessibilityRole="header" style={{ fontSize: 27, fontWeight: '700', color: '#28635e' }}>Құпиясөзді қалпына келтіру</Text><TextInput accessibilityLabel="Email" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" style={{ backgroundColor: '#fff', borderRadius: 25, padding: 16, fontSize: 16 }} />{error ? <Text accessibilityRole="alert" style={{ color: '#ae534a' }}>{error}</Text> : null}{message ? <Text accessibilityRole="status" style={{ color: '#478c7c' }}>{message}</Text> : <PrimaryButton title={busy ? 'Күтіңіз…' : 'Хат жіберу'} disabled={busy} onPress={() => void reset()} />}</View></AuthScreen>;
}
