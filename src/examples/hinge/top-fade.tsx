import { Mask, Rectangle, VStack } from '@expo/ui/swift-ui';
import {
  accessibilityHidden,
  foregroundStyle,
  frame,
  ignoreSafeArea,
} from '@expo/ui/swift-ui/modifiers';
import type { ReactNode } from 'react';

export const FADE_HEIGHT = 32;
const fill = frame({ maxWidth: Infinity, maxHeight: Infinity });

export function TopFade({ children, contentTop }: { children: ReactNode; contentTop: number }) {
  return (
    <Mask alignment="top" modifiers={[fill]}>
      {children}
      <Mask.Content>
        <VStack spacing={0} modifiers={[fill, ignoreSafeArea(), accessibilityHidden()]}>
          <Rectangle
            modifiers={[
              frame({ height: Math.max(0, contentTop - FADE_HEIGHT) }),
              foregroundStyle('clear'),
            ]}
          />
          <Rectangle
            modifiers={[
              frame({ height: FADE_HEIGHT }),
              foregroundStyle({
                type: 'linearGradient',
                colors: ['#00000000', '#000000'],
                startPoint: { x: 0, y: 0 },
                endPoint: { x: 0, y: 1 },
              }),
            ]}
          />
          <Rectangle modifiers={[fill, foregroundStyle('#000000')]} />
        </VStack>
      </Mask.Content>
    </Mask>
  );
}
