import { Button, Text } from '@expo/ui/jetpack-compose';
import { fillMaxWidth } from '@expo/ui/jetpack-compose/modifiers';

import { useSheetColors } from './colors';
import type { ContinueButtonProps } from './continue-button.types';

// Android has no glass. The Material counterpart of a prominent sheet action
// is a full-width filled button, tinted the same system blue as the
// glassProminent Continue on the other platform.
export function ContinueButton({ label, onPress }: ContinueButtonProps) {
  const { tint } = useSheetColors();

  return (
    <Button
      onClick={onPress}
      colors={{ containerColor: tint, contentColor: '#FFFFFF' }}
      modifiers={[fillMaxWidth()]}>
      <Text>{label}</Text>
    </Button>
  );
}
