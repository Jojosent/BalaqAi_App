import { useLanguage } from '../../i18n/Language';
import { Pressable, Text, TextInput, Image, View } from '../../i18n/Localized';
import { useEffect, useState } from 'react';
import { FlatList, Keyboard, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { useAuthSize } from '../../components/AuthUI';
import { useAuthFlow } from '../../components/AuthFlow';
import { MainIcon } from '../../components/MainIcon';
import { PickerShell } from '../../components/ProfilePickers';

import { addDoc, collection, deleteDoc, doc, limit, onSnapshot, orderBy, query as firestoreQuery, serverTimestamp } from 'firebase/firestore';
import { db, usePrivateState } from '../../services/privateState';
import { useSession } from '../../components/Session';

type Rect = { x: number; y: number; width: number; height: number };
const posts = [
  { id: 'kamala', author: 'Kamala Reddy', time: '2 сағат бұрын', caption: 'Әке мен баланың ең жылы сәттері.', likes: 5600, views: '7k', comments: 525, photo: { x: 44, y: 578, width: 650, height: 474 }, avatar: { x: 64, y: 426, width: 72, height: 72 } },
  { id: 'sneha', author: 'Sneha Bedi', time: '1 ай бұрын', caption: 'Кішкентайымызбен бірге өткізген күн.', likes: 1200, views: '3k', comments: 84, photo: { x: 44, y: 1268, width: 650, height: 392 }, avatar: { x: 64, y: 1188, width: 72, height: 72 } },
];
type Post = typeof posts[number];
type Comment = { id: string; uid: string; author: string; text: string };
const tabs = ['Ұсынылған', 'Жазылғандар', 'Жаңа'] as const;
type FeedTab = typeof tabs[number];

// Display the supplied reference's photo regions without resampling the original asset.
function ReferencePhoto({ rect, width, label }: { rect: Rect; width: number; label?: string }) {
  const scale = width / rect.width;
  return <View accessibilityLabel={label} style={{ width, height: rect.height * scale, overflow: 'hidden' }}><Image accessible={false} source={require('../../../assets/images/community-reference.png')} style={{ position: 'absolute', width: 750 * scale, height: 1788 * scale, left: -rect.x * scale, top: -rect.y * scale }} resizeMode="stretch" /></View>;
}
function FeedIcon({ name, active = false, size = 22 }: { name: 'heart' | 'bookmark' | 'eye' | 'comment'; active?: boolean; size?: number }) {
  const color = active ? '#47bbae' : '#929292';
  const d = name === 'heart' ? 'M12 21S2 15 2 8a5 5 0 0 1 10-1A5 5 0 0 1 22 8c0 7-10 13-10 13Z' : name === 'bookmark' ? 'M5 3h14v19l-7-4-7 4V3Z' : name === 'eye' ? 'M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z' : 'M21 11a9 9 0 0 1-13 8l-5 2 1-6a9 9 0 1 1 17-4Z';
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d={d} stroke={color} fill={active && name !== 'eye' ? color : 'none'} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />{name === 'eye' ? <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.7} /> : null}</Svg>;
}

export default function CommunityScreen() {
  const { t } = useLanguage();
  const { s } = useAuthSize();
  const { profile } = useAuthFlow();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<FeedTab>('Ұсынылған');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const { user } = useSession();
  const actions = usePrivateState('community', { liked: [] as string[], saved: [] as string[], followed: [] as string[] });
  const { liked, saved, followed } = actions.value;
  const [error, setError] = useState(''); const [sending, setSending] = useState(false);
  const [selected, setSelected] = useState<Post | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  useEffect(() => { if (!selected || !user) return; return onSnapshot(firestoreQuery(collection(db, 'communityPosts', selected.id, 'comments'), orderBy('at', 'asc'), limit(50)), snap => { setComments(previous => ({ ...previous, [selected.id]: snap.docs.map(item => ({ id: item.id, ...item.data() } as Comment)) })); setError(''); }, () => setError('Пікірлер жүктелмеді. Қайта ашып көріңіз.')); }, [selected, user]);
  const [draft, setDraft] = useState('');
  const toggle = (id: string, key: 'liked' | 'saved' | 'followed') => { void actions.update(previous => { const items = previous[key]; return { ...previous, [key]: items.includes(id) ? items.filter(item => item !== id) : [...items, id] }; }); };
  const filtered = posts.filter(post => (tab !== 'Жазылғандар' || followed.includes(post.id)) && (!savedOnly || saved.includes(post.id)) && `${post.author} ${t(post.caption)}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const data = tab === 'Жаңа' ? [...filtered].sort((a, b) => posts.indexOf(a) - posts.indexOf(b)) : filtered;
  function openPost(post: Post) { setSelected(post); setDraft(''); }
  async function sendComment() {
    const text = draft.trim(); if (!selected || !text || !user || sending) return;
    setSending(true); setError('');
    try { await addDoc(collection(db, 'communityPosts', selected.id, 'comments'), { uid: user.uid, postId: selected.id, author: profile.name || 'BalaqAi', text, at: serverTimestamp() }); setDraft(''); Keyboard.dismiss(); }
    catch { setError('Пікір жіберілмеді. Қайта көріңіз.'); } finally { setSending(false); }
  }
  const header = <View>
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: Math.max(s(63), insets.top + s(18)), marginBottom: s(32), gap: s(10) }}><Text accessibilityRole="header" style={{ flex: 1, fontSize: s(29), color: '#080808', fontWeight: '600' }}>Қауымдастық</Text><Pressable accessibilityRole="button" accessibilityLabel={searchOpen ? 'Іздеуді жабу' : 'Қауымдастықтан іздеу'} onPress={() => { setSearchOpen(!searchOpen); setQuery(''); setSavedOnly(false); }} style={styles.iconButton}><MainIcon name="search" color="#47bbae" size={s(24)} /></Pressable></View>
    {searchOpen ? <View style={{ gap: s(10), marginBottom: s(16) }}><TextInput accessibilityLabel="Автор немесе жарияланым іздеу" placeholder="Автор немесе жарияланым іздеу" value={query} onChangeText={setQuery} autoFocus style={[styles.search, { fontSize: s(14) }]} placeholderTextColor="#98a6a2" /><Pressable accessibilityRole="checkbox" accessibilityState={{ checked: savedOnly }} onPress={() => setSavedOnly(!savedOnly)} style={{ flexDirection: 'row', gap: 8, alignItems: 'center', alignSelf: 'flex-start', minHeight: 38 }}><FeedIcon name="bookmark" active={savedOnly} size={18} /><Text style={{ color: '#379e92', fontSize: s(13) }}>Сақталғандар {savedOnly ? '✓' : ''}</Text></Pressable></View> : null}
    <View accessibilityRole="tablist" style={[styles.tabs, { borderRadius: s(26), padding: s(4), marginBottom: s(20) }]}>{tabs.map(item => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: item === tab }} onPress={() => setTab(item)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: s(36), borderRadius: s(22), backgroundColor: item === tab ? '#49bcb0' : 'transparent' }}><Text style={{ color: item === tab ? '#fff' : '#47bbae', fontSize: s(15), fontWeight: '500' }}>{item}</Text></Pressable>)}</View>
  </View>;
  return <>
    <FlatList style={{ backgroundColor: '#fbf9f9' }} contentContainerStyle={{ paddingHorizontal: s(22), paddingBottom: s(20) }} data={data} keyExtractor={post => post.id} ListHeaderComponent={header} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}
      ListEmptyComponent={<View style={styles.empty}><Text style={{ fontSize: 18, color: '#294b43', fontWeight: '600' }}>{query ? 'Ештеңе табылмады' : savedOnly ? 'Сақталған жарияланым жоқ' : 'Әзірге жазылым жоқ'}</Text><Text style={styles.hint}>{query ? 'Басқа атаумен іздеп көріңіз.' : savedOnly ? 'Жарияланымдағы бетбелгіні басыңыз.' : '«Ұсынылған» бөліміндегі авторды ашып, «Жазылу» батырмасын басыңыз.'}</Text></View>}
      ListFooterComponent={<Text style={[styles.hint, { textAlign: 'center', marginTop: 8 }]}>Таныстыру жарияланымдары · Таңдаулар аккаунтыңызға сақталады</Text>}
      renderItem={({ item: post }) => <View style={[styles.card, { borderRadius: s(19), marginBottom: s(22) }]}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', padding: s(10), minHeight: s(post.id === 'kamala' ? 86 : 50) }}><Pressable accessibilityRole="button" accessibilityLabel={`${post.author}: автор және пікірлер`} onPress={() => openPost(post)} style={{ flex: 1, flexDirection: 'row', gap: s(9), alignItems: 'center' }}><View style={{ borderRadius: s(20), overflow: 'hidden' }}><ReferencePhoto rect={post.avatar} width={s(36)} /></View><View style={{ flex: 1 }}><Text style={{ fontSize: s(14), color: '#151515', fontWeight: '500' }}>{post.author}</Text><Text style={{ fontSize: s(12), color: '#929090', marginTop: s(2) }}>{post.time}</Text></View></Pressable><Pressable accessibilityRole="button" accessibilityLabel={`${post.author}: сақтау`} accessibilityState={{ selected: saved.includes(post.id) }} onPress={() => toggle(post.id, 'saved')} style={styles.iconButton}><FeedIcon name="bookmark" active={saved.includes(post.id)} size={s(26)} /></Pressable></View>
        <Pressable accessibilityRole="button" accessibilityLabel={`${post.author}: жарияланымды ашу`} onPress={() => openPost(post)}><ReferencePhoto rect={post.photo} width={s(331)} label={post.caption} /></Pressable>
        <View style={{ paddingHorizontal: s(13), minHeight: s(37), flexDirection: 'row', alignItems: 'center', gap: s(17) }}><Pressable accessibilityRole="button" accessibilityLabel={`${post.author}: ұнату`} accessibilityState={{ selected: liked.includes(post.id) }} onPress={() => toggle(post.id, 'liked')} style={[styles.metric, { marginRight: 'auto' }]}><FeedIcon name="heart" active={liked.includes(post.id)} size={s(17)} /><Text style={styles.count}>{liked.includes(post.id) ? 'Ұнады' : 'Ұнату'}</Text></Pressable><View style={styles.metric} accessibilityLabel={`${post.views} қаралым`}><FeedIcon name="eye" size={s(19)} /><Text style={styles.count}>Үлгі</Text></View><Pressable accessibilityRole="button" accessibilityLabel={`${post.author}: пікірлер`} onPress={() => openPost(post)} style={styles.metric}><FeedIcon name="comment" size={s(16)} /><Text style={styles.count}>{'Пікірлер'}</Text></Pressable></View>
      </View>} />
    {(error || actions.error) ? <Text accessibilityRole="alert" style={{ padding: 14, color: '#ae534a' }}>{error || actions.error}</Text> : null}
    {selected ? <PickerShell title="Жарияланым" onClose={() => setSelected(null)}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}><Text style={{ flex: 1, fontSize: 18, fontWeight: '600', color: '#243d38' }}>{selected.author}</Text><Pressable accessibilityRole="button" onPress={() => toggle(selected.id, 'followed')} style={styles.follow}><Text style={{ color: '#fff', fontWeight: '600' }}>{followed.includes(selected.id) ? 'Жазылудан бас тарту' : 'Жазылу'}</Text></Pressable></View><Text style={{ fontSize: 15, lineHeight: 22, color: '#526a63' }}>{selected.caption}</Text><Text style={styles.hint}>Пікіріңіз бен атыңыз тіркелген пайдаланушыларға көрінеді.</Text><FlatList style={{ maxHeight: 190, marginVertical: 12 }} data={comments[selected.id] || []} keyExtractor={(_, index) => String(index)} ListEmptyComponent={<Text style={styles.hint}>Алғашқы пікірді жазыңыз.</Text>} renderItem={({ item }) => <View style={styles.comment}><Text style={{ fontWeight: '600', color: '#315c51' }} verbatim>{item.author}</Text><Text style={{ color: '#61766f', marginTop: 4 }} verbatim>{item.text}</Text>{item.uid === user?.uid ? <Pressable accessibilityRole="button" onPress={() => void deleteDoc(doc(db, 'communityPosts', selected.id, 'comments', item.id)).catch(() => setError('Пікір жойылмады.'))}><Text style={{ padding: 8, color: '#c4736b' }}>Жою</Text></Pressable> : null}</View>} /><TextInput accessibilityLabel="Пікіріңіз" placeholder="Пікіріңізді жазыңыз…" value={draft} onChangeText={setDraft} maxLength={500} multiline style={styles.search} /><Pressable accessibilityRole="button" disabled={!draft.trim() || sending} onPress={() => void sendComment()} style={[styles.send, { opacity: draft.trim() ? 1 : 0.4 }]}><Text style={{ color: '#fff', fontWeight: '600' }}>Пікір жіберу</Text></Pressable></PickerShell> : null}
  </>;
}
const styles = StyleSheet.create({
  tabs: { backgroundColor: '#fff', flexDirection: 'row', boxShadow: '0px 5px 15px rgba(80, 50, 50, 0.1)' },
  card: { backgroundColor: '#fff', overflow: 'hidden', boxShadow: '0px 5px 13px rgba(80, 50, 50, 0.10)' },
  iconButton: { minWidth: 36, minHeight: 36, alignItems: 'center', justifyContent: 'center' },
  metric: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 36 }, count: { fontSize: 12, color: '#929292' },
  search: { backgroundColor: '#fff', padding: 14, borderRadius: 18, color: '#294b43', borderWidth: 1, borderColor: '#e3eeea', fontSize: 14 },
  empty: { padding: 25, backgroundColor: '#fff', borderRadius: 20, gap: 8 }, hint: { fontSize: 12, lineHeight: 19, color: '#90a09a', marginTop: 8 },
  follow: { backgroundColor: '#49bcb0', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12 }, comment: { padding: 12, borderRadius: 14, backgroundColor: '#f2f8f5', marginBottom: 8 },
  send: { backgroundColor: '#49bcb0', padding: 15, borderRadius: 22, alignItems: 'center', marginTop: 12 },
});
