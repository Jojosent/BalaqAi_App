import { cityLocations } from '../data/cityLocations';
import { Pressable, Text, TextInput, View } from '../i18n/Localized';
import { useLanguage } from '../i18n/Language';
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet } from 'react-native';
import { PrimaryButton, colors } from './AuthUI';

const months = ['Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым', 'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан'];
const cities = cityLocations.map(location => location.city);

export function formatBirthday(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('.');
}

export function validBirthday(text: string) {
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(text)) return false;
  const [day, month, year] = text.split('.').map(Number);
  const value = new Date(year, month - 1, day);
  const today = new Date();
  return year >= 1900 && year <= today.getFullYear() && value.getFullYear() === year && value.getMonth() === month - 1 && value.getDate() === day && value <= today;
}

export function PickerShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <Modal transparent animationType="fade" onRequestClose={onClose}><View style={styles.scrim}>
    <Pressable accessibilityLabel="Жабу" style={StyleSheet.absoluteFill} onPress={onClose} />
    <View accessibilityViewIsModal style={styles.sheet}>
      <View style={styles.header}><Text accessibilityRole="header" style={styles.title}>{title}</Text><Pressable accessibilityRole="button" accessibilityLabel="Жабу" onPress={onClose} style={styles.close}><Text style={{ fontSize: 25, color: colors.muted }}>×</Text></Pressable></View>
      {children}
    </View>
  </View></Modal>;
}

export function BirthdayPicker({ value, onSelect, onClose }: { value: string; onSelect: (value: string) => void; onClose: () => void }) {
  return <DatePicker value={value} onSelect={onSelect} onClose={onClose} />;
}

export function DatePicker({ value, onSelect, onClose, title = 'Туған күніңіз', minYear = 1900, defaultValue = '01.01.2000', isValid = validBirthday }: { value: string; onSelect: (value: string) => void; onClose: () => void; title?: string; minYear?: number; defaultValue?: string; isValid?: (value: string) => boolean }) {
  const initial = isValid(value) ? value.split('.').map(Number) : defaultValue.split('.').map(Number);
  const [day, setDay] = useState(initial[0]);
  const [month, setMonth] = useState(initial[1]);
  const [year, setYear] = useState(initial[2]);
  const [currentYear] = useState(() => new Date().getFullYear());
  const days = new Date(year, month, 0).getDate();
  const selectedDay = Math.min(day, days);
  const selected = `${String(selectedDay).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;
  const column = (label: string, values: { value: number; label: string }[], chosen: number, choose: (value: number) => void) => <View style={{ flex: 1, minWidth: 0 }}>
    <Text style={styles.columnLabel}>{label}</Text>
    <ScrollView style={{ height: 230 }} showsVerticalScrollIndicator nestedScrollEnabled>
      {values.map(item => <Pressable key={item.value} accessibilityRole="button" accessibilityLabel={`${label}: ${item.label}`} accessibilityState={{ selected: chosen === item.value }} onPress={() => choose(item.value)} style={[styles.option, chosen === item.value && styles.selected]}><Text style={{ fontSize: 14, color: chosen === item.value ? colors.dark : colors.muted, fontWeight: chosen === item.value ? '700' : '400' }}>{item.label}</Text></Pressable>)}
    </ScrollView>
  </View>;
  return <PickerShell title={title} onClose={onClose}>
    <Text style={styles.preview}>{selected}</Text>
    <View style={{ flexDirection: 'row', gap: 5, marginBottom: 20 }}>
      {column('Күн', Array.from({ length: days }, (_, i) => ({ value: i + 1, label: String(i + 1) })), selectedDay, setDay)}
      {column('Ай', months.map((label, i) => ({ value: i + 1, label })), month, setMonth)}
      {column('Жыл', Array.from({ length: currentYear - minYear + 1 }, (_, i) => ({ value: currentYear - i, label: String(currentYear - i) })), year, setYear)}
    </View>
    <PrimaryButton title="Таңдау" disabled={!isValid(selected)} onPress={() => onSelect(selected)} />
  </PickerShell>;
}

export function CityPicker({ onSelect, onClose }: { onSelect: (city: string) => void; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const { t } = useLanguage();
  const query = search.trim();
  const filtered = cities.filter(city => `${city} ${t(city)} ${cityLocations.find(location => location.city === city)?.aliases.join(' ')}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  return <PickerShell title="Қалаңызды таңдаңыз" onClose={onClose}>
    <TextInput accessibilityLabel="Қаланы іздеу" placeholder="Қаланы іздеу" value={search} onChangeText={setSearch} maxLength={80} autoCapitalize="words" style={styles.search} placeholderTextColor="#8da7a1" />
    <ScrollView style={{ maxHeight: 320 }} keyboardShouldPersistTaps="handled">
      {filtered.map(city => <Pressable key={city} accessibilityRole="button" onPress={() => onSelect(city)} style={styles.city}><Text style={{ color: colors.dark, fontSize: 16 }}>{city}</Text><Text style={{ color: colors.teal }}>›</Text></Pressable>)}

      {!filtered.length ? <Text style={styles.columnLabel}>Ештеңе табылмады</Text> : null}
    </ScrollView>
  </PickerShell>;
}

const styles = StyleSheet.create({
  scrim: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: 'rgba(14,60,55,0.35)' },
  sheet: { backgroundColor: '#f8fcfa', padding: 24, borderRadius: 28, width: '100%', maxWidth: 390, maxHeight: '90%' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12 },
  title: { color: colors.dark, fontSize: 21, fontWeight: '700', flexShrink: 1 },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  preview: { textAlign: 'center', color: colors.dark, fontSize: 20, marginBottom: 14, fontWeight: '600' },
  columnLabel: { color: colors.muted, textAlign: 'center', marginBottom: 10, fontSize: 12 },
  option: { paddingVertical: 12, paddingHorizontal: 2, alignItems: 'center', borderRadius: 12, minHeight: 44 },
  selected: { backgroundColor: '#d9f1e9' },
  search: { backgroundColor: '#eaf4ef', borderRadius: 16, padding: 14, color: colors.dark, fontSize: 16, marginBottom: 12, outlineWidth: 0 },
  city: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, gap: 10, borderBottomWidth: 1, borderBottomColor: '#e1ede7' },
});
