import { useState } from 'react';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { sendPasswordResetEmail } from 'firebase/auth';
import { View } from 'react-native';
import { Text, Pressable, TextInput } from '../i18n/Localized';
import { DetailPage, detailStyles as styles } from '../components/DetailPage';
import { useSession } from '../components/Session';
import { useAuthFlow } from '../components/AuthFlow';
import { exportPrivateData } from '../services/privateState';
import { auth } from '../services/firebase';
export default function PrivacyScreen() {
 const { user } = useSession(); const { saveNow } = useAuthFlow(); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false); const [exported, setExported] = useState('');
 async function run(work: () => Promise<void>) { setBusy(true); setMessage(''); try { await work(); } catch { setMessage('Әрекет орындалмады. Интернет байланысын тексеріңіз.'); } finally { setBusy(false); } }
 return <DetailPage title="Құпиялылық және қауіпсіздік"><View style={styles.card}><Text style={styles.title}>Жеке деректеріңіз</Text><Text style={styles.body}>Анкетаңыз бен күнделіктеріңіз жеке Firebase аккаунтыңызда сақталады. Жақындарыңыз тек өзіңіз рұқсат берген мәліметтерді көреді. Қауымдастықтағы пікірлер тіркелген пайдаланушыларға көрінеді.</Text></View><Pressable accessibilityRole="button" disabled={busy || !user} style={styles.button} onPress={() => void run(async () => { await saveNow(); setExported(await exportPrivateData(user!.uid)); })}><Text style={styles.label}>Деректерімді дайындау</Text></Pressable>{exported ? <View style={styles.card}><TextInput accessibilityLabel="Жеке деректер JSON" value={exported} editable={false} multiline selectTextOnFocus style={[styles.input, { height: 160 }]} /><Pressable accessibilityRole="button" onPress={() => void run(async () => { const copied = await Clipboard.setStringAsync(exported); if (!copied) throw new Error(); setMessage('Деректер JSON түрінде көшірілді. Жеке файлға сақтаңыз.'); })} style={styles.button}><Text style={styles.label}>Деректерімді көшіру</Text></Pressable></View> : null}<Pressable accessibilityRole="button" style={styles.button} onPress={() => router.push('/connect')}><Text style={styles.label}>Жақындар қолжетімділігін басқару</Text></Pressable>{user?.providerData.some(provider => provider.providerId === 'password') ? <Pressable accessibilityRole="button" disabled={busy} style={styles.button} onPress={() => void run(async () => { await sendPasswordResetEmail(auth, user.email!); setMessage('Құпиясөзді өзгерту хаты жіберілді.'); })}><Text style={styles.label}>Құпиясөзді өзгерту</Text></Pressable> : null}{message ? <Text accessibilityRole="alert" style={styles.body}>{message}</Text> : null}</DetailPage>;
}
