import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { onIdTokenChanged, signOut, type User } from 'firebase/auth';
import { auth } from '../services/firebase';
type SessionState = { user: User | null; ready: boolean; refresh: () => Promise<void>; logout: () => Promise<void> };
const Context = createContext<SessionState | null>(null);
export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<{ user: User | null; ready: boolean }>({ user: null, ready: false });
  useEffect(() => onIdTokenChanged(auth, user => setSession({ user, ready: true })), []);
  async function refresh() { if (auth.currentUser) { await auth.currentUser.reload(); await auth.currentUser.getIdToken(true); } setSession({ user: auth.currentUser, ready: true }); }
  return <Context.Provider value={{ ...session, refresh, logout: () => signOut(auth) }}>{children}</Context.Provider>;
}
export function useSession() { const value = useContext(Context); if (!value) throw new Error('SessionProvider is required'); return value; }
