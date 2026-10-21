import AsyncStorage from '@react-native-async-storage/async-storage';
// Metro selects Firebase's native export; the default web typings omit this helper.
// @ts-expect-error Firebase React Native-only export.
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { firebaseApp } from './firebaseApp';
function nativeAuth() {
  try { return initializeAuth(firebaseApp, { persistence: getReactNativePersistence(AsyncStorage) }); }
  catch (error) { if ((error as { code?: string }).code === 'auth/already-initialized') return getAuth(firebaseApp); throw error; }
}
export const auth = nativeAuth();
auth.languageCode = 'kk';
