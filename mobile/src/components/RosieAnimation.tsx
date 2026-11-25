import { useEffect, useState } from 'react';
import { Platform, type ImageSourcePropType } from 'react-native';
import { Image } from '../i18n/Localized';
const assets = {
 first: { animation: require('../../assets/animations/rosie-weeks-1-4.webp'), poster: require('../../assets/animations/rosie-weeks-1-4-poster.png') },
 water: { animation: require('../../assets/animations/water-drop.webp'), poster: require('../../assets/animations/water-drop-poster.png') },
 early: { animation: require('../../assets/animations/rosie-weeks-5-8.webp'), poster: require('../../assets/animations/rosie-weeks-5-8-poster.png') },
 baby: { animation: require('../../assets/animations/rosie-weeks-9-12.webp'), poster: require('../../assets/animations/rosie-weeks-9-12-poster.png') },
 star: { animation: require('../../assets/animations/rosie-weeks-13-19.webp'), poster: require('../../assets/animations/rosie-weeks-13-19-poster.png') },
 sleeping: { animation: require('../../assets/animations/rosie-weeks-20-plus.webp'), poster: require('../../assets/animations/rosie-weeks-20-plus-poster.png') },
 final: { animation: require('../../assets/animations/rosie-final-week.webp'), poster: require('../../assets/animations/rosie-final-week-poster.png') },
 boy: { animation: require('../../assets/animations/rosie-welcome-boy.webp'), poster: require('../../assets/animations/rosie-welcome-boy-poster.png') },
} satisfies Record<string, { animation: ImageSourcePropType; poster: ImageSourcePropType }>;
export type RosieKind = keyof typeof assets;
export function RosieAnimation({ kind, width, height, label }: { kind: RosieKind; width: number; height: number; label: string }) {
 const [animate, setAnimate] = useState(false);
 const [failed, setFailed] = useState(false);
 useEffect(() => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => setAnimate(!motion.matches);
  update(); motion.addEventListener('change', update);
  return () => motion.removeEventListener('change', update);
 }, []);
 return <Image source={animate && !failed ? assets[kind].animation : assets[kind].poster} resizeMode="contain" accessibilityLabel={label} onError={() => setFailed(true)} style={{ width, height }} />;
}
