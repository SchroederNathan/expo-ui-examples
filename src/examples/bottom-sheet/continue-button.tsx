import { Button } from '@expo/ui';

import type { ContinueButtonProps } from './continue-button.types';

// Resolution fallback only: Metro always prefers the .ios/.android siblings on
// device, but tsc (no moduleSuffixes) and web resolve this file. The universal
// filled variant is the closest single-tree stand-in for the platform buttons.
export function ContinueButton({ label, onPress }: ContinueButtonProps) {
  return <Button variant="filled" label={label} onPress={onPress} />;
}
