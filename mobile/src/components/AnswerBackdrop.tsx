import { Image } from 'react-native';

export function AnswerBackdrop() {
  return <Image
    source={require('../../assets/images/answer-background.png')}
    accessible={false}
    pointerEvents="none"
    resizeMode="stretch"
    style={{ position: 'absolute', width: '100%', height: '100%' }}
  />;
}
