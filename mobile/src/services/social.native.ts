import { Platform } from 'react-native';
import { GoogleAuthProvider, OAuthProvider, signInWithCredential, updateProfile } from 'firebase/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { auth } from './firebase';
export async function socialSignIn(provider: 'google' | 'apple') {
  if (provider === 'google') {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    if (!webClientId) throw new Error('Google OAuth client ID әлі енгізілмеген. Әзірге email арқылы кіріңіз.');
    let nativeGoogle;
    try { nativeGoogle = await import('@react-native-google-signin/google-signin'); }
    catch { throw new Error('Google кіруі бұл нұсқада қолжетімсіз. Әзірге email пайдаланыңыз.'); }
    const { GoogleSignin } = nativeGoogle;
    GoogleSignin.configure({ webClientId, iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID });
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    if (response.type !== 'success') return null;
    if (!response.data.idToken) throw new Error('Google ID token алынбады.');
    return signInWithCredential(auth, GoogleAuthProvider.credential(response.data.idToken));
  }
  if (Platform.OS !== 'ios' || !(await AppleAuthentication.isAvailableAsync())) throw new Error('Apple арқылы кіру iOS құрылғысында қолжетімді. Email немесе Google пайдаланыңыз.');
  const rawNonce = Crypto.randomUUID();
  const nonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);
  const response = await AppleAuthentication.signInAsync({ requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL], nonce });
  if (!response.identityToken) throw new Error('Apple ID token алынбады.');
  const result = await signInWithCredential(auth, new OAuthProvider('apple.com').credential({ idToken: response.identityToken, rawNonce }));
  const displayName = [response.fullName?.givenName, response.fullName?.familyName].filter(Boolean).join(' ');
  if (displayName && !result.user.displayName) await updateProfile(result.user, { displayName });
  return result;
}
