import {
  ConcentricRectangle,
  EdgeCornerStyle,
  RoundedRectangle,
  VStack,
  ZStack,
} from '@expo/ui/swift-ui';
import type { ConcentricRectangleCornerParams } from '@expo/ui/swift-ui';
import {
  accessibilityAddTraits,
  accessibilityHint,
  foregroundStyle,
  frame,
  onTapGesture,
  padding,
} from '@expo/ui/swift-ui/modifiers';
import type { ReactNode } from 'react';
import { Platform } from 'react-native';

type CardProps = {
  children: ReactNode;
  /** Top inset. Only what the content genuinely cannot reach under — the header. */
  top?: number;
  /** Bottom inset. Only what the content cannot reach under — the bar, the indicator. */
  bottom?: number;
  /** Called for a tap anywhere on the panel, its filled shape included. */
  onTap?: () => void;
  /** What `onTap` does, read by VoiceOver. */
  tapHint?: string;
};

/**
 * Side inset only. The vertical edges are deliberately the caller's to set: content
 * should run to the top and bottom of the panel, and back off only for something
 * actually in the way.
 */
const SIDE_INSET = 22;

/** Floor for the corners facing the gap, which no display corner can derive. */
const INNER_RADIUS = 28;

const white = foregroundStyle({ type: 'color', color: '#FFFFFF' });

// `ConcentricRectangle` is new in iOS 26 and draws nothing on older systems, so
// they get a plain rounded panel with the same floor radius on every corner.
const HAS_CONCENTRIC = parseInt(String(Platform.Version), 10) >= 26;

// Every corner is a concentric corner. The four that reach the bezel inherit the
// display's own radius and stay parallel to it.
//
// The two facing the gap sit far from any screen corner, where the concentric radius
// has shrunk to zero — they would come out square. `minimumRadius` is the concentric
// style's own floor for that case, and the only reason those two read as rounded.
const CORNER = EdgeCornerStyle.concentric(INNER_RADIUS);
const CORNERS: ConcentricRectangleCornerParams = {
  topLeadingCorner: CORNER,
  topTrailingCorner: CORNER,
  bottomLeadingCorner: CORNER,
  bottomTrailingCorner: CORNER,
};

/**
 * One white panel. A SwiftUI `Shape` fills whatever space the parent offers, so two
 * of these in a `VStack` divide the screen between them.
 *
 * The panel runs to the screen edge, where the bezel supplies the contrast its
 * outer corners need — which is why the safe area is the content's problem, not the
 * shape's, and arrives here as `top` / `bottom`.
 */
export function Card({ children, top = 0, bottom = 0, onTap, tapHint }: CardProps) {
  const tapModifiers = onTap
    ? [
        onTapGesture(onTap),
        accessibilityAddTraits(['isButton']),
        ...(tapHint ? [accessibilityHint(tapHint)] : []),
      ]
    : [];

  return (
    <ZStack modifiers={tapModifiers}>
      {HAS_CONCENTRIC ? (
        <ConcentricRectangle corners={CORNERS} modifiers={[white]} />
      ) : (
        <RoundedRectangle cornerRadius={INNER_RADIUS} modifiers={[white]} />
      )}
      <VStack
        alignment="leading"
        spacing={16}
        modifiers={[
          // Without this the stack is only as wide as its widest child, so the
          // ZStack centers it and the content reads as indented. `Infinity` is how
          // SwiftUI's `.frame(maxWidth: .infinity)` — "take the width on offer" —
          // comes across the bridge.
          frame({ maxWidth: Infinity, alignment: 'leading' }),
          padding({ top, bottom, leading: SIDE_INSET, trailing: SIDE_INSET }),
        ]}>
        {children}
      </VStack>
    </ZStack>
  );
}
