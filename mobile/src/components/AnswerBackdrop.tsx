import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useSvgId } from './useSvgId';
export function AnswerBackdrop() {
  const id = useSvgId('answer-background');
  return <Svg accessible={false} pointerEvents="none" width="100%" height="100%" viewBox="0 0 375 812" preserveAspectRatio="none" style={{ position: 'absolute' }}>
    <Defs><LinearGradient id={id} x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#fbf8f2" /><Stop offset="0.65" stopColor="#faf7f1" /><Stop offset="1" stopColor="#75c5b6" /></LinearGradient></Defs>
    <Rect width="375" height="812" fill="#faf7f1" /><Rect width="375" height="812" fill={`url(#${id})`} />
    <Path d="M-20 250C-6 142 18 90 113 53L187 6l74 47c95 37 119 89 134 197M-20 207C1 108 32 64 111 37L187-9l76 46c79 27 110 71 132 170" stroke="#bdd8cf" strokeWidth={5} fill="none" />
    {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <Path key={i} d="M0 12c-7-13 10-20 13-9 2 8-13 13-9 23 3 8 15 4 14-3M13 3c2-11 18-7 12 5-4 8-11 11-8 19" transform={`translate(${i * 51 - 5} ${i < 4 ? 60 - i * 15 : (i - 4) * 15 + 15}) rotate(${i < 4 ? -30 : 30})`} fill="none" stroke="#a6cfc1" strokeWidth={4} opacity={0.65} />)}
    <Path d="m0 685 58-51 46 43 71-83 72 80 62-40 66 51v127H0Z" fill="#b5d9ca" opacity={0.75} /><Path d="m0 722 83-48 59 29 61-52 62 57 110-26v130H0Z" fill="#77bdad" opacity={0.65} /><Path d="M0 763c108-30 249 17 375-24v73H0Z" fill="#3baa99" opacity={0.6} />
    <Path d="M0 795h375M0 808h375" stroke="#c6e4d6" strokeWidth={3} />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <Path key={i} d="m0 804 9-7 9 7 9-7 9 7" transform={`translate(${i * 39} 0)`} stroke="#c6e4d6" strokeWidth={3} fill="none" />)}
  </Svg>;
}
