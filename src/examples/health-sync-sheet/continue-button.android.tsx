import { Button, Text } from '@expo/ui/jetpack-compose';
import { fillMaxWidth } from '@expo/ui/jetpack-compose/modifiers';

import type { ContinueButtonProps } from './continue-button.types';

// Android has no glass. The Material counterpart of a prominent sheet action
// is a full-width filled M3 button.
export function ContinueButton({ label, onPress }: ContinueButtonProps) {
  return (
    <Button onClick={onPress} modifiers={[fillMaxWidth()]}>
      <Text>{label}</Text>
    </Button>
  );
}
