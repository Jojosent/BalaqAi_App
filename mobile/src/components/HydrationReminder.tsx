import { useState } from 'react';
import { Pressable, Text, View } from '../i18n/Localized';
import { RosieAnimation } from './RosieAnimation';
import { PickerShell } from './ProfilePickers';
import { PrimaryButton } from './AuthUI';
export function HydrationReminder({ scale: s }: { scale: (value: number) => number }) {
 const [open, setOpen] = useState(false);
 return <>
  <Pressable accessibilityRole="button" accessibilityLabel="Су ішуді ұмытпаңыз" onPress={() => setOpen(true)} style={({ pressed }) => ({ width: '100%', marginTop: s(12), paddingVertical: s(12), paddingHorizontal: s(15), minHeight: s(82), borderRadius: s(22), backgroundColor: pressed ? '#d7f2ed' : '#eafaf7', borderWidth: 1, borderColor: '#b8e5dd', flexDirection: 'row', alignItems: 'center', gap: s(14), boxShadow: '0px 3px 10px rgba(35,120,103,0.06)' })}>
   <View pointerEvents="none" style={{ width: s(56), height: s(60), borderRadius: s(19), backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}><RosieAnimation kind="water" width={s(43)} height={s(51)} label="Су тамшысы" /></View>
   <Text style={{ flex: 1, color: '#197e70', fontSize: s(15), lineHeight: s(21), fontWeight: '700' }}>Су ішуді ұмытпаңыз</Text>
   <View style={{ width: 29, height: 29, borderRadius: 15, backgroundColor: '#d1eee7', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#197e70', fontSize: 22 }}>›</Text></View>
  </Pressable>
  {open ? <PickerShell title="Су ішуді ұмытпаңыз" onClose={() => setOpen(false)}><View style={{ alignItems: 'center', marginVertical: 12 }}><RosieAnimation kind="water" width={100} height={110} label="Су тамшысы" /></View><Text style={{ color: '#386b5e', fontSize: 16, lineHeight: 25, textAlign: 'center', marginBottom: 24 }}>Өзіңізге кішкене үзіліс жасап, су ішуді есіңізге түсіріңіз.</Text><PrimaryButton title="Түсінікті" onPress={() => setOpen(false)} /></PickerShell> : null}
 </>;
}
