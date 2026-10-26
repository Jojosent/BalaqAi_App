import { Children, forwardRef, type ComponentRef, type ReactNode } from 'react';
import { Text as NativeText, TextInput as NativeInput, Pressable as NativePressable, View as NativeView, Image as NativeImage, type ViewProps, type ImageProps, type TextProps, type TextInputProps, type PressableProps } from 'react-native';
import { useLanguage } from './Language';
function strings(children: ReactNode, t: (value: string) => string): ReactNode {
 const items = Children.toArray(children);
 if (items.every(item => typeof item === 'string' || typeof item === 'number')) { const joined = items.join(''); const translated = t(joined); if (translated !== joined) return translated; }
 return items.map(item => typeof item === 'string' ? t(item) : item);
}
// User-entered content must opt out with verbatim; placeholders and accessibility remain localized.
export const Text = forwardRef<ComponentRef<typeof NativeText>, TextProps & { verbatim?: boolean }>(function Text({ children, verbatim, accessibilityLabel, ...props }, ref) {
 const { t } = useLanguage(); return <NativeText {...props} ref={ref} accessibilityLabel={accessibilityLabel && t(accessibilityLabel)}>{verbatim ? children : strings(children, t)}</NativeText>;
});
export const TextInput = forwardRef<ComponentRef<typeof NativeInput>, TextInputProps>(function TextInput({ placeholder, accessibilityLabel, ...props }, ref) {
 const { t } = useLanguage(); return <NativeInput {...props} ref={ref} placeholder={placeholder && t(placeholder)} accessibilityLabel={accessibilityLabel && t(accessibilityLabel)} />;
});
export function Pressable({ accessibilityLabel, accessibilityHint, ...props }: PressableProps) {
 const { t } = useLanguage(); return <NativePressable {...props} accessibilityLabel={accessibilityLabel && t(accessibilityLabel)} accessibilityHint={accessibilityHint && t(accessibilityHint)} />;
}

export const View = forwardRef<ComponentRef<typeof NativeView>, ViewProps>(function View({ accessibilityLabel, ...props }, ref) { const { t } = useLanguage(); return <NativeView {...props} ref={ref} accessibilityLabel={accessibilityLabel && t(accessibilityLabel)} />; });
export const Image = forwardRef<ComponentRef<typeof NativeImage>, ImageProps>(function Image({ accessibilityLabel, ...props }, ref) { const { t } = useLanguage(); return <NativeImage {...props} ref={ref} accessibilityLabel={accessibilityLabel && t(accessibilityLabel)} />; });
