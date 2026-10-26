import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthFlow } from '../components/AuthFlow';
import { Notice, useAuthSize } from '../components/AuthUI';
import { durationText, kickElapsed, KICK_SESSION_MS, normalizeKickSessions, type KickSession } from '../utils/kicks';

const timeText = (time: number) => new Intl.DateTimeFormat('kk-KZ', { hour: '2-digit', minute: '2-digit' }).format(new Date(time));
function dateText(time: number, now: number) {
  const date = new Date(time), today = new Date(now);
  const sameDay = date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
  return `${sameDay ? 'Бүгін' : new Intl.DateTimeFormat('kk-KZ', { day: '2-digit', month: 'short' }).format(date)} ${timeText(time)}`;
}

export default function KickCounterScreen() {
  const { s, pageWidth } = useAuthSize();
  const insets = useSafeAreaInsets();
  const { kickSessions, updateKicks, syncStatus, saveNow } = useAuthFlow();
  const sessions = normalizeKickSessions(kickSessions);
  const active = sessions[0]?.endedAt === null ? sessions[0] : null;
  const [now, setNow] = useState(Date.now);
  const [selected, setSelected] = useState<KickSession | null>(null);
  const [sourceError, setSourceError] = useState('');
  const startedAt = active?.startedAt;
  useEffect(() => {
    if (!startedAt) return;
    const tick = () => {
      const time = Date.now(); setNow(time);
      if (time >= startedAt + KICK_SESSION_MS) updateKicks('stop', time);
    };
    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [startedAt, updateKicks]);
  function press() { const time = Date.now(); setNow(time); updateKicks(active ? 'kick' : 'start', time); }
  const elapsed = active ? kickElapsed(active, now) : 0;
  const remaining = Math.max(0, KICK_SESSION_MS - elapsed);
  return <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}><View style={{ width: pageWidth, flex: 1 }}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(s(25), insets.bottom + s(15)) }}>
      <View style={{ backgroundColor: active ? '#d9efec' : '#e4f3f3', borderBottomLeftRadius: s(28), borderBottomRightRadius: s(28), paddingTop: Math.max(s(55), insets.top + s(16)), paddingBottom: s(16), minHeight: s(455) }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(16), gap: s(10) }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Бақылау құралдарына оралу" onPress={() => router.canGoBack() ? router.back() : router.replace('/tracking-tools')} style={{ width: s(44), height: s(44), borderRadius: s(25), backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#919191', fontSize: s(34), lineHeight: s(38) }}>‹</Text></Pressable>
          <Text accessibilityRole="header" style={{ flex: 1, color: '#030807', fontSize: s(25), fontWeight: '700', lineHeight: s(28), textAlign: 'center', paddingRight: s(14) }}>{'Сәбидің қимылын\nсанау'}</Text>
        </View>
        <View style={{ height: s(31), justifyContent: 'center', alignItems: 'flex-end', paddingRight: s(27), marginTop: s(3) }}>{active ? <Text accessibilityLiveRegion="polite" style={{ color: '#939f9c', fontSize: s(18) }}>{active.count} қимыл</Text> : null}</View>
        <Pressable accessibilityRole="button" accessibilityLabel={active ? 'Бір қимыл қосу' : 'Қимыл санауды бастау'} onPress={press} style={({ pressed }) => ({ alignSelf: 'center', width: s(218), height: s(218), borderRadius: s(115), borderWidth: s(6), borderColor: '#49baad', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
          <Image source={require('../../assets/images/baby-feet.png')} accessible={false} resizeMode="contain" style={{ width: s(184), height: s(184) }} />
          <View pointerEvents="none" style={{ position: 'absolute', backgroundColor: '#f48e9ba8', paddingHorizontal: s(12), paddingVertical: s(2), borderRadius: s(27) }}><Text style={{ color: '#fff', fontSize: s(active ? 26 : 29), fontWeight: '700' }}>{active ? '+1 қимыл' : 'Бастау'}</Text></View>
        </Pressable>
        {active ? <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: s(12), paddingHorizontal: s(16), gap: s(8) }}>
          <View style={{ flex: 1, alignItems: 'center' }}><Text style={{ color: '#060d0b', fontSize: s(24) }}>{timeText(active.startedAt)}</Text><Text style={{ color: '#9aa5a2', fontSize: s(12), marginTop: 2 }}>Басталған уақыт</Text></View>
          <Pressable accessibilityRole="button" accessibilityLabel="Сеансты тоқтату және сақтау" onPress={() => { const time = Date.now(); setNow(time); updateKicks('stop', time); }} style={({ pressed }) => ({ width: s(80), height: s(80), borderRadius: s(44), backgroundColor: '#49baad', alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.75 : 1 })}><Text style={{ color: '#fff', fontSize: s(14), fontWeight: '600' }}>ТОҚТАТУ</Text></Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}><Text style={{ color: '#060d0b', fontSize: s(24), fontVariant: ['tabular-nums'] }}>{durationText(remaining + (remaining > 0 ? 999 : 0))}</Text><Text style={{ color: '#9aa5a2', fontSize: s(12), marginTop: 2 }}>Қалған уақыт</Text></View>
        </View> : <Text style={{ textAlign: 'center', color: '#a1aeaa', fontSize: s(14), lineHeight: s(17), marginTop: s(31), paddingHorizontal: s(42) }}>{'Сәбидің қимылын санауды бастау үшін\nбатырманы басыңыз'}</Text>}
        {active ? <Text style={{ color: '#799d94', textAlign: 'center', fontSize: s(10), marginTop: s(8) }}>Әр сезілген қимылда үлкен батырманы басыңыз</Text> : null}
      </View>
      <View style={{ paddingHorizontal: s(20), paddingTop: s(27) }}>
        <Text accessibilityRole="header" style={{ color: '#030807', fontSize: s(29), fontWeight: '700', marginBottom: s(24) }}>Күнделік</Text>
        <View style={{ flexDirection: 'row', paddingBottom: s(10), borderBottomWidth: sessions.length ? 1 : 0, borderColor: '#e3e3e3' }}><Text style={{ width: '40%', color: '#a0a5a2', fontSize: s(14) }}>Күні мен уақыты</Text><Text style={{ width: '32%', color: '#a0a5a2', fontSize: s(14) }}>Ұзақтығы</Text><Text style={{ flex: 1, color: '#a0a5a2', fontSize: s(14), textAlign: 'center' }}>Қимыл саны</Text></View>
        {sessions.map(session => <Pressable key={session.startedAt} accessibilityRole="button" accessibilityLabel={`${dateText(session.startedAt, now)}, ${session.count} қимыл, ${session.endedAt === null ? 'санау жүріп жатыр' : 'аяқталған'}`} onPress={() => setSelected(session)} style={{ flexDirection: 'row', alignItems: 'center', minHeight: s(50), borderBottomWidth: 1, borderColor: '#e3e3e3' }}><Text style={{ width: '40%', color: '#151c18', fontSize: s(14) }}>{dateText(session.startedAt, now)}</Text><Text style={{ width: '32%', color: '#151c18', fontSize: s(14), fontVariant: ['tabular-nums'] }}>{durationText(kickElapsed(session, now))}</Text><Text style={{ flex: 1, color: '#151c18', fontSize: s(14), textAlign: 'center' }}>{session.count}</Text><Text style={{ color: '#919995', fontSize: s(28) }}>›</Text></Pressable>)}
        <Text accessibilityRole="status" style={{ color: '#9baaa3', fontSize: s(10), textAlign: 'center', marginTop: s(16) }}>{syncStatus === 'saving' ? 'Сақталуда…' : syncStatus === 'error' ? 'Сақталмады. Байланысты тексеріңіз.' : 'Соңғы 20 сеанс жеке аккаунтыңызға сақталады.'}</Text>
        {syncStatus === 'error' ? <Pressable accessibilityRole="button" onPress={() => void saveNow().catch(() => {})} style={{ alignSelf: 'center', padding: 12 }}><Text style={{ color: '#39a994' }}>Қайта сақтау</Text></Pressable> : null}
        <Text style={{ color: '#82958c', fontSize: s(11), lineHeight: s(16), marginTop: s(24) }}>Бұл — жеке күнделік. Қимыл әдеттегіден азайса, жоғалса немесе өзгерсе, таймерді күтпей дәрігерге не перзентханаға дереу хабарласыңыз.</Text>
        <Pressable accessibilityRole="link" onPress={() => { void Linking.openURL('https://www.nhs.uk/pregnancy/keeping-well/your-babys-movements/').catch(() => setSourceError('Сілтеме ашылмады. Интернет байланысын тексеріңіз.')); }} style={{ paddingVertical: 12 }}><Text style={{ color: '#3ba795', fontSize: s(11) }}>Қимылдар туралы: NHS ↗</Text></Pressable>
        {sourceError ? <Text accessibilityRole="alert" style={{ color: '#a9524d', fontSize: 12 }}>{sourceError}</Text> : null}
      </View>
    </ScrollView>
    {selected ? <Notice title={dateText(selected.startedAt, now)} body={`Қимыл саны: ${selected.count}\nҰзақтығы: ${durationText(kickElapsed(selected, now))}\n${selected.endedAt === null ? 'Санау жүріп жатыр' : `Аяқталған уақыт: ${timeText(selected.endedAt)}`}`} onClose={() => setSelected(null)} /> : null}
  </View></View>;
}
