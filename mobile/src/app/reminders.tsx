import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Text, TextInput, Pressable } from '../i18n/Localized';
import { useLanguage } from '../i18n/Language';
import { getLocale } from '../i18n/core';
import { DetailPage, detailStyles as styles } from '../components/DetailPage';
import { useSession } from '../components/Session';
import { db } from '../services/privateState';
export default function RemindersScreen() {
 const { user } = useSession(); useLanguage();
 const [now, setNow] = useState(() => Date.now());
 useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(timer); }, []);
 const [items, setItems] = useState<{ id: string; title: string; at: number; done: boolean }[]>([]); const [title, setTitle] = useState(''); const [date, setDate] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
 useEffect(() => { if (!user) return; return onSnapshot(collection(db, 'users', user.uid, 'reminders'), snap => { setItems(snap.docs.map(item => ({ id: item.id, ...item.data() } as typeof items[number])).sort((a, b) => Number(a.done) - Number(b.done) || a.at - b.at)); setError(''); }, () => setError('Деректер жүктелмеді. Интернет байланысын тексеріп, қайталаңыз.')); }, [user]);
 async function run(work: () => Promise<unknown>) { if (busy) return; setBusy(true); setError(''); try { await work(); } catch { setError('Сақталмады. Байланысты тексеріп, қайта сақтаңыз.'); } finally { setBusy(false); } }
 async function add() {
  const m = date.match(/^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})$/); if (!m || !title.trim() || !user) { setError('Атау мен күнді енгізіңіз: КК.АА.ЖЖЖЖ СС:ММ'); return; }
  const [, d, month, y, h, min] = m.map(Number); const at = new Date(y, month - 1, d, h, min);
  if (at.getFullYear() !== y || at.getMonth() !== month - 1 || at.getDate() !== d || h > 23 || min > 59 || at.getTime() <= Date.now()) { setError('Болашақ күн мен уақытты дұрыс енгізіңіз.'); return; }
  await run(async () => { await addDoc(collection(db, 'users', user.uid, 'reminders'), { title: title.trim(), at: at.getTime(), done: false }); setTitle(''); setDate(''); });
 }
 return <DetailPage title="Ескертулер"><Text style={styles.body}>Ескертулер осы бөлімде көрсетіледі. Қолданба жабық кезде телефонға хабарлама жіберілмейді.</Text><View style={styles.card}><TextInput value={title} onChangeText={setTitle} placeholder="Ескерту атауы" maxLength={160} style={styles.input} /><TextInput value={date} onChangeText={setDate} placeholder="КК.АА.ЖЖЖЖ СС:ММ" maxLength={16} style={styles.input} /><Pressable accessibilityRole="button" disabled={busy} onPress={() => void add()} style={styles.button}><Text style={styles.label}>Қосу</Text></Pressable></View>{error ? <Text accessibilityRole="alert" style={{ color: '#ae534a' }}>{error}</Text> : null}{!items.length ? <Text style={styles.body}>Әзірге ескерту жоқ</Text> : items.map(item => <View key={item.id} style={styles.card}><Text verbatim style={[styles.title, { textDecorationLine: item.done ? 'line-through' : 'none' }]}>{item.title}</Text><Text verbatim style={styles.body}>{new Date(item.at).toLocaleString(getLocale())}</Text>{!item.done && item.at < now ? <Text style={{ color: '#c26f60' }}>Уақыты келді</Text> : null}<Pressable accessibilityRole="checkbox" accessibilityState={{ checked: item.done }} disabled={busy} onPress={() => void run(() => updateDoc(doc(db, 'users', user!.uid, 'reminders', item.id), { done: !item.done }))}><Text style={{ padding: 10, color: '#329b89' }}>{item.done ? 'Қайта ашу' : 'Орындалды'}</Text></Pressable><Pressable accessibilityRole="button" disabled={busy} onPress={() => void run(() => deleteDoc(doc(db, 'users', user!.uid, 'reminders', item.id)))}><Text style={{ padding: 10, color: '#c26f60' }}>Жою</Text></Pressable></View>)}</DetailPage>;
}
