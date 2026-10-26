import HomeContent from '../../components/HomeContent';
import PregnantHome from '../../components/PregnantHome';
import { useAuthFlow } from '../../components/AuthFlow';
export default function HomeScreen() {
  const { stage } = useAuthFlow();
  return stage === 'pregnant' ? <PregnantHome /> : <HomeContent />;
}
