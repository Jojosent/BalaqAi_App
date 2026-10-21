import Svg, { Circle, Path } from 'react-native-svg';
export type ProfileIconName = 'user' | 'calendar' | 'heart' | 'bell' | 'star' | 'shield' | 'help' | 'gear' | 'edit';
const paths: Record<ProfileIconName, string> = {
  user: 'M5 21v-3c0-6 14-6 14 0v3H5ZM16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  calendar: 'M4 5h16v16H4V5Zm0 5h16M8 3v5m8-5v5M8 14h1m3 0h1m3 0h1m-9 3h1m3 0h1',
  heart: 'M12 21S2 15 2 8a5 5 0 0 1 10-1A5 5 0 0 1 22 8c0 7-10 13-10 13Z',
  bell: 'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3Zm5 3c1 2 3 2 4 0M12 2v2',
  star: 'm12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z',
  shield: 'm12 2 9 4v7c0 5-9 9-9 9s-9-4-9-9V6l9-4Zm0 6v7m-2-3 2 3 3-4',
  help: 'M9 8a3 3 0 1 1 4 3c-1 1-1 2-1 3m0 3v1',
  gear: 'm10 2 4 0 1 3 3-1 2 3-2 3 3 2-1 4-3 0-1 3-4 1-2-3-3 1-2-3 2-3-3-2 1-4 3 0 1-3Z',
  edit: 'm4 16 12-12 4 4L8 20l-5 1 1-5Zm10-10 4 4',
};
export function ProfileIcon({ name, color = '#3db8a4', size = 24 }: { name: ProfileIconName; color?: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d={paths[name]} stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />{name === 'gear' || name === 'help' ? <Circle cx={12} cy={12} r={name === 'gear' ? 3 : 10} stroke={color} strokeWidth={1.8} /> : null}</Svg>;
}
