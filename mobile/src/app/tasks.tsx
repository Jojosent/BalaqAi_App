import { useState } from 'react';
import { router } from 'expo-router';
import { Linking, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Image, Pressable, Text, View } from '../i18n/Localized';
import { useLanguage } from '../i18n/Language';
import { useAuthFlow } from '../components/AuthFlow';
import { useAuthSize } from '../components/AuthUI';
import { HorseBadge, MainIcon } from '../components/MainIcon';
import { useSvgId } from '../components/useSvgId';
import { prenatalSections, prenatalTaskKey, prenatalSource, type PrenatalSection } from '../data/prenatalTasks';

export function TaskSection({ section, open, onToggle }: { section: PrenatalSection; open: boolean; onToggle: () => void }) {
  const { s } = useAuthSize();
  const { t } = useLanguage();
  const { checklist, toggleChecklist } = useAuthFlow();
  const k = s(0.5);
  return <View style={{ gap: s(16) }}>
    <View style={{ height: s(155), borderRadius: s(27), overflow: 'hidden', backgroundColor: section.color, boxShadow: '0px 5px 4px rgba(0,0,0,0.2)' }}>
      <Svg pointerEvents="none" accessible={false} width="100%" height="100%" style={{ position: 'absolute' }} viewBox="0 0 326 155">
        {section.id === 'second' ? <Path d="M-10 8C22 71 25-35 62 12s-25 64 22 51 12-36 47-9-8 37 17 60 0 32 36 48M32 155c10-24 63-10 58-45s-40-20-20-54" fill="none" stroke="#fff" strokeWidth={1} opacity={0.35} /> : section.id === 'third' ? <Path d="M-20 62c102-24 225 44 207 73s-120 24-160-4M-20 83c96-22 205 31 191 62M-20 107c89-17 169 21 158 48" fill="none" stroke="#fff" strokeWidth={1.4} opacity={0.25} /> : <Path d="m22 4 2 7 7 2-7 2-2 7-2-7-7-2 7-2Zm183 20 2 8 8 2-8 2-2 8-2-8-8-2 8-2ZM17 124l3 10 10 3-10 3-3 10-3-10-10-3 10-3Zm124-78 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="#fff" opacity={0.6} />}
      </Svg>
      <View pointerEvents="none" style={{ position: 'absolute', right: 0, bottom: 0, width: section.crop.width * k, height: section.crop.height * k, overflow: 'hidden' }}><Image accessible={false} source={require('../../assets/images/tracking-tools-reference.png')} resizeMode="stretch" style={{ position: 'absolute', width: 750 * k, height: 1906 * k, left: -section.crop.x * k, top: -section.crop.y * k }} /></View>
      <View style={{ padding: s(19), maxWidth: s(240) }}><Text style={{ color: '#fff', fontSize: s(20), fontWeight: '700', lineHeight: s(24), marginTop: s(8) }}>{section.title}</Text><Text style={{ color: '#fff', fontSize: s(15), lineHeight: s(18), marginTop: s(4), maxWidth: s(182) }}>{section.subtitle}</Text></View>
      <Pressable accessibilityRole="button" accessibilityLabel={`${t(section.title)}: ${t('Бақылау')}`} accessibilityState={{ expanded: open }} onPress={onToggle} style={({ pressed }) => ({ position: 'absolute', bottom: s(15), left: s(19), minHeight: 36, width: s(120), borderRadius: s(24), backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.8 : 1 })}><Text style={{ color: '#fb69ad', fontSize: s(16), fontWeight: '600' }}>{open ? 'Жасыру' : 'Бақылау'}</Text></Pressable>
    </View>
    {open ? <View style={{ gap: s(10) }}>{section.tasks.map(task => {
      const key = prenatalTaskKey(section.id, task.id), checked = checklist.includes(key);
      return <Pressable key={task.id} accessibilityRole="checkbox" accessibilityLabel={task.title} accessibilityState={{ checked }} aria-checked={checked} onPress={() => toggleChecklist(key)} style={({ pressed }) => ({ backgroundColor: '#fff', borderRadius: s(12), minHeight: s(56), padding: s(13), flexDirection: 'row', alignItems: 'center', gap: s(11), opacity: pressed ? 0.75 : 1 })}>
        <View style={{ width: s(29), height: s(29), borderRadius: s(16), borderColor: checked ? '#49b9ad' : '#ff9e9a', borderWidth: 1, backgroundColor: checked ? '#49b9ad' : '#fff', alignItems: 'center', justifyContent: 'center' }}>{checked ? <Text style={{ color: '#fff', fontSize: s(21) }}>✓</Text> : null}</View>
        <View style={{ flex: 1 }}><Text style={{ color: checked ? '#85978f' : '#171c19', fontSize: s(12.5), fontWeight: '600', lineHeight: s(16), textDecorationLine: checked ? 'line-through' : 'none' }}>{task.title}</Text>{task.subtitle ? <Text style={{ color: '#626b66', fontSize: s(10), lineHeight: s(14), marginTop: s(2) }}>{task.subtitle}</Text> : null}</View>
        {task.badge ? <View accessible={false}><HorseBadge /></View> : null}
      </Pressable>;
    })}</View> : null}
  </View>;
}

export default function TasksScreen() {
  const gradientId = useSvgId('task-list');
  const { s, pageWidth } = useAuthSize();
  const insets = useSafeAreaInsets();
  const { syncStatus, syncError, saveNow } = useAuthFlow();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [sourceError, setSourceError] = useState('');
  return <View style={{ flex: 1, backgroundColor: '#d7efea', alignItems: 'center' }}><View style={{ flex: 1, width: pageWidth, overflow: 'hidden' }}>
    <Svg pointerEvents="none" accessible={false} width="100%" height="100%" style={{ position: 'absolute' }}><Defs><LinearGradient id={gradientId} x1="0" y1="0" x2="0.8" y2="1"><Stop offset="0" stopColor="#fff" /><Stop offset="0.4" stopColor="#d7efea" /><Stop offset="1" stopColor="#58c1b3" /></LinearGradient></Defs><Rect width="100%" height="100%" fill={`url(#${gradientId})`} /></Svg>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: Math.max(s(48), insets.top + s(16)), paddingBottom: s(25) }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Басты бетке оралу" onPress={() => router.canGoBack() ? router.back() : router.replace('/home')} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(10), minHeight: 44, alignSelf: 'flex-start' }}><Text style={{ color: '#279e90', fontSize: s(29), marginRight: s(5) }}>‹</Text><Text style={{ color: '#279e90', fontSize: s(20) }}>Басты бет</Text></Pressable>
      <Text accessibilityRole="header" style={{ color: '#080c0a', fontSize: s(29), lineHeight: s(36), fontWeight: '700', marginTop: s(13), marginBottom: s(35), paddingHorizontal: s(25) }}>Тапсырмалар тізімі</Text>
      <View style={{ paddingHorizontal: s(24), gap: s(26) }}>{prenatalSections.map(section => <TaskSection key={section.id} section={section} open={expanded.includes(section.id)} onToggle={() => setExpanded(previous => previous.includes(section.id) ? previous.filter(id => id !== section.id) : [...previous, section.id])} />)}
        <Pressable accessibilityRole="button" onPress={() => router.push('/personal-tasks')} style={{ backgroundColor: '#ffffffc9', borderRadius: s(15), padding: s(16) }}><Text style={{ color: '#268f81', fontSize: s(14), fontWeight: '600' }}>Жеке тапсырмалар ›</Text></Pressable>
        <Text accessibilityRole="status" style={{ color: syncStatus === 'error' ? '#9e5149' : '#365d52', fontSize: s(11), textAlign: 'center' }}>{syncStatus === 'error' ? syncError : syncStatus === 'saving' ? 'Сақталуда…' : 'Тапсырмалар жеке аккаунтыңызға сақталады.'}</Text>
        {syncStatus === 'error' ? <Pressable accessibilityRole="button" onPress={() => void saveNow().catch(() => {})} style={{ padding: 12, alignItems: 'center' }}><Text style={{ color: '#8d403d' }}>Қайта сақтау</Text></Pressable> : null}
        <Text style={{ color: '#365d52', fontSize: s(10), lineHeight: s(15), textAlign: 'center' }}>Қабылдаулар мен тексерулер кестесін дәрігермен келісіңіз.</Text>
        <Pressable accessibilityRole="link" onPress={() => { setSourceError(''); void Linking.openURL(prenatalSource).catch(() => setSourceError('Сілтеме ашылмады. Қайта көріңіз.')); }} style={{ alignSelf: 'center', padding: 10 }}><Text style={{ color: '#246a5d', fontSize: s(11) }}>Медициналық дереккөз ↗</Text></Pressable>{sourceError ? <Text accessibilityRole="alert" style={{ color: '#9e5149' }}>{sourceError}</Text> : null}
      </View>
    </ScrollView>
    <View style={{ backgroundColor: '#fffffff0', borderTopWidth: 1, borderTopColor: '#e4e8e5', flexDirection: 'row', paddingTop: 9, paddingBottom: Math.max(insets.bottom, 10) }}>{([{ route: '/home', icon: 'home', title: 'Басты бет' }, { route: '/community', icon: 'community', title: 'Қауымдастық' }, { route: '/shop', icon: 'shop', title: 'Дүкен' }, { route: '/account', icon: 'account', title: 'Профиль' }] as const).map(tab => <Pressable key={tab.route} accessibilityRole="button" onPress={() => router.navigate(tab.route)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 44, gap: 5 }}><MainIcon name={tab.icon} color={tab.icon === 'home' ? '#42bdae' : '#9fa5a2'} size={24} /><Text style={{ fontSize: 10, color: tab.icon === 'home' ? '#42bdae' : '#9fa5a2' }}>{tab.title}</Text></Pressable>)}</View>
  </View></View>;
}
