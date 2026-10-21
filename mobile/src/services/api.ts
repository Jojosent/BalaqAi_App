import { auth } from './firebase';
export type SavedData = { profile: { name: string; birthday: string; city: string }; stage: 'pregnant' | 'planning' | 'postpartum' | null; pregnancyStart: string | null; pregnancyNotes: { doctor: string; notes: string }; checklist: string[]; trackingFolate: boolean };
const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';
async function request(method: 'GET' | 'PUT', data?: SavedData, expectedUid?: string) {
  const user = auth.currentUser;
  if (!user || (expectedUid && expectedUid !== user.uid)) throw new Error('Аккаунтқа кіріңіз.');
  // Verification can change outside the app; refresh claims before initial hydration.
  const token = await user.getIdToken(method === 'GET');
  const response = await fetch(`${baseUrl}/v1/me`, { method, headers: { Authorization: `Bearer ${token}`, ...(data ? { 'Content-Type': 'application/json' } : {}) }, body: data ? JSON.stringify(data) : undefined, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(response.status === 401 ? 'Сессия аяқталды. Қайта кіріңіз.' : response.status === 403 ? 'Email мекенжайын растаңыз.' : 'Серверге қосылмады. Деректер әлі сақталмады.');
  return response.json();
}
export async function loadUserData(): Promise<SavedData | null> { return (await request('GET')).data; }
export async function saveUserData(data: SavedData, expectedUid: string): Promise<void> { await request('PUT', data, expectedUid); }
