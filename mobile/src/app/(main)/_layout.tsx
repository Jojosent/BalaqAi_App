import { useLanguage } from '../../i18n/Language';
import { Tabs } from 'expo-router/js-tabs';
import { View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainIcon, type MainIconName } from '../../components/MainIcon';

export const unstable_settings = { initialRouteName: 'home' };

export default function MainLayout() {
  const { t } = useLanguage();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#eff5f2' }}><View style={{ flex: 1, width: Math.min(width, 500) }}>
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#42bdae', tabBarInactiveTintColor: '#a0a5a2', tabBarLabelStyle: { fontSize: 10, fontWeight: '500' }, tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#e7e7e7', height: 63 + Math.max(insets.bottom, 8), paddingTop: 8, paddingBottom: Math.max(insets.bottom, 8) }, sceneStyle: { backgroundColor: '#fff' } }}>
      {([{ name: 'home', title: 'Басты бет' }, { name: 'community', title: 'Қауымдастық' }, { name: 'shop', title: 'Дүкен' }, { name: 'account', title: 'Профиль' }] as const).map(tab => <Tabs.Screen key={tab.name} name={tab.name} options={{ title: t(tab.title), ...(tab.name === 'account' ? { tabBarActiveTintColor: '#ff7079' } : {}), tabBarIcon: ({ color, size }) => <MainIcon name={tab.name as MainIconName} color={typeof color === 'string' ? color : '#a0a5a2'} size={size} /> }} />)}
    </Tabs>
  </View></View>;
}
