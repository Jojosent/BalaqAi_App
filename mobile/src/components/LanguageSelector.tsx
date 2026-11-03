import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Text, Pressable } from '../i18n/Localized';
import { languageNames, type Language } from '../i18n/core';
import { useLanguage } from '../i18n/Language';
import { PickerShell } from './ProfilePickers';

function Globe() {
 return <Svg accessible={false} width={19} height={19} viewBox="0 0 24 24" fill="none"><Circle cx={12} cy={12} r={9} stroke="#167968" strokeWidth={1.7} /><Path d="M3 12h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18Z" stroke="#167968" strokeWidth={1.5} /></Svg>;
}
export function LanguageSelector({ compact = false }: { compact?: boolean }) {
 const { language, changeLanguage, error, t } = useLanguage();
 const [open, setOpen] = useState(false);
 const keys = Object.keys(languageNames) as Language[];
 if (compact) return <>
  <View style={{ alignItems: 'flex-end', gap: 7 }}>
   <Pressable accessibilityRole="button" accessibilityLabel={t('Қолданба тілі') + ': ' + languageNames[language]} accessibilityState={{ expanded: open }} onPress={() => setOpen(true)} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 9, minHeight: 44, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: '#c9e4db', backgroundColor: pressed ? '#e4f4ee' : '#fff', boxShadow: '0px 3px 12px rgba(22,82,66,0.08)' })}>
    <Globe /><Text verbatim style={{ color: '#164d42', fontSize: 13, fontWeight: '600' }}>{languageNames[language]}</Text><Svg accessible={false} width={12} height={12} viewBox="0 0 16 16"><Path d="m4 6 4 4 4-4" fill="none" stroke="#588f80" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" /></Svg>
   </Pressable>
   {error ? <Text accessibilityRole="alert" style={{ color: '#a45050', fontSize: 12 }}>{error}</Text> : null}
  </View>
  {open ? <PickerShell title="Қолданба тілі" onClose={() => setOpen(false)}><View accessibilityRole="radiogroup" accessibilityLabel="Қолданба тілі" style={{ gap: 10 }}>
   {keys.map(key => <Pressable key={key} accessibilityRole="radio" accessibilityLabel={languageNames[key]} accessibilityState={{ checked: language === key }} onPress={() => { void changeLanguage(key); setOpen(false); }} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 66, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: language === key ? '#49b9ad' : '#e1ece7', backgroundColor: language === key ? '#eaf7f1' : pressed ? '#f2f7f4' : '#fff' })}>
    <View style={{ width: 37, height: 37, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}><Text verbatim style={{ color: '#348d7b', fontSize: 11, fontWeight: '700' }}>{key === 'kk' ? 'KZ' : key.toUpperCase()}</Text></View>
    <Text verbatim style={{ flex: 1, color: '#164d42', fontWeight: '600', fontSize: 16 }}>{languageNames[key]}</Text><View style={{ width: 23, height: 23, borderRadius: 12, borderWidth: 1.5, borderColor: language === key ? '#269b84' : '#c8d9d2', alignItems: 'center', justifyContent: 'center', backgroundColor: language === key ? '#269b84' : '#fff' }}>{language === key ? <Text style={{ color: '#fff', fontSize: 15 }}>✓</Text> : null}</View>
   </Pressable>)}
  </View></PickerShell> : null}
 </>;
 return <View style={{ backgroundColor: '#fff', padding: 17, borderRadius: 20, marginTop: 14, gap: 12 }}><Text style={{ fontWeight: '600', fontSize: 17 }}>Қолданба тілі</Text><View accessibilityRole="radiogroup" accessibilityLabel="Қолданба тілі" style={{ flexDirection: 'row', gap: 7 }}>{keys.map(key => <Pressable key={key} accessibilityRole="radio" accessibilityLabel={languageNames[key]} accessibilityState={{ checked: language === key }} onPress={() => void changeLanguage(key)} style={{ flex: 1, backgroundColor: key === language ? '#49b9ad' : '#edf6f2', minHeight: 44, justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 3, borderRadius: 20, alignItems: 'center' }}><Text verbatim style={{ textAlign: 'center', flexShrink: 1, color: key === language ? '#fff' : '#3c7565', fontSize: 13 }}>{languageNames[key]}</Text></Pressable>)}</View>{error ? <Text accessibilityRole="alert" style={{ color: '#a45050' }}>{error}</Text> : null}</View>;
}
