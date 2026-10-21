import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { loadUserData, saveUserData, type SavedData } from '../services/api';
import { keyToInput, type PregnancyDraft } from '../utils/pregnancy';
import { useSession } from './Session';
export type LifeStage = 'pregnant' | 'planning' | 'postpartum';
const empty: SavedData = { profile: { name: '', birthday: '', city: '' }, stage: null, pregnancyStart: null, pregnancyNotes: { doctor: '', notes: '' }, checklist: [], trackingFolate: false };
type State = SavedData & {
  setProfile: (value: SavedData['profile']) => void; setStage: (value: LifeStage) => void;
  setPregnancyStart: (value: string) => void; setPregnancyNotes: (value: SavedData['pregnancyNotes']) => void;
  toggleChecklist: (id: string) => void; setTrackingFolate: (value: boolean) => void;
  pregnancyDraft: PregnancyDraft; setPregnancyDraft: (value: PregnancyDraft) => void;
  intent: 'register' | 'login'; setIntent: (value: 'register' | 'login') => void;
  dataReady: boolean; syncStatus: 'loading' | 'saved' | 'saving' | 'error'; syncError: string;
  saveNow: () => Promise<void>; reloadData: () => Promise<void>;
};
const Context = createContext<State | null>(null);
export function AuthFlowProvider({ children }: PropsWithChildren) {
  const { user, verified } = useSession();
  const [data, setData] = useState<SavedData>(empty);
  const [dataReady, setDataReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<State['syncStatus']>('loading');
  const [syncError, setSyncError] = useState('');
  const [intent, setIntent] = useState<'register' | 'login'>('register');
  const [pregnancyDraft, setPregnancyDraft] = useState<PregnancyDraft>({ method: 'lmp', lmp: '', weeks: '', days: '' });
  const lastSaved = useRef('');
  const current = useRef(data);
  useEffect(() => { current.current = data; }, [data]);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const reloadData = useCallback(async () => {
    if (!user || !verified) return;
    setSyncStatus('loading'); setSyncError('');
    try {
      const stored = await loadUserData();
      if (!mounted.current) return;
      const loaded = stored || { ...empty, profile: { ...empty.profile, name: user.displayName || '' } };
      setData(loaded); current.current = loaded; lastSaved.current = JSON.stringify(loaded);
      if (loaded.pregnancyStart) setPregnancyDraft({ method: 'lmp', lmp: keyToInput(loaded.pregnancyStart), weeks: '', days: '' });
      setDataReady(true); setSyncStatus('saved');
    } catch (reason) { console.warn('Profile load failed:', reason instanceof Error ? reason.message : 'unknown'); if (mounted.current) { setSyncStatus('error'); setSyncError('Деректер жүктелмеді. Интернет байланысын тексеріп, қайталаңыз.'); } }
  }, [user, verified]);
  useEffect(() => { const task = setTimeout(() => { void reloadData(); }, 0); return () => clearTimeout(task); }, [reloadData]);
  const saveNow = useCallback(async () => {
    if (!user || !verified || !dataReady) return;
    const snapshot = current.current;
    const serialized = JSON.stringify(snapshot);
    if (serialized === lastSaved.current) return;
    setSyncStatus('saving'); setSyncError('');
    const work = queue.current.catch(() => {}).then(async () => {
      await saveUserData(snapshot, user.uid);
      lastSaved.current = serialized;
      if (mounted.current && JSON.stringify(current.current) === serialized) setSyncStatus('saved');
    });
    queue.current = work;
    try { await work; }
    catch { if (mounted.current) { setSyncStatus('error'); setSyncError('Өзгерістер сақталмады. Байланысты тексеріп, қайта сақтаңыз.'); } throw new Error('Өзгерістер сақталмады.'); }
  }, [user, verified, dataReady]);
  useEffect(() => {
    if (!dataReady || JSON.stringify(data) === lastSaved.current) return;
    const timer = setTimeout(() => { void saveNow().catch(() => {}); }, 450);
    return () => clearTimeout(timer);
  }, [data, dataReady, saveNow]);
  const value = useMemo<State>(() => ({ ...data, intent, setIntent, pregnancyDraft, setPregnancyDraft, dataReady, syncStatus, syncError, reloadData, saveNow,
    setProfile: profile => setData(previous => ({ ...previous, profile })),
    setStage: stage => setData(previous => ({ ...previous, stage })),
    setPregnancyStart: pregnancyStart => setData(previous => ({ ...previous, pregnancyStart })),
    setPregnancyNotes: pregnancyNotes => setData(previous => ({ ...previous, pregnancyNotes })),
    setTrackingFolate: trackingFolate => setData(previous => ({ ...previous, trackingFolate })),
    toggleChecklist: id => setData(previous => ({ ...previous, checklist: previous.checklist.includes(id) ? previous.checklist.filter(item => item !== id) : [...previous.checklist, id] })),
  }), [data, intent, pregnancyDraft, dataReady, syncStatus, syncError, reloadData, saveNow]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAuthFlow() { const value = useContext(Context); if (!value) throw new Error('AuthFlowProvider is required'); return value; }
