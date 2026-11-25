import { useState } from 'react';
import { Pressable, Text, View } from '../i18n/Localized';
import { RosieAnimation } from './RosieAnimation';
import { PickerShell } from './ProfilePickers';
import { PrimaryButton } from './AuthUI';
export function HydrationReminder({ scale: s }: { scale: (value: number) => number }) {
 const [open, setOpen] = useState(false);
 return <>
  <Pressable accessibilityRole="button" accessibilityLabel="Су ішуді ұмытпаңыз" onPress={() => setOpen(true)} style={({ pressed }) => ({ position: 'absolute', right: s(5), bottom: s(-24), width: s(56), height: s(56), minWidth: 48, minHeight: 48, borderRadius: s(30), backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#53c6b7', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 4px 10px rgba(35,120,103,0.12)', opacity: pressed ? 0.75 : 1 })}>
   <View pointerEvents="none"><RosieAnimation kind="water" width={s(40)} height={s(44)} label="Су тамшысы" /></View>
  </Pressable>
  {open ? <PickerShell title="Су ішуді ұмытпаңыз" onClose={() => setOpen(false)}><View style={{ alignItems: 'center', marginVertical: 12 }}><RosieAnimation kind="water" width={100} height={110} label="Су тамшысы" /></View><Text style={{ color: '#386b5e', fontSize: 16, lineHeight: 25, textAlign: 'center', marginBottom: 24 }}>Өзіңізге кішкене үзіліс жасап, су ішуді есіңізге түсіріңіз.</Text><PrimaryButton title="Түсінікті" onPress={() => setOpen(false)} /></PickerShell> : null}
 </>;
}
