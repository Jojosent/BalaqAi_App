import { useEffect } from 'react';
import { router, usePathname } from 'expo-router';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useSession } from './Session';
import { useAuthFlow } from './AuthFlow';

const publicPaths = ['/', '/register', '/login', '/verify', '/reset-password', '/google-accounts', '/google-consent', '/apple-signin', '/apple-consent'];
export function AuthGate() {
  const { user, ready, logout } = useSession();
  const { dataReady, syncError, reloadData, profile, stage, pregnancyStart } = useAuthFlow();
  const path = usePathname();
  useEffect(() => {
    if (!ready) return;
    if (!user) { if (!publicPaths.includes(path) || path === '/verify') router.replace('/login'); return; }
    if (!dataReady) return;
    if (publicPaths.includes(path)) router.replace(!profile.birthday || !profile.city || !profile.name ? '/profile' : !stage ? '/stage' : stage === 'pregnant' && !pregnancyStart ? '/pregnancy-dating' : '/home');
  }, [user, ready, dataReady, path, profile, stage, pregnancyStart]);
  if (ready && (!user || dataReady)) return null;
  return <View style={{ position: 'absolute', inset: 0, backgroundColor: '#e9f6f2', alignItems: 'center', justifyContent: 'center', padding: 30 }}>
    {syncError ? <><Text accessibilityRole="alert" style={{ color: '#8c4d45', textAlign: 'center', marginBottom: 15 }}>{syncError}</Text><Pressable accessibilityRole="button" onPress={() => void reloadData()} style={{ padding: 15 }}><Text style={{ color: '#299c89' }}>Қайта жүктеу</Text></Pressable><Pressable accessibilityRole="button" onPress={() => void logout()} style={{ padding: 15 }}><Text>Аккаунттан шығу</Text></Pressable></> : <><ActivityIndicator color="#42bdae" /><Text style={{ color: '#6a8e81', marginTop: 15 }}>Деректер жүктелуде…</Text></>}
  </View>;
}
