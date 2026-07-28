import { Column, Host, Surface, Text, useMaterialColors } from '@expo/ui/jetpack-compose';
import {
  fillMaxSize,
  fillMaxWidth,
  padding,
  verticalScroll,
} from '@expo/ui/jetpack-compose/modifiers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GalleryCard } from './gallery-card';
import { InstallCard } from './install-card';
import { ScrubCard } from './scrub-card';

export function ExpressiveLoaders() {
  const colors = useMaterialColors();
  // The header is hidden, so Compose insets past the status bar itself.
  const insets = useSafeAreaInsets();

  return (
    <Host style={{ flex: 1 }}>
      <Surface color={colors.background} modifiers={[fillMaxSize()]}>
        <Column
          modifiers={[
            fillMaxWidth(),
            verticalScroll(),
            padding(20, insets.top + 20, 20, insets.bottom + 20),
          ]}
          verticalArrangement={{ spacedBy: 20 }}>
          <Column verticalArrangement={{ spacedBy: 4 }}>
            <Text color={colors.onBackground} style={{ typography: 'headlineMedium' }}>
              Expressive Loaders
            </Text>
            <Text color={colors.onSurfaceVariant} style={{ typography: 'bodyMedium' }}>
              Material 3 Expressive&apos;s morphing loader and wavy progress bar, walked
              through a fake app update.
            </Text>
          </Column>

          <InstallCard colors={colors} />
          <ScrubCard colors={colors} />
          <GalleryCard colors={colors} />
        </Column>
      </Surface>
    </Host>
  );
}
