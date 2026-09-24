import {
  Column,
  Host,
  Surface,
  Text,
  getMaterialColors,
  isDynamicColorAvailable,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxSize,
  fillMaxWidth,
  padding,
  verticalScroll,
} from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaletteStrip } from './palette-strip';
import { SeedPicker } from './seed-picker';
import { SEEDS, type Seed } from './seeds';
import { Showcase } from './showcase';
import { useRefreshOnForeground } from './use-refresh-on-foreground';

export function MaterialYou() {
  const [seed, setSeed] = useState<Seed>(SEEDS[0]);
  // The header is hidden, so Compose has to inset past the status bar itself.
  const insets = useSafeAreaInsets();

  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  useRefreshOnForeground();

  // With a `seedColor`, Android derives the whole palette through SchemeTonalSpot —
  // the same algorithm Material You uses. Without one, it comes from the wallpaper,
  // so the Wallpaper seed reuses that palette instead of asking native twice.
  const wallpaper = useMaterialColors();
  const colors =
    seed.color === null ? wallpaper : getMaterialColors({ scheme, seedColor: seed.color });

  const caption =
    seed.color === null
      ? isDynamicColorAvailable
        ? 'Generated from your wallpaper'
        : 'No dynamic color on this device — showing the Material 3 baseline'
      : `Generated from ${seed.color}`;

  return (
    // The same `seedColor` themes every Compose descendant, so the components
    // below never receive a color prop.
    <Host style={{ flex: 1 }} seedColor={seed.color ?? undefined}>
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
              Material You
            </Text>
            <Text color={colors.onSurfaceVariant} style={{ typography: 'bodyMedium' }}>
              {caption}
            </Text>
          </Column>

          <SeedPicker selected={seed} onSelect={setSeed} wallpaper={wallpaper} colors={colors} />

          <PaletteStrip colors={colors} />

          <Showcase />
        </Column>
      </Surface>
    </Host>
  );
}
