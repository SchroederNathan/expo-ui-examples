import { useCallback, useState, type ReactNode } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ContentSize = { width: number; height: number };
export type Geometry = { width: number; height: number };

type Props = {
  /**
   * `false` keeps the estimated height even once geometry arrives, for callers
   * whose measured view is only a row, not the screen.
   */
  measureHeight?: boolean;
  /**
   * Renders the SwiftUI tree once a size is known. Attach `onGeometryChange`
   * to a greedy view inside it.
   */
  children: (size: ContentSize, onGeometryChange: (frame: Geometry) => void) => ReactNode;
};

// `useWindowDimensions` reports the whole window, but a SwiftUI tree lays
// out inside the safe region, which is often smaller: on the unfolded iPhone
// Duo (and iPad) the tab bar becomes a sidebar that shrinks it from the
// trailing edge, and a formSheet on a wide device is a centered card. Two
// measurements cover it: the React Native `onLayout` of the wrapping View,
// minus the safe-area insets, gives a first-frame estimate so nothing renders
// at the wrong size, then SwiftUI's own `onGeometryChange` on a greedy view
// inside the Host reports the exact region and replaces it.
export function ContentSizeView({ measureHeight = true, children }: Props) {
  const insets = useSafeAreaInsets();
  const [layout, setLayout] = useState<ContentSize | null>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout((prev) =>
      prev != null && prev.width === width && prev.height === height ? prev : { width, height }
    );
  }, []);

  const onGeometryChange = useCallback((frame: Geometry) => {
    const width = Math.round(frame.width);
    const height = Math.round(frame.height);
    if (width <= 0 || height <= 0) {
      return;
    }
    setGeometry((prev) =>
      prev != null && prev.width === width && prev.height === height ? prev : { width, height }
    );
  }, []);

  let size: ContentSize | null = null;
  if (layout != null) {
    const estimatedHeight = Math.max(0, layout.height - insets.top - insets.bottom);
    size = {
      width: geometry?.width ?? Math.max(0, layout.width - insets.left - insets.right),
      height: measureHeight && geometry != null ? geometry.height : estimatedHeight,
    };
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      {size != null && children(size, onGeometryChange)}
    </View>
  );
}
