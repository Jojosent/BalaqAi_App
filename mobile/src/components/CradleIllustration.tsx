import { Image } from 'react-native';

export function CradleIllustration() {
  return <Image
    source={require('../../assets/images/answer-cradle.png')}
    accessible={false}
    pointerEvents="none"
    resizeMode="contain"
    style={{ width: '100%', aspectRatio: 554 / 414 }}
  />;
}
