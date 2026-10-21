import { getApps, initializeApp } from 'firebase/app';
// Public Web configuration. Admin credentials belong only on the server.
export const firebaseApp = getApps()[0] || initializeApp({ apiKey: 'AIzaSyAJvthw2at4u8uP7fKpXps2BW1efuVlU68', authDomain: 'balaqaidb.firebaseapp.com', projectId: 'balaqaidb', storageBucket: 'balaqaidb.firebasestorage.app', messagingSenderId: '631044719720', appId: '1:631044719720:web:be9257e34bef581df067dd' });
