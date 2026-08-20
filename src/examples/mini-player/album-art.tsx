import { Image, RoundedRectangle } from '@expo/ui/swift-ui';
import {
  aspectRatio,
  clipShape,
  foregroundStyle,
  frame,
  resizable,
  shadow,
} from '@expo/ui/swift-ui/modifiers';
import type { ComponentProps } from 'react';

type AlbumArtProps = {
  uri: string | null;
  size: number;
  cornerRadius: number;
  shadowRadius?: number;
  modifiers?: ComponentProps<typeof Image>['modifiers'];
};

// Must be rendered inside a SwiftUI tree (a Host).
// `resizable()` is applied by Image's own modifier pass, everything after it by
// the UIBaseView wrapper — so the order below reads the same as it would in Swift.
export function AlbumArt({
  uri,
  size,
  cornerRadius,
  shadowRadius = 0,
  modifiers = [],
}: AlbumArtProps) {
  const box = [
    frame({ width: size, height: size }),
    clipShape('roundedRectangle', cornerRadius),
    ...(shadowRadius > 0
      ? [
          shadow({
            radius: shadowRadius,
            y: shadowRadius / 2,
            color: '#000000A6',
          }),
        ]
      : []),
    ...modifiers,
  ];

  if (uri == null) {
    return (
      <RoundedRectangle
        cornerRadius={cornerRadius}
        modifiers={[
          foregroundStyle({
            type: 'linearGradient',
            colors: ['#4A5A52', '#14181A'],
            startPoint: { x: 0, y: 0 },
            endPoint: { x: 1, y: 1 },
          }),
          ...box,
        ]}
      />
    );
  }

  return (
    <Image uiImage={uri} modifiers={[resizable(), aspectRatio({ contentMode: 'fill' }), ...box]} />
  );
}
