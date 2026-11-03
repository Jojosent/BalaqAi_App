import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/privateState';
import { useSession } from '../components/Session';
import { type Language, setCurrentLanguage, translate } from './core';
import { createLanguagePreferences } from './languagePreferences';
const Context = createContext({ language: 'kk' as Language, changeLanguage: async (_: Language) => {}, error: '', t: translate });
export function LanguageProvider({ children }: PropsWithChildren) {
 const { user, ready } = useSession();
 const uid = user?.uid || null;
 const [language, setLanguage] = useState<Language>('kk');
 const [error, setError] = useState('');
 const revision = useRef(0);
 const [preferences] = useState(() => createLanguagePreferences(AsyncStorage,
  async account => (await getDoc(doc(db, 'users', account, 'settings', 'preferences'))).data()?.language,
  (account, next) => setDoc(doc(db, 'users', account, 'settings', 'preferences'), { language: next }, { merge: true })));
 useEffect(() => {
  if (!ready) return;
  let live = true;
  const version = revision.current;
  const isCurrent = () => live && version === revision.current;
  void preferences.load(uid, next => { setCurrentLanguage(next); setLanguage(next); setError(''); }, isCurrent)
   .catch(() => { if (isCurrent()) setError('Тіл параметрі жүктелмеді. Қайта таңдаңыз.'); });
  return () => { live = false; };
 }, [uid, ready, preferences]);
 async function changeLanguage(next: Language) {
  const version = ++revision.current;
  setCurrentLanguage(next); setLanguage(next); setError('');
  try { await preferences.select(uid, next); }
  catch { if (version === revision.current) setError('Тіл сақталмады. Қайта таңдаңыз.'); }
 }
 return <Context.Provider value={{ language, changeLanguage, error, t: text => translate(text, language) }}>{children}</Context.Provider>;
}
export const useLanguage = () => useContext(Context);
