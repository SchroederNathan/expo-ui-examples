import { Host } from '@expo/ui';
import { Button, HStack, Image, List, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
  backgroundOverlay,
  buttonStyle,
  clipShape,
  font,
  foregroundStyle,
  frame,
  listRowInsets,
  listRowSeparator,
  listStyle,
  padding,
  scrollIndicators,
  shadow,
} from '@expo/ui/swift-ui/modifiers';
import type { SFSymbol } from 'sf-symbols-typescript';
import { PlatformColor, useWindowDimensions } from 'react-native';

import { AlbumArt } from '../music-player/album-art';
import { useAlbumArt } from '../music-player/use-album-art';
import { TRACKS } from './tracks';

// Apple Music's accent red.
const MUSIC_RED = '#FA233B';

// Enough rows to scroll — `minimizeBehavior="onScrollDown"` on the tabs layout
// needs real scroll content to collapse the tab bar against.
const ROWS = Array.from({ length: 24 }, (_, index) => TRACKS[index % TRACKS.length]);

const TOTAL_MINUTES = Math.round(ROWS.reduce((sum, track) => sum + track.duration, 0) / 60);

// An Apple Music-style album screen: large centered artwork, title, red
// artist, Play/Shuffle pills, then artwork rows with a trailing ellipsis.
export default function ListenNow() {
  const artUri = useAlbumArt();
  // Apple Music sizes the hero artwork to ~68% of the screen width.
  const { width } = useWindowDimensions();
  const heroSize = Math.round(width * 0.68);

  return (
    <Host style={{ flex: 1 }}>
      <List modifiers={[listStyle('plain'), scrollIndicators('hidden')]}>
        <VStack
          spacing={2}
          modifiers={[
            frame({ maxWidth: 9999 }),
            listRowSeparator('hidden'),
            listRowInsets({ top: 8, leading: 0, bottom: 16, trailing: 0 }),
          ]}>
          {/* A softer shadow than AlbumArt's built-in one. */}
          <AlbumArt
            uri={artUri}
            size={heroSize}
            cornerRadius={8}
            modifiers={[shadow({ radius: 12, y: 6, color: '#00000040' })]}
          />
          <Text modifiers={[padding({ top: 20 }), font({ textStyle: 'title2', weight: 'bold' })]}>
            Blonde
          </Text>
          <Text modifiers={[font({ textStyle: 'title2' }), foregroundStyle(MUSIC_RED)]}>
            Frank Ocean
          </Text>
          <Text
            modifiers={[
              font({ textStyle: 'footnote' }),
              foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
            ]}>
            R&B/Soul · 2016 · Lossless
          </Text>
          <HStack spacing={12} modifiers={[padding({ top: 14 })]}>
            <PillButton icon="play.fill" label="Play" />
            <PillButton icon="shuffle" label="Shuffle" />
          </HStack>
        </VStack>

        {ROWS.map((track, index) => (
          <HStack key={index} spacing={12}>
            <AlbumArt uri={artUri} size={48} cornerRadius={5} />
            <VStack alignment="leading" spacing={2}>
              <Text>{track.title}</Text>
              <Text
                modifiers={[
                  font({ textStyle: 'footnote' }),
                  foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
                ]}>
                {track.artist}
              </Text>
            </VStack>
            <Spacer />
            <Image
              systemName="ellipsis"
              size={15}
              modifiers={[foregroundStyle({ type: 'hierarchical', style: 'secondary' })]}
            />
          </HStack>
        ))}

        <VStack
          alignment="leading"
          spacing={2}
          modifiers={[listRowSeparator('hidden'), padding({ top: 4, bottom: 12 })]}>
          <Text
            modifiers={[
              font({ textStyle: 'footnote' }),
              foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
            ]}>
            {ROWS.length} songs, {TOTAL_MINUTES} minutes
          </Text>
        </VStack>
      </List>
    </Host>
  );
}

// Apple Music's Play/Shuffle pills: neutral gray fill, red icon and label.
// `buttonStyle('bordered')` would tint the fill red too, so the fill is drawn
// by hand behind a plain button — and the style must be 'plain', because an
// unstyled Button inside a List row turns the whole row (hero art included)
// into one press-highlighting target. SwiftUI's greedy `maxWidth` doesn't
// survive the Button host's sizing, so the width is measured in JS instead:
// two pills split the screen minus the 20pt side margins and the 12pt gap.
function PillButton({ icon, label }: { icon: SFSymbol; label: string }) {
  const { width } = useWindowDimensions();
  const pillWidth = (width - 20 * 2 - 12) / 2;

  return (
    <Button modifiers={[buttonStyle('plain')]}>
      <HStack
        spacing={8}
        modifiers={[
          frame({ width: pillWidth, height: 50 }),
          // Semantic fill: #F2F2F7 in light, #1C1C1E in dark — the same pair
          // Apple Music's own Play/Shuffle pills use.
          backgroundOverlay({ color: PlatformColor('secondarySystemBackground') }),
          clipShape('capsule'),
        ]}>
        <Image systemName={icon} size={16} color={MUSIC_RED} />
        <Text modifiers={[font({ size: 17, weight: 'semibold' }), foregroundStyle(MUSIC_RED)]}>
          {label}
        </Text>
      </HStack>
    </Button>
  );
}
