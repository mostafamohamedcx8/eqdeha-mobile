import { forwardRef, useCallback, useRef } from 'react';
import { Platform, View, type ScrollViewInstance, type ViewInstance } from 'react-native';

/** Anything with focus(): TextInput, TextField, DateField, PhoneField refs. */
export type Focusable = { focus: () => void };

/** Space kept above the field (its label) when scrolling to it. */
const TOP_GAP = 28;

/**
 * "Go to the field with the problem": scrolls the screen so the field is visible and focuses its input.
 *
 * ```tsx
 * const f = useFormFocus<'name' | 'email'>();
 * <ScreenContainer scrollRef={f.scrollRef}>
 *   <FieldAnchor ref={f.anchor('name')}><TextField ref={f.input('name')} … /></FieldAnchor>
 * …
 * f.focusFirst(['name', 'email'], (k) => !!errors[k]);
 * ```
 * Fields without an input (photo, gender) only get scrolled to.
 */
export function useFormFocus<K extends string>() {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const anchors = useRef(new Map<K, ViewInstance | null>());
  const inputs = useRef(new Map<K, Focusable | null>());

  const anchor = useCallback((key: K) => (el: ViewInstance | null) => void anchors.current.set(key, el), []);
  const input = useCallback((key: K) => (el: Focusable | null) => void inputs.current.set(key, el), []);

  const focusField = useCallback((key: K) => {
    const view = anchors.current.get(key);
    const focusInput = () => inputs.current.get(key)?.focus();

    if (Platform.OS === 'web') {
      // react-native-web: a View ref is the DOM element.
      (view as unknown as HTMLElement | null)?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
      setTimeout(focusInput, 300);
      return;
    }

    const scroll = scrollRef.current;
    const content = scroll?.getInnerViewRef();
    if (!view || !scroll || !content) {
      focusInput();
      return;
    }
    view.measureLayout(
      content,
      (_x, y) => {
        scroll.scrollTo({ y: Math.max(0, y - TOP_GAP), animated: true });
        // focus after the scroll so the keyboard doesn't fight the animation
        setTimeout(focusInput, 300);
      },
      focusInput,
    );
  }, []);

  /** Goes to the first key (in screen order) that has an error. Returns it, or null if there is none. */
  const focusFirst = useCallback(
    (order: readonly K[], hasError: (key: K) => boolean): K | null => {
      const first = order.find(hasError) ?? null;
      if (first) focusField(first);
      return first;
    },
    [focusField],
  );

  return { scrollRef, anchor, input, focusField, focusFirst };
}

/** Wraps a field so it can be measured and scrolled to (collapsable=false keeps it a real native view). */
export const FieldAnchor = forwardRef<ViewInstance, { children: React.ReactNode }>(function FieldAnchor({ children }, ref) {
  return (
    <View ref={ref} collapsable={false}>
      {children}
    </View>
  );
});
