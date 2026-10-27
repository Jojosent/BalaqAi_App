import Svg, { Circle, Path } from 'react-native-svg';
export function CradleIllustration({ size = 230 }: { size?: number }) {
  return <Svg accessible={false} pointerEvents="none" width={size} height={size} viewBox="0 0 260 230" fill="none">
    <Path d="M38 188C25 158 28 74 47 28q11-20 23 1h124q13-20 24 1c20 49 22 125 9 158M49 189c-8-39-8-111 11-149m145 150c10-42 8-115-10-150M62 39h134M53 46h151" stroke="#44b5a5" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M63 48v41m4-18-7 27m14-25-1 25m122-50v41m-4-16-5 25m15-26 6 26" stroke="#44b5a5" strokeWidth={6} strokeLinecap="round" />
    <Circle cx={65} cy={59} r={4} fill="#44b5a5" /><Circle cx={195} cy={59} r={4} fill="#44b5a5" />
    <Path d="M52 146c17-13 32-15 48-10l42 12 39-4 28 12-7 26H58Z" fill="#e6f7f1" stroke="#44b5a5" strokeWidth={5} />
    <Path d="M97 138c-5-12-4-25 4-32l26-13c23-11 49 4 42 26l-12 23c-10 20-40 17-60-4Z" fill="#f4fbf6" stroke="#44b5a5" strokeWidth={5} />
    <Path d="M112 102c-6-22 26-43 48-28 14 10 17 26 7 41-8-16-30-24-55-13Z" fill="#44b5a5" /><Path d="m119 95 10-7m10 1 9-5m-4 12 10-4" stroke="#f4fbf6" strokeWidth={3} strokeLinecap="round" />
    <Path d="m113 119 7 3m20 7 7 1m-21 7c2 4 6 5 10 2" stroke="#44b5a5" strokeWidth={4} strokeLinecap="round" />
    <Path d="M34 146c50 21 140 24 194 0v40c-53 24-141 22-194 0Z" fill="#44b5a5" /><Path d="M43 158c40 15 123 19 176-1v21c-48 18-126 18-176-1Z" fill="#f4fbf6" />
    <Path d="m56 169 8-6 9 8 8-5m13 5 9-6 9 9 9-5m14 3 9-7 9 8 9-5m14 1 9-7 9 6 8-5M49 188l-7 18m163-16 8 17M27 205c48 24 155 23 205-1" stroke="#44b5a5" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
