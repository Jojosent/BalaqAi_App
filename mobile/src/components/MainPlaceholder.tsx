import { Text } from '../i18n/Localized';
import { View } from 'react-native';
import { MainIcon, type MainIconName } from './MainIcon';
export function MainPlaceholder({ title, icon, body }: { title: string; icon: MainIconName; body: string }) {
  return <View style={{ flex: 1, backgroundColor: '#f8fcfa', alignItems: 'center', justifyContent: 'center', padding: 35 }}><View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: '#e0f3ec', justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}><MainIcon name={icon} size={42} color="#4eb9a8" /></View><Text accessibilityRole="header" style={{ color: '#174e49', fontSize: 27, fontWeight: '700' }}>{title}</Text><Text style={{ color: '#8a9e95', fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 13 }}>{body}</Text></View>;
}
