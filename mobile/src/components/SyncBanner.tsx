import { Pressable, Text } from '../i18n/Localized';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthFlow } from './AuthFlow';
export function SyncBanner() {
  const { dataReady, syncStatus, syncError, saveNow } = useAuthFlow();
  const insets = useSafeAreaInsets();
  if (!dataReady || syncStatus !== 'error') return null;
  return <View style={{ position: 'absolute', top: insets.top + 8, left: 12, right: 12, borderRadius: 16, padding: 12, backgroundColor: '#fff2df', flexDirection: 'row', alignItems: 'center', gap: 12 }}><Text accessibilityRole="alert" style={{ flex: 1, fontSize: 12, color: '#855e3c' }}>{syncError}</Text><Pressable accessibilityRole="button" onPress={() => void saveNow().catch(() => {})} style={{ padding: 8 }}><Text style={{ color: '#288f7f' }}>Қайталау</Text></Pressable></View>;
}
