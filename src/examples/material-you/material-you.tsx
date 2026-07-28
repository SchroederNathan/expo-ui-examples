import {
  Column,
  Host,
  Surface,
  Text,
  isDynamicColorAvailable,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxSize,
  fillMaxWidth,
  padding,
  verticalScroll,
} from '@expo/ui/jetpack-compose/modifiers';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaletteStrip } from './palette-strip';
import { SeedPicker } from './seed-picker';
import { SEEDS, type Seed } from './seeds';
import { Showcase } from './showcase';

export function MaterialYou() {
  const [seed, setSeed] = useState<Seed>(SEEDS[0]);
  // The header is hidden, so Compose has to inset past the status bar itself.
  const insets = useSafeAreaInsets();

  // `useMaterialColors` reads the palette on each render but doesn't subscribe to
  // system changes, so change your wallpaper and the JS-side colors below would go
  // stale while the Compose components retheme themselves. Re-rendering on
  // foreground keeps both halves in sync after a trip to the wallpaper picker.
  const [, resync] = useState(0);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (status) => {
      if (status === 'active') {
        resync((n) => n + 1);
      }
    });
    return () => sub.remove();
  }, []);

  // With a `seedColor`, Android derives the whole palette through SchemeTonalSpot —
  // the same algorithm Material You uses. Without one, it comes from the wallpaper.
  const colors = useMaterialColors({ seedColor: seed.color ?? undefined });
  const wallpaper = useMaterialColors();

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

          <SeedPicker
            selected={seed}
            onSelect={setSeed}
            wallpaper={wallpaper}
            colors={colors}
          />

          <PaletteStrip colors={colors} />

          <Showcase />
        </Column>
      </Surface>
    </Host>
  );
}
