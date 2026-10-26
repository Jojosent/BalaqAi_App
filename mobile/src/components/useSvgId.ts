import { useId } from 'react';
// Navigation can keep multiple copies of a screen mounted in the same web document.
// SVG paint servers must belong to their own instance, including hidden screens.
export function useSvgId(scope: string) {
  const instance = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return `balaqai-${scope}-${instance}`;
}
