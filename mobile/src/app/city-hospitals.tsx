import { useState } from 'react';
import { Linking, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, Text, View } from '../i18n/Localized';
import { useAuthFlow } from '../components/AuthFlow';
import { useAuthSize } from '../components/AuthUI';
import { AddressPin } from '../components/AddressPin';
import { getCityLocation } from '../data/cityLocations';
import { hospitalMapUrl } from '../utils/hospitals';

export default function CityHospitalsScreen() {
  const { profile } = useAuthFlow();
  const location = getCityLocation(profile.city);
  const { s, pageWidth } = useAuthSize();
  const insets = useSafeAreaInsets();
  const [error, setError] = useState('');
  return <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#f2f8f4' }}><ScrollView style={{ width: pageWidth }} contentContainerStyle={{ padding: s(22), paddingTop: Math.max(insets.top + 12, 28), paddingBottom: Math.max(insets.bottom + 22, 35) }}>
    <Pressable accessibilityRole="button" accessibilityLabel="Артқа" onPress={() => router.canGoBack() ? router.back() : router.replace('/tasks')} style={{ alignSelf: 'flex-start', padding: 12, marginLeft: -12, minHeight: 44 }}><Text style={{ color: '#168e7c', fontSize: 18 }}>‹ Артқа</Text></Pressable>
    <Text accessibilityRole="header" style={{ fontSize: s(27), lineHeight: s(34), color: '#173e35', fontWeight: '700', marginVertical: 20 }}>Қалаңыздағы емханалар</Text>
    {location ? <><Text style={{ fontSize: 20, color: '#168e7c', marginBottom: 12 }}>{location.city}</Text><Text style={{ fontSize: 14, lineHeight: 22, color: '#6a8075', marginBottom: 22 }}>Мекенжайды таңдаңыз — картада ашылады. Қабылдау мен қажетті қызметтің бар-жоғын алдын ала нақтылаңыз.</Text>
      {location.addresses.map(address => <Pressable key={address} accessibilityRole="link" accessibilityLabel={address} onPress={() => { setError(''); void Linking.openURL(hospitalMapUrl(address)).catch(() => setError('Сілтеме ашылмады. Қайта көріңіз.')); }} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20, minHeight: 90, backgroundColor: '#fff', borderRadius: 22, marginBottom: 14, borderWidth: 1, borderColor: '#d4eae1', opacity: pressed ? 0.7 : 1 })}><AddressPin /><View style={{ flex: 1, minWidth: 0 }}><Text verbatim style={{ fontSize: 15, lineHeight: 23, color: '#234e42' }}>{address}</Text><Text style={{ marginTop: 8, color: '#168e7c', fontSize: 12 }}>Картада ашу ↗</Text></View></Pressable>)}
    </> : <><Text style={{ fontSize: 16, lineHeight: 24, color: '#657d72', marginBottom: 22 }}>Мекенжайларды көру үшін профиліңізде қалаңызды таңдаңыз.</Text><Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/profile', params: { mode: 'edit' } })} style={{ backgroundColor: '#168e7c', padding: 18, borderRadius: 22 }}><Text style={{ color: '#fff', textAlign: 'center', fontSize: 16 }}>Қалаңызды таңдаңыз</Text></Pressable></>}
    {error ? <Text accessibilityRole="alert" style={{ color: '#a64b4b', marginTop: 16 }}>{error}</Text> : null}
  </ScrollView></View>;
}
