import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { AuthScreen, colors, PrimaryButton, useAuthSize } from '../components/AuthUI';
import { useAuthFlow } from '../components/AuthFlow';
import { BirthdayPicker, CityPicker, formatBirthday, validBirthday } from '../components/ProfilePickers';

function FieldIcon({ type, size }: { type: 'name' | 'date' | 'city'; size: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d={type === 'name' ? 'M4 21v-3c0-6 16-6 16 0v3M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z' : type === 'date' ? 'M4 5h16v16H4V5Zm0 5h16M8 3v5m8-5v5M8 13h1m3 0h1m3 0h1m-9 4h1m3 0h1m3 0h1' : 'M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z'} stroke="#42b4a4" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />{type === 'city' ? <Circle cx="12" cy="10" r="2" stroke="#42b4a4" strokeWidth={2} /> : null}</Svg>;
}

export default function ProfileScreen() {
  const { s } = useAuthSize();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isEditing = mode === 'edit';
  const { profile: storedProfile, setProfile: saveProfile } = useAuthFlow();
  const [editProfile, setEditProfile] = useState(() => storedProfile);
  const profile = editProfile;
  const setProfile = setEditProfile;
  const [picker, setPicker] = useState<'birthday' | 'city' | null>(null);
  const [errors, setErrors] = useState<{ name?: string; birthday?: string; city?: string }>({});
  function update(field: keyof typeof profile, value: string) {
    setProfile({ ...profile, [field]: value });
    setErrors(previous => ({ ...previous, [field]: undefined }));
  }
  function next() {
    const nextErrors: typeof errors = {};
    if ((profile.name.match(/\p{L}/gu) || []).length < 2) nextErrors.name = 'Атыңызды енгізіңіз.';
    if (!validBirthday(profile.birthday)) nextErrors.birthday = 'Дұрыс туған күніңізді енгізіңіз.';
    if (profile.city.trim().length < 2) nextErrors.city = 'Қалаңызды таңдаңыз.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    Keyboard.dismiss();
    saveProfile({ ...profile, name: profile.name.trim().replace(/\s+/g, ' '), city: profile.city.trim() });
    if (isEditing) { if (router.canGoBack()) router.back(); else router.replace('/account'); }
    else router.push('/stage');
  }
  const fieldStyle = (error?: string) => [styles.field, { borderRadius: s(32), minHeight: s(55), paddingHorizontal: s(16), gap: s(12), borderColor: error ? '#c96961' : 'transparent' }];
  const icon = (type: 'name' | 'date' | 'city') => <View style={{ backgroundColor: '#dff3ed', borderRadius: s(20), width: s(34), height: s(34), alignItems: 'center', justifyContent: 'center' }}><FieldIcon type={type} size={s(21)} /></View>;
  const labelStyle = [styles.label, { fontSize: s(11), marginBottom: s(3) }];
  const inputStyle = [styles.input, { fontSize: s(14), lineHeight: s(21) }];
  const openPicker = (name: 'birthday' | 'city') => { Keyboard.dismiss(); setPicker(name); };

  return <AuthScreen>
    <View style={{ alignItems: 'center', paddingTop: s(108), paddingHorizontal: s(30) }}>
      <Image source={require('../../assets/images/girl1.png')} resizeMode="contain" accessibilityLabel="Ұлттық киім киген қыз" style={{ width: s(144), height: s(191) }} />
      <Text accessibilityRole="header" style={[styles.title, { fontSize: s(31), lineHeight: s(40), marginTop: s(4) }]}>{isEditing ? 'Жеке ақпарат' : 'Танысайық'}</Text>
      <Text style={[styles.subtitle, { fontSize: s(14), lineHeight: s(20), marginTop: s(4), marginBottom: s(13) }]}>Жеке мәліметтеріңізді енгізіңіз.</Text>
      <View style={{ width: '100%', gap: s(11) }}>
        <View><View style={fieldStyle(errors.name)}>{icon('name')}<View style={{ flex: 1 }}><Text style={labelStyle}>Аты</Text><TextInput accessibilityLabel="Аты" placeholder="Атыңызды енгізіңіз" placeholderTextColor="#a3b4b4" style={inputStyle} value={profile.name} onChangeText={text => update('name', text)} autoComplete="given-name" textContentType="givenName" autoCapitalize="words" maxLength={80} returnKeyType="next" onSubmitEditing={() => openPicker('birthday')} /></View></View>{errors.name ? <Text accessibilityRole="alert" style={styles.error}>{errors.name}</Text> : null}</View>
        <View><View style={fieldStyle(errors.birthday)}>{icon('date')}<View style={{ flex: 1 }}><Text style={labelStyle}>Туған күніңіз</Text><TextInput accessibilityLabel="Туған күніңіз" placeholder="Күні. Айы. Жылы" placeholderTextColor="#a3b4b4" style={inputStyle} value={profile.birthday} onChangeText={text => update('birthday', formatBirthday(text))} inputMode="numeric" keyboardType="number-pad" maxLength={10} /></View><Pressable accessibilityRole="button" accessibilityLabel="Туған күнді таңдау" onPress={() => openPicker('birthday')} style={styles.iconButton}><FieldIcon type="date" size={s(21)} /></Pressable></View>{errors.birthday ? <Text accessibilityRole="alert" style={styles.error}>{errors.birthday}</Text> : null}</View>
        <View><Pressable accessibilityRole="button" accessibilityLabel={`Қала: ${profile.city || 'Қалаңызды таңдаңыз'}`} onPress={() => openPicker('city')} style={fieldStyle(errors.city)}>{icon('city')}<View style={{ flex: 1 }}><Text style={labelStyle}>Қала</Text><Text style={[inputStyle, { color: profile.city ? colors.dark : '#a3b4b4' }]}>{profile.city || 'Қалаңызды таңдаңыз'}</Text></View><Text style={{ color: '#8aa8a1', fontSize: s(22), marginRight: s(6) }}>⌄</Text></Pressable>{errors.city ? <Text accessibilityRole="alert" style={styles.error}>{errors.city}</Text> : null}</View>
      </View>
      <View style={{ width: '100%', marginTop: s(16), paddingHorizontal: s(5) }}><PrimaryButton title={isEditing ? 'Сақтау' : 'Жалғастыру'} scale={s(1)} onPress={next} /></View>
      <Text style={{ color: '#6c9187', fontSize: s(10), textAlign: 'center', marginTop: s(14) }}>Мәліметтер жеке аккаунтыңызға сақталады</Text>
    </View>
    {picker === 'birthday' ? <BirthdayPicker value={profile.birthday} onClose={() => setPicker(null)} onSelect={value => { update('birthday', value); setPicker(null); }} /> : null}
    {picker === 'city' ? <CityPicker onClose={() => setPicker(null)} onSelect={value => { update('city', value); setPicker(null); }} /> : null}
  </AuthScreen>;
}

const styles = StyleSheet.create({
  title: { color: '#003f39', textAlign: 'center', fontWeight: '800' },
  subtitle: { color: '#7c9292', textAlign: 'center' },
  field: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingVertical: 8, width: '100%', borderWidth: 1, boxShadow: '0px 5px 14px rgba(38,99,87,0.08)' },
  label: { color: '#819595' },
  input: { color: colors.dark, padding: 0, outlineWidth: 0, minWidth: 0 },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#ac4e45', fontSize: 12, paddingTop: 6, paddingHorizontal: 12 },
});

