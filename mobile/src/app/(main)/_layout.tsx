import { useLanguage } from '../../i18n/Language';
import { Tabs } from 'expo-router/js-tabs';
import { View, useWindowDimensions } from 'react-native';
import { BottomNav, mainTabs } from '../../components/BottomNav';

export const unstable_settings = { initialRouteName: 'home' };
export default function MainLayout() {
  const { t } = useLanguage();
  const { width } = useWindowDimensions();
  return <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#eff5f2' }}><View style={{ flex: 1, width: Math.min(width, 500) }}>
    <Tabs screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: '#fff' } }} tabBar={({ state, emitter, navigateToTab }) => <BottomNav active={state.routes[state.index].name} onSelect={name => {
      const route = state.routes.find(item => item.name === name);
      if (!route) return;
      const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!event.defaultPrevented && state.routes[state.index].name !== name) navigateToTab(route.key);
    }} />}>
      {mainTabs.map(tab => <Tabs.Screen key={tab.name} name={tab.name} options={{ title: t(tab.title) }} />)}
    </Tabs>
  </View></View>;
}
