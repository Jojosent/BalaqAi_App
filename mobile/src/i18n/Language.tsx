import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/privateState';
import { useSession } from '../components/Session';
import { type Language, setCurrentLanguage, translate } from './core';
const Context = createContext({ language: 'kk' as Language, changeLanguage: async (_: Language) => {}, error: '', t: translate });
const valid = (value: unknown): value is Language => ['kk', 'ru', 'en'].includes(String(value));
export function LanguageProvider({ children }: PropsWithChildren) {
 const { user } = useSession();
 const [language, setLanguage] = useState<Language>('kk');
 const [error, setError] = useState('');
 const revision = useRef(0);
 useEffect(() => { let live = true; const version = revision.current;
  void (async () => {
   const local = await AsyncStorage.getItem(`balaqai.language.${user?.uid || 'guest'}`);
   if (live && version === revision.current) { const next = valid(local) ? local : 'kk'; setCurrentLanguage(next); setLanguage(next); }
   if (user) { const stored = await getDoc(doc(db, 'users', user.uid, 'settings', 'preferences')); const remote = stored.data()?.language;
    if (live && version === revision.current && valid(remote)) { setCurrentLanguage(remote); setLanguage(remote); await AsyncStorage.setItem(`balaqai.language.${user.uid}`, remote); }
   }
  })().catch(() => { if (live) setError('Тіл параметрі жүктелмеді. Қайта таңдаңыз.'); });
  return () => { live = false; };
 }, [user?.uid, user]);
 async function changeLanguage(next: Language) {
  revision.current++; setCurrentLanguage(next); setLanguage(next); setError('');
  try { await AsyncStorage.setItem(`balaqai.language.${user?.uid || 'guest'}`, next); if (user) await setDoc(doc(db, 'users', user.uid, 'settings', 'preferences'), { language: next }); }
  catch { setError('Тіл сақталмады. Қайта таңдаңыз.'); }
 }
 return <Context.Provider value={{ language, changeLanguage, error, t: text => translate(text, language) }}>{children}</Context.Provider>;
}
export const useLanguage = () => useContext(Context);
