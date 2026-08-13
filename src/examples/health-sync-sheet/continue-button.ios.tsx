import { Button, Text } from '@expo/ui/swift-ui';
import { buttonStyle, controlSize, frame } from '@expo/ui/swift-ui/modifiers';

import type { ContinueButtonProps } from './continue-button.types';

// The universal Button tops out at `filled` — glass only exists as a SwiftUI
// button style, so this one component is split per platform. The frame goes on
// the label, not the button: that's what stretches the glass capsule full-width.
export function ContinueButton({ label, onPress }: ContinueButtonProps) {
  return (
    <Button onPress={onPress} modifiers={[buttonStyle('glassProminent'), controlSize('large')]}>
      <Text modifiers={[frame({ maxWidth: Infinity })]}>{label}</Text>
    </Button>
  );
}
