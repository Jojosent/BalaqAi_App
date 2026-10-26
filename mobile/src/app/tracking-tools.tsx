import { Pressable, Text, Image, View } from '../i18n/Localized';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useAuthSize } from '../components/AuthUI';

const tools = [
  { id: 'pregnancy', title: 'Жүктілікті\nбақылау', color: '#ff63ae', crop: { x: 360, y: 390, width: 340, height: 268 } },
  { id: 'movement', title: 'Сәбидің қимылын\nсанау', color: '#98d15f', crop: { x: 420, y: 800, width: 280, height: 220 } },
  { id: 'weight', title: 'Салмақты\nбақылау', color: '#f56669', crop: { x: 390, y: 1160, width: 310, height: 222 } },
  { id: 'mood', title: 'Көңіл-күйді\nбақылау', color: '#67a6ed', crop: { x: 400, y: 1520, width: 300, height: 225 } },
];

export default function TrackingToolsScreen() {
  const { s, pageWidth } = useAuthSize();
  const insets = useSafeAreaInsets();
  return <View style={{ flex: 1, backgroundColor: '#e4f5f1', alignItems: 'center' }}>
    <View style={{ width: pageWidth, flex: 1, overflow: 'hidden' }}>
      <Svg width="100%" height="100%" style={{ position: 'absolute' }}><Defs><LinearGradient id="tools-background" x1="0" y1="0" x2="0.8" y2="1"><Stop offset="0" stopColor="#fff" /><Stop offset="0.4" stopColor="#d7efea" /><Stop offset="1" stopColor="#58c1b3" /></LinearGradient></Defs><Rect width="100%" height="100%" fill="url(#tools-background)" /></Svg>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: Math.max(insets.top + s(16), s(48)), paddingBottom: Math.max(insets.bottom + s(32), s(65)) }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Басты бетке оралу" onPress={() => router.canGoBack() ? router.back() : router.replace('/home')} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(10), minHeight: 44, alignSelf: 'flex-start' }}><Text style={{ color: '#279e90', fontSize: s(29), marginRight: s(5) }}>‹</Text><Text style={{ color: '#279e90', fontSize: s(20) }}>Басты бет</Text></Pressable>
        <Text accessibilityRole="header" style={{ color: '#080c0a', fontSize: s(29), lineHeight: s(36), fontWeight: '700', marginTop: s(13), marginBottom: s(35), paddingHorizontal: s(25) }}>Бақылау құралдары</Text>
        <View style={{ paddingHorizontal: s(24), gap: s(26) }}>
          {tools.map(tool => {
            // Display the illustration region of the supplied design; labels and buttons remain native UI.
            const k = s(0.5);
            return <View key={tool.id} style={{ height: s(155), backgroundColor: tool.color, borderRadius: s(27), overflow: 'hidden', boxShadow: '0px 5px 4px rgba(0,0,0,0.22)' }}>
              <Svg width="100%" height="100%" style={{ position: 'absolute' }} viewBox="0 0 326 155"><Path d="m24 5 2 7 7 2-7 2-2 7-2-7-7-2 7-2Zm184 20 2 8 8 2-8 2-2 8-2-8-8-2 8-2ZM17 124l3 10 10 3-10 3-3 10-3-10-10-3 10-3Zm124-78 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="#fff" opacity={0.6} /></Svg>
              <View pointerEvents="none" style={{ position: 'absolute', right: 0, bottom: 0, width: tool.crop.width * k, height: tool.crop.height * k, overflow: 'hidden' }}><Image accessible={false} source={require('../../assets/images/tracking-tools-reference.png')} resizeMode="stretch" style={{ position: 'absolute', width: 750 * k, height: 1906 * k, left: -tool.crop.x * k, top: -tool.crop.y * k }} /></View>
              <Text style={{ color: '#fff', fontSize: s(20), lineHeight: s(23), fontWeight: '600', marginTop: s(19), marginLeft: s(19), maxWidth: s(245) }}>{tool.title}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel={`${tool.title.replace(/\n/g, ' ')}: Бақылау`} onPress={() => tool.id === 'pregnancy' ? router.push('/tracker') : tool.id === 'movement' ? router.push('/kick-counter') : tool.id === 'weight' ? router.push('/weight-tracker') : router.push('/mood-tracker')} style={({ pressed }) => ({ position: 'absolute', left: s(19), bottom: s(15), minHeight: 32, width: s(120), backgroundColor: '#fff', borderRadius: s(20), justifyContent: 'center', alignItems: 'center', opacity: pressed ? 0.8 : 1 })}><Text style={{ fontSize: s(16), color: '#fb69ad', fontWeight: '600' }}>Бақылау</Text></Pressable>
            </View>;
          })}
        </View>
      </ScrollView>
    </View>
  </View>;
}
