import { useColorScheme } from 'react-native';

// Compose provides no LocalContentColor inside a bare Column, so every Text in
// the sheet needs an explicit color to survive Android dark mode. One pair of
// label colors for the whole example, so the screen and the sheet always match.
const LIGHT = { label: '#000000', secondaryLabel: '#6C6C70', tint: '#007AFF' };
const DARK = { label: '#FFFFFF', secondaryLabel: '#98989F', tint: '#0A84FF' };

export type SheetColors = typeof LIGHT;

export function useSheetColors(): SheetColors {
  return useColorScheme() === 'dark' ? DARK : LIGHT;
}
