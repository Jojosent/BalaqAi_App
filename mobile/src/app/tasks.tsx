import { useState } from 'react';
import { router } from 'expo-router';
import { Keyboard, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { useAuthFlow } from '../components/AuthFlow';
import { useAuthSize } from '../components/AuthUI';
import { normalizeCustomTasks, taskGroups, taskKey, type TaskGroupId } from '../utils/tasks';

function Clipboard({ size }: { size: number }) {
  return <Svg accessible={false} width={size} height={size} viewBox="0 0 120 120"><Rect x="11" y="16" width="94" height="100" rx="4" fill="#94dbe6" /><Rect x="16" y="21" width="84" height="95" fill="#fff" /><Rect x="38" y="7" width="42" height="21" rx="10" fill="#ffdc42" /><Rect x="35" y="17" width="49" height="10" rx="3" fill="#fff2a6" /><Path d="m27 43 4 4 9-9m-13 23 4 4 9-9m-13 23 4 4 9-9" fill="none" stroke="#9da6bc" strokeWidth="3" /><Path d="M46 43h40M46 61h32M46 79h28" stroke="#efedf4" strokeWidth="4" /><Path d="m57 76 9-24 33-38q5-5 10 0t0 8L76 62Z" fill="#ffd343" /><Path d="m57 76 5-14 9 9Z" fill="#f285af" /><Path d="m66 52 10 10 30-35-10-9Z" fill="#ffb23f" /><Path d="m98 16 9 9 4-5q4-7-4-9Z" fill="#fa70ab" /></Svg>;
}

export default function TasksScreen() {
  const { s, pageWidth } = useAuthSize();
  const insets = useSafeAreaInsets();
  const { checklist, toggleChecklist, customTasks, addCustomTask, syncStatus } = useAuthFlow();
  const [expanded, setExpanded] = useState<TaskGroupId | null>(null);
  const [drafts, setDrafts] = useState<Partial<Record<TaskGroupId, string>>>({});
  const [error, setError] = useState('');
  const custom = normalizeCustomTasks(customTasks);
  function add(group: TaskGroupId) {
    const title = (drafts[group] || '').trim();
    if (!title) { setError('Тапсырманы енгізіңіз.'); return; }
    if (custom[group].length >= 10) { setError('Әр бөлімге 10 жеке тапсырмаға дейін қосуға болады.'); return; }
    addCustomTask(group, title); setDrafts(previous => ({ ...previous, [group]: '' })); setError(''); Keyboard.dismiss();
  }
  function task(group: TaskGroupId, title: string, index: number, isCustom = false) {
    const key = taskKey(group, index, isCustom), checked = checklist.includes(key);
    return <Pressable key={key} accessibilityRole="checkbox" accessibilityLabel={title} accessibilityState={{ checked }} aria-checked={checked} onPress={() => toggleChecklist(key)} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: s(16), minHeight: s(59), paddingVertical: s(10), opacity: pressed ? 0.75 : 1 })}>
      <View style={{ width: s(29), height: s(29), borderRadius: s(16), borderWidth: 1, borderColor: checked ? '#48bbae' : '#ff9b98', backgroundColor: checked ? '#48bbae' : '#fff', alignItems: 'center', justifyContent: 'center' }}>{checked ? <Text style={{ color: '#fff', fontSize: s(20) }}>✓</Text> : null}</View>
      <Text style={{ flex: 1, color: checked ? '#929b98' : '#161918', fontSize: s(13), lineHeight: s(17), textDecorationLine: checked ? 'line-through' : 'none' }}>{title}</Text>
    </Pressable>;
  }
  return <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}><View style={{ width: pageWidth, flex: 1 }}>
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: Math.max(insets.top + s(12), s(43)), paddingBottom: Math.max(insets.bottom + s(24), s(45)) }}>
      <View style={{ minHeight: s(166), paddingHorizontal: s(21) }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Басты бетке оралу" onPress={() => router.canGoBack() ? router.back() : router.replace('/home')} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', minHeight: 44, marginLeft: s(-13) }}><Text style={{ color: '#46b9ad', fontSize: s(32), marginRight: s(6) }}>‹</Text><Text style={{ color: '#46b9ad', fontSize: s(19) }}>Басты бет</Text></Pressable>
        <View pointerEvents="none" style={{ position: 'absolute', top: s(11), right: s(15) }}><Clipboard size={s(113)} /></View>
        <Text accessibilityRole="header" style={{ color: '#050706', fontSize: s(32), fontWeight: '700', lineHeight: s(37), marginTop: s(4), maxWidth: s(240) }}>{'Тапсырмалар\nтізімі'}</Text>
      </View>
      {taskGroups.map(group => {
        const open = expanded === group.id;
        return <View key={group.id} style={{ borderBottomWidth: 1, borderBottomColor: '#e3e3e3' }}>
          <Pressable accessibilityRole="button" accessibilityLabel={group.title} accessibilityState={{ expanded: open }} onPress={() => { setExpanded(open ? null : group.id); setError(''); }} style={{ minHeight: s(69), paddingHorizontal: s(21), flexDirection: 'row', alignItems: 'center', gap: s(10) }}><Text style={{ flex: 1, color: '#070908', fontSize: s(23), lineHeight: s(30) }}>{group.title}</Text><View style={{ width: s(29), height: s(29), borderRadius: s(16), backgroundColor: '#f3f3f3', alignItems: 'center', justifyContent: 'center' }}><Svg width={s(16)} height={s(16)} viewBox="0 0 20 20"><Path d={open ? 'm4 12 6-6 6 6' : 'm4 8 6 6 6-6'} stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg></View></Pressable>
          {open ? <View style={{ paddingHorizontal: s(15), paddingBottom: s(17) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: s(30), borderColor: '#ededed', borderWidth: 1, paddingLeft: s(20), paddingRight: s(16), minHeight: s(46), marginBottom: s(12) }}><TextInput accessibilityLabel={`${group.title}: Тапсырма қосу`} placeholder="Тапсырма қосу" placeholderTextColor="#b6b6b6" maxLength={160} value={drafts[group.id] || ''} onChangeText={value => { setDrafts(previous => ({ ...previous, [group.id]: value })); setError(''); }} onSubmitEditing={() => add(group.id)} returnKeyType="done" style={{ flex: 1, minHeight: 44, color: '#202b26', fontSize: s(13), paddingRight: s(10) }} /><Pressable accessibilityRole="button" accessibilityLabel={`${group.title}: Қосу`} onPress={() => add(group.id)} style={({ pressed }) => ({ width: s(31), height: s(31), minWidth: 36, minHeight: 36, borderRadius: s(22), backgroundColor: '#48bbae', alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.75 : 1 })}><Text style={{ color: '#fff', fontSize: s(29), lineHeight: s(32) }}>+</Text></Pressable></View>
            {error ? <Text accessibilityRole="alert" style={{ color: '#a95350', fontSize: 12, paddingBottom: 8 }}>{error}</Text> : null}
            {group.tasks.map((title, index) => task(group.id, title, index))}
            {custom[group.id].map((title, index) => task(group.id, title, index, true))}
          </View> : null}
        </View>;
      })}
      {expanded ? <Text accessibilityRole="status" style={{ color: '#91a19a', fontSize: s(10), textAlign: 'center', padding: s(16) }}>{syncStatus === 'saving' ? 'Сақталуда…' : syncStatus === 'error' ? 'Сақталмады. Байланысты тексеріңіз.' : 'Тапсырмалар жеке аккаунтыңызға сақталады.'}{'\n'}Қабылдаулар мен тексерулер кестесін дәрігермен келісіңіз.</Text> : null}
    </ScrollView>
  </View></View>;
}
