import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthFlowProvider } from '../components/AuthFlow';
import { SessionProvider, useSession } from '../components/Session';
import { AuthGate } from '../components/AuthGate';
import { SyncBanner } from '../components/SyncBanner';

function Application() {
  const { user } = useSession();
  return (
    <AuthFlowProvider key={`${user?.uid || 'signed-out'}`}>
      <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#c9e9e5' } }} />
      <AuthGate />
      <SyncBanner />
    </AuthFlowProvider>
  );
}
export default function RootLayout() { return <SessionProvider><Application /></SessionProvider>; }
