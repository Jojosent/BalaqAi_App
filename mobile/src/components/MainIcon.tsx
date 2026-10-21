import Svg, { Circle, Path } from 'react-native-svg';
export type MainIconName = 'home' | 'community' | 'shop' | 'account' | 'search';
export function MainIcon({ name, color = '#9fa5a3', size = 25 }: { name: MainIconName; color?: string; size?: number }) {
  const path = name === 'home' ? 'm2 10 10-8 10 8M5 8v14h5v-8h4v8h5V8' : name === 'community' ? 'M8 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm14 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM16 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM6 22v-5c0-6 12-6 12 0v5M1 19v-3c0-3 3-4 5-3m17 6v-3c0-3-3-4-5-3' : name === 'shop' ? 'M3 9 5 2h14l2 7M3 9c0 4 6 4 6 0 0 4 6 4 6 0 0 4 6 4 6 0M4 12v10h16V12M9 2 8 9m7-7 1 7M9 22v-7h6v7' : name === 'account' ? 'M17 6a5 5 0 1 1-10 0 5 5 0 0 1 10 0ZM3 22v-3c0-7 18-7 18 0v3H3Z' : 'm16 16 6 6';
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">{name === 'search' ? <Circle cx="10" cy="10" r="7" stroke={color} strokeWidth={2} /> : null}<Path d={path} stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
}

export function HorseBadge() {
  return <Svg width={27} height={27} viewBox="0 0 30 30" fill="none"><Circle cx="15" cy="15" r="13" stroke="#4bb8a9" /><Path d="m5 15 3-4 6 1 3-7 3 1 2 5-3 1-2-2-2 6-2 1 2 7m-5-8-1 5-3 3m9-8 3 1 2 7M6 13l-3 6m15-14 1-2" stroke="#4bb8a9" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
}
