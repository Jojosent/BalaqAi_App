import { getLocale } from '../i18n/core';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, ScrollView, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Text, Pressable, View } from '../i18n/Localized';
import { useLanguage } from '../i18n/Language';
import { useSession } from '../components/Session';
import { useAuthFlow } from '../components/AuthFlow';
import { useAuthSize } from '../components/AuthUI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { detailStyles as styles } from '../components/DetailPage';
import { db } from '../services/privateState';
import { acceptInvite, clearPendingInvite, createInvite, inviteUrl, listenSummary, pendingInviteKey, validInviteId, type SharedSummary, type ShareScope } from '../services/sharing';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { calculatePregnancy, kazakhDate } from '../utils/pregnancy';
function SharedCard({ id }: { id: string }) {
 const [data, setData] = useState<SharedSummary | null>(null); const [error, setError] = useState(false);
 useEffect(() => listenSummary(id, setData, () => setError(true)), [id]);
 const pregnancy = data?.pregnancyStart ? calculatePregnancy(data.pregnancyStart) : null;
 return <View style={styles.card}><Text style={styles.title}>Жақыныңыздың жаңартулары</Text>{error ? <Text style={styles.body}>Қолжетімділік тоқтатылды немесе шақыру мерзімі аяқталды.</Text> : !data ? <Text>Деректер жүктелуде…</Text> : <>{data.scope.name ? <Text verbatim style={styles.title}>{data.name}</Text> : null}{data.scope.pregnancy ? <Text style={styles.body}>{pregnancy ? `${pregnancy.weeks} апта ${pregnancy.days} күн` : 'Жүктілік мерзімі енгізілмеген'}</Text> : null}{pregnancy ? <Text style={styles.body}>Болжамды босану күні: {kazakhDate(pregnancy.due, getLocale())}</Text> : null}{data.scope.progress ? <Text style={styles.body}>Орындалған тапсырмалар: {data.completed}</Text> : null}</>}</View>;
}
export default function ConnectScreen() {
  useLanguage();
 const params = useLocalSearchParams<{ invite?: string }>(); const requested = typeof params.invite === 'string' ? params.invite : '';
 const { user, ready } = useSession(); const flow = useAuthFlow(); const { t } = useLanguage(); const { s, pageWidth } = useAuthSize(); const insets = useSafeAreaInsets();
 const [scope, setScope] = useState<ShareScope>({ name: true, pregnancy: false, progress: false }); const [id, setId] = useState('');
 const [enabled, setEnabled] = useState(false); const [expires, setExpires] = useState(0); const [members, setMembers] = useState<{ id: string; active: boolean }[]>([]); const [connections, setConnections] = useState<string[]>([]);
 const [accepted, setAccepted] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [message, setMessage] = useState('');
 useEffect(() => { if (!requested || !validInviteId(requested)) return; if (!user) void AsyncStorage.setItem(pendingInviteKey, requested); else void clearPendingInvite(); }, [requested, user]);
 useEffect(() => {
  if (!user) return;
  const stopPointer = onSnapshot(doc(db, 'users', user.uid, 'settings', 'sharing'), snap => setId(snap.data()?.inviteId || ''), () => setError('Деректер жүктелмеді. Интернет байланысын тексеріп, қайталаңыз.'));
  const stopConnections = onSnapshot(collection(db, 'users', user.uid, 'connections'), snap => setConnections(snap.docs.map(item => item.id)), () => setError('Деректер жүктелмеді. Интернет байланысын тексеріп, қайталаңыз.'));
  return () => { stopPointer(); stopConnections(); };
 }, [user]);
 useEffect(() => {
  if (!id || !user) return;
  const stopInvite = onSnapshot(doc(db, 'shareInvites', id), snap => { setEnabled(snap.data()?.enabled === true && snap.data()?.expiresAt.toMillis() > Date.now()); setExpires(snap.data()?.expiresAt.toMillis() || 0); });
  const stopMembers = onSnapshot(collection(db, 'shareInvites', id, 'members'), snap => setMembers(snap.docs.map(item => ({ id: item.id, active: item.data().active }))), () => setError('Байланыстар жүктелмеді.'));
  void getDoc(doc(db, 'shareData', id)).then(snap => { if (snap.exists()) setScope(snap.data().scope); }).catch(() => setError('Деректер жүктелмеді. Интернет байланысын тексеріп, қайталаңыз.'));
  return () => { stopInvite(); stopMembers(); };
 }, [id, user]);
 async function run(work: () => Promise<unknown>) { if (busy) return; setBusy(true); setError(''); setMessage(''); try { await work(); } catch { setError('Әрекет орындалмады. Байланысты тексеріңіз немесе жаңа шақыру сұраңыз.'); } finally { setBusy(false); } }
 const button = (title: string, work: () => Promise<unknown>, disabled = false) => <Pressable accessibilityRole="button" disabled={busy || disabled} onPress={() => void run(work)} style={[styles.button, { opacity: busy || disabled ? 0.4 : 1 }]}><Text style={styles.label}>{title}</Text></Pressable>;
 const joining = !!requested;
 return <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}><ScrollView style={{ width: pageWidth }} contentContainerStyle={{ paddingBottom: insets.bottom + 35 }}>
  <View style={{ backgroundColor: '#49b9ad', borderBottomLeftRadius: s(28), borderBottomRightRadius: s(28), padding: s(23), paddingTop: insets.top + s(55), minHeight: s(215), overflow: 'hidden' }}><Pressable accessibilityRole="button" accessibilityLabel="Артқа" onPress={() => router.replace(user ? '/account' : '/login')} style={{ backgroundColor: '#fff', width: 46, height: 46, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}><Text style={{ color: '#899691', fontSize: 34 }}>‹</Text></Pressable><Svg accessible={false} width={s(105)} height={s(105)} viewBox="0 0 110 110" style={{ position: 'absolute', right: s(12), bottom: s(22) }}><Defs><LinearGradient id="connect-bubble" x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#e7a49d" /><Stop offset="0.6" stopColor="#af72d2" /><Stop offset="1" stopColor="#6f79ed" /></LinearGradient></Defs><Path d="M55 4C27 4 7 23 7 50c0 17 9 32 22 40v16l16-9c34 8 60-13 60-45C105 25 84 4 55 4Z" fill="url(#connect-bubble)"/><Path d="m24 64 24-25 17 13 24-15-25 28-17-13Z" fill="#b4e5d0" /></Svg><Text accessibilityRole="header" style={{ fontSize: s(23), fontWeight: '700', color: '#fff', maxWidth: s(240), lineHeight: s(28) }}>{joining ? 'Жақыныңызбен байланысыңыз' : 'Жаңартуларды алу үшін QR кодты сканерлеңіз'}</Text></View>
  <View style={{ padding: s(23), gap: s(12) }}>
   {!ready ? <Text>Деректер жүктелуде…</Text> : !user ? <View style={styles.card}><Text style={styles.body}>Жақыныңыздың жаңартуларын көру үшін аккаунтқа кіріңіз. Шақыру кіруден кейін ашылады.</Text>{button('Кіру', async () => router.push('/login'))}{button('Тіркелу', async () => router.push('/register'))}</View> : joining ? !validInviteId(requested) ? <Text style={styles.body}>Шақыру сілтемесі дұрыс емес.</Text> : accepted || connections.includes(requested) ? <SharedCard id={requested} /> : <View style={styles.card}><Text style={styles.body}>Қосылғаннан кейін тек иесі таңдаған мәліметтерді көресіз. Сіздің жеке деректеріңіз оған берілмейді.</Text>{button('Шақыруды қабылдау', async () => { await acceptInvite(user.uid, requested); setAccepted(true); })}</View> : <>
    {enabled && id ? <><View accessibilityLabel={t('Шақыру QR коды')} style={{ alignItems: 'center', paddingVertical: s(35), backgroundColor: '#fff' }}><QRCode value={inviteUrl(id)} size={Math.min(pageWidth - s(90), 300)} quietZone={12} /></View><Text style={[styles.body, { textAlign: 'center' }]}>Жұбайыңыздың немесе жақындарыңыздың телефоны арқылы профиліңізді байланыстырып, жаңартуларды бірге алыңыз.</Text><Text style={[styles.body, { textAlign: 'center' }]}>Қолжетімділік мерзімі: {expires ? new Date(expires).toLocaleDateString(getLocale()) : '—'}</Text>{button('Сілтемені көшіру', async () => { const copied = await Clipboard.setStringAsync(inviteUrl(id)); if (!copied) throw new Error(); setMessage('Сілтеме көшірілді'); })}{button('Бөлісу', async () => { const link = inviteUrl(id); if (Platform.OS === 'web') { if (typeof navigator !== 'undefined' && navigator.share) await navigator.share({ title: 'BalaqAi', url: link }); else { await Clipboard.setStringAsync(link); setMessage('Сілтеме көшірілді'); } } else await Share.share({ message: link, title: 'BalaqAi' }); })}{button('Қолжетімділікті тоқтату', () => updateDoc(doc(db, 'shareInvites', id), { enabled: false }))}</> : null}
    <View style={styles.card}><Text style={styles.title}>Қандай деректермен бөлісесіз?</Text>{([{ key: 'name', title: 'Атым' }, { key: 'pregnancy', title: 'Жүктілік мерзімі' }, { key: 'progress', title: 'Орындалған тапсырмалар саны' }] as const).map(item => <Pressable key={item.key} accessibilityRole="checkbox" accessibilityState={{ checked: scope[item.key] }} disabled={busy} onPress={() => setScope(previous => ({ ...previous, [item.key]: !previous[item.key] }))} style={{ paddingVertical: 12, flexDirection: 'row', gap: 12 }}><Text style={{ color: '#49b9ad', fontSize: 20 }}>{scope[item.key] ? '☑' : '□'}</Text><Text style={{ flex: 1, fontSize: 16 }}>{item.title}</Text></Pressable>)}<Text style={styles.body}>Жеке жазбалар, салмақ және көңіл-күй күнделіктері бөлісілмейді. Жаңа шақыру алдыңғы қолжетімділікті тоқтатады.</Text>{button(enabled ? 'Таңдауды сақтау' : 'Шақыру жасау', async () => { await flow.saveNow(); if (enabled) await updateDoc(doc(db, 'shareData', id), { ownerUid: user.uid, ...(await import('../services/sharing')).summary(flow, scope) }); else await createInvite(user.uid, flow, scope); }, !Object.values(scope).some(Boolean))}</View>
    {enabled && members.some(member => member.active) ? <View style={styles.card}><Text style={styles.title}>Қосылған жақындар</Text>{members.filter(member => member.active).map((member, index) => <View key={member.id}><Text>Жақын адам {index + 1}</Text>{button('Қолжетімділікті қайтарып алу', () => updateDoc(doc(db, 'shareInvites', id, 'members', member.id), { active: false }))}</View>)}</View> : null}
   </>}
   {error ? <Text accessibilityRole="alert" style={{ color: '#ae534a' }}>{error}</Text> : null}{message ? <Text accessibilityRole="status" style={{ color: '#299f8c' }}>{message}</Text> : null}
   {user && !joining ? connections.map(connection => <SharedCard key={connection} id={connection} />) : null}
   {joining && user ? button('Менің байланыстарым', async () => router.replace('/connect')) : null}
  </View>
 </ScrollView></View>;
}
