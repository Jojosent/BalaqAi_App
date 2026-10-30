import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, Text, View } from '../i18n/Localized';
import { useLanguage } from '../i18n/Language';
import { MainIcon } from './MainIcon';

export const mainTabs = [
  { name: 'home', title: 'Басты бет', route: '/home' },
  { name: 'community', title: 'Қауымдастық', route: '/community' },
  { name: 'shop', title: 'Дүкен', route: '/shop' },
  { name: 'account', title: 'Профиль', route: '/account' },
] as const;
export type MainTabName = typeof mainTabs[number]['name'];
export function BottomNav({ active, onSelect }: { active: string; onSelect: (name: MainTabName) => void }) {
  const { t } = useLanguage();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return <View accessibilityRole="tablist" style={{ flexDirection: 'row', alignItems: 'stretch', backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderColor: '#e2efeb', paddingHorizontal: 6, paddingTop: 8, paddingBottom: Math.max(insets.bottom, 10), gap: 2, boxShadow: '0px -3px 14px rgba(20,90,76,0.06)' }}>
    {mainTabs.map(tab => {
      const selected = tab.name === active;
      const color = selected ? '#128d7c' : '#758781';
      return <Pressable key={tab.name} accessibilityRole="tab" accessibilityLabel={tab.title} accessibilityState={{ selected }} onPress={() => onSelect(tab.name)} style={({ pressed }) => ({ flex: 1, minWidth: 0, minHeight: 66, alignItems: 'center', justifyContent: 'flex-start', paddingVertical: 7, paddingHorizontal: 2, gap: 4, borderRadius: 17, backgroundColor: selected ? '#e4f6ef' : pressed ? '#f2f8f5' : 'transparent' })}>
        <MainIcon name={tab.name} size={23} color={color} />
        <Text style={{ alignSelf: 'stretch', textAlign: 'center', flexShrink: 1, color, fontSize: width < 360 ? 10 : 11, lineHeight: 15, fontWeight: selected ? '700' : '500' }}>{t(tab.title)}</Text>
      </Pressable>;
    })}
  </View>;
}
