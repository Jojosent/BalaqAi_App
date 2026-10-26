import { View } from 'react-native';
import { Text, Pressable } from '../i18n/Localized';
import { languageNames } from '../i18n/core';
import { useLanguage } from '../i18n/Language';
export function LanguageSelector() {
 const { language, changeLanguage, error } = useLanguage();
 return <View style={{ backgroundColor: '#fff', padding: 17, borderRadius: 20, marginTop: 14, gap: 12 }}><Text style={{ fontWeight: '600', fontSize: 17 }}>Қолданба тілі</Text><View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: 7 }}>{(Object.keys(languageNames) as (keyof typeof languageNames)[]).map(key => <Pressable key={key} accessibilityRole="radio" accessibilityState={{ checked: language === key }} onPress={() => void changeLanguage(key)} style={{ flex: 1, backgroundColor: key === language ? '#49b9ad' : '#edf6f2', paddingVertical: 12, borderRadius: 20, alignItems: 'center' }}><Text verbatim style={{ color: key === language ? '#fff' : '#3c7565', fontSize: 13 }}>{languageNames[key]}</Text></Pressable>)}</View>{error ? <Text accessibilityRole="alert" style={{ color: '#a45050' }}>{error}</Text> : null}</View>;
}
