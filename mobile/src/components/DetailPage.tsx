import { type PropsWithChildren } from 'react';
import { router } from 'expo-router';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Pressable } from '../i18n/Localized';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export function DetailPage({ title, children }: PropsWithChildren<{ title: string }>) {
 const insets = useSafeAreaInsets();
 return <View style={{ flex: 1, backgroundColor: '#f8fcfa', alignItems: 'center' }}><ScrollView style={{ width: '100%', maxWidth: 500 }} contentContainerStyle={{ padding: 22, paddingTop: insets.top + 28, paddingBottom: insets.bottom + 35 }} keyboardShouldPersistTaps="handled"><Pressable accessibilityRole="button" onPress={() => router.canGoBack() ? router.back() : router.replace('/account')} style={{ paddingVertical: 12 }}><Text style={{ color: '#39a99c', fontSize: 18 }}>‹ Артқа</Text></Pressable><Text accessibilityRole="header" style={{ fontSize: 29, fontWeight: '700', marginVertical: 24, color: '#183b33' }}>{title}</Text>{children}</ScrollView></View>;
}
export const detailStyles = StyleSheet.create({ card: { backgroundColor: '#fff', padding: 18, borderRadius: 20, marginBottom: 14, gap: 12 }, body: { color: '#677d74', lineHeight: 23, fontSize: 15 }, title: { color: '#234c40', fontSize: 18, fontWeight: '600' }, input: { borderWidth: 1, borderColor: '#d9e8e1', borderRadius: 18, padding: 15, fontSize: 16, color: '#234c40', backgroundColor: '#fff', marginVertical: 8 }, button: { backgroundColor: '#49b9ad', padding: 16, borderRadius: 26, alignItems: 'center', marginVertical: 8 }, label: { color: '#fff', fontWeight: '600', fontSize: 16 } });
