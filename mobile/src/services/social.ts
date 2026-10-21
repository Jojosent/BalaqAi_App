import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';
export async function socialSignIn(provider: 'google' | 'apple') {
  const oauth = provider === 'google' ? new GoogleAuthProvider() : new OAuthProvider('apple.com');
  if (provider === 'google') oauth.setCustomParameters({ prompt: 'select_account' });
  else { oauth.addScope('email'); oauth.addScope('name'); }
  return signInWithPopup(auth, oauth);
}
