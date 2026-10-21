import Svg, { Circle, Path, Rect } from 'react-native-svg';

export function KazakhstanFlag({ width = 34 }: { width?: number }) {
  return (
    <Svg width={width} height={width * 0.68} viewBox="0 0 50 34" accessibilityLabel="Қазақстан туы">
      <Rect width="50" height="34" rx="5" fill="#38bdd3" />
      <Path d="M5 3v28M3 6l4 3-4 3 4 3-4 3 4 3-4 3 4 3" stroke="#eacb50" strokeWidth="1" fill="none" />
      <Circle cx="28" cy="14" r="5" fill="#ffdd54" />
      {Array.from({ length: 16 }, (_, index) => <Path key={index} d="M28 6v1.4" stroke="#ffdd54" strokeWidth="1.2" transform={`rotate(${index * 22.5} 28 14)`} />)}
      <Path d="M18 21q4 8 10 6 6 2 10-6-5 5-10 4-5 1-10-4Z" fill="#ffdd54" />
    </Svg>
  );
}
