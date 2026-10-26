import Svg, { Circle, Path } from 'react-native-svg';

export function MoodIllustration({ size }: { size: number }) {
  return <Svg accessible={false} width={size} height={size} viewBox="0 0 170 170">
    <Path d="M65 62C60 39 62 8 84 8c27 0 25 33 23 54L96 67 70 66Z" fill="#0b1312" />
    <Path d="M69 66c-11 4-14 24-17 35L21 90l-10-9-5 1 8 14 44 25 16-25h25l18 25 44-25 8-13-5-2-10 9-31 12c-4-13-6-32-20-36Z" fill="#ffb18e" />
    <Path d="M66 68 52 93l19 6 2 29h29l2-29 17-6-15-25-17-7Z" fill="#648bc5" />
    <Path d="M81 53v10l-9 5q15 17 29 0l-9-6V51Z" fill="#ffb18e" />
    <Path d="M70 30c0-12 28-15 29 2v10c0 23-28 24-29 0Z" fill="#ffc2a3" />
    <Path d="M66 33q12-1 17-15 3 13 19 17-2-22-16-22-17 0-20 20Z" fill="#0b1312" />
    <Path d="m73 38 5 1m12 0 5-1m-17 13q7 4 13 0" stroke="#9d6060" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <Path d="M77 123c-27-17-60-4-42 15l40 24 61-17c25-18-1-37-31-23Z" fill="#f5b51b" />
    <Path d="m62 126 25 21 24-22-20 5Z" fill="#d29115" />
    <Path d="M65 151q25-13 43-1l29 9-1 5-51-3-37 2-2-5Z" fill="#ffb18e" />
    <Circle cx="14" cy="86" r="3" fill="none" stroke="#ffb18e" strokeWidth="2" /><Circle cx="159" cy="86" r="3" fill="none" stroke="#ffb18e" strokeWidth="2" />
  </Svg>;
}
