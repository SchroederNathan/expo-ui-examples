import { Host } from '@expo/ui';
import { Button, HStack, Image, List, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
  background,
  buttonStyle,
  clipShape,
  font,
  foregroundStyle,
  frame,
  listRowInsets,
  listRowSeparator,
  listStyle,
  onGeometryChange,
  padding,
  scrollIndicators,
  shadow,
} from '@expo/ui/swift-ui/modifiers';
import type { SFSymbol } from 'sf-symbols-typescript';
import { PlatformColor } from 'react-native';

import { AlbumArt } from './album-art';
import { MUSIC_RED } from './colors';
import { ContentSizeView, type ContentSize, type Geometry } from './content-size';
import { TRACKS } from './tracks';
import { useAlbumArt } from './use-album-art';

const secondary = foregroundStyle({ type: 'hierarchical', style: 'secondary' });

// Enough rows to scroll — `minimizeBehavior="onScrollDown"` on the tabs layout
// needs real scroll content to collapse the tab bar against.
const ROWS = Array.from({ length: 24 }, (_, index) => TRACKS[index % TRACKS.length]);

const TOTAL_MINUTES = Math.round(ROWS.reduce((sum, track) => sum + track.duration, 0) / 60);

// Apple Music's 20pt side margins and the 12pt gap between the two pills.
const SIDE_MARGIN = 20;
const PILL_GAP = 12;
// On a wide layout the pills stop growing here — two 50pt-tall capsules
// wider than this read as toolbar slabs, not buttons.
const MAX_PILL_ROW_WIDTH = 440;
// The hero never grows past this, and on short/wide layouts (a square
// unfolded screen, a phone in landscape) it is held to a fraction of the
// height so the title and pills still fit below it without scrolling.
const MAX_HERO_SIZE = 360;

function heroSizeFor(width: number, height: number) {
  // Apple Music sizes the hero artwork to ~68% of the content width.
  return Math.round(Math.min(width * 0.68, height * 0.42, MAX_HERO_SIZE));
}

function pillWidthFor(width: number) {
  const rowWidth = Math.min(width - SIDE_MARGIN * 2, MAX_PILL_ROW_WIDTH);
  return Math.floor((rowWidth - PILL_GAP) / 2);
}

// An Apple Music-style album screen: large centered artwork, title, red
// artist, Play/Shuffle pills, then artwork rows with a trailing ellipsis.
// Sizes come from the measured content area, not the window: a sidebar tab
// bar (unfolded iPhone Duo, iPad) shrinks the List's safe region from the
// trailing edge. The full-width header row reports that width; the height
// is only a clamp for the hero, so the screen estimate is enough for it.
export default function ListenNow() {
  const artUri = useAlbumArt();

  return (
    <ContentSizeView measureHeight={false}>
      {(size, onHeaderGeometry) => (
        <AlbumList artUri={artUri} size={size} onHeaderGeometry={onHeaderGeometry} />
      )}
    </ContentSizeView>
  );
}

function AlbumList({
  artUri,
  size,
  onHeaderGeometry,
}: {
  artUri: string | null;
  size: ContentSize;
  onHeaderGeometry: (frame: Geometry) => void;
}) {
  const heroSize = heroSizeFor(size.width, size.height);
  const pillWidth = pillWidthFor(size.width);

  return (
    <Host style={{ flex: 1 }}>
      <List modifiers={[listStyle('plain'), scrollIndicators('hidden')]}>
        <VStack
          spacing={2}
          modifiers={[
            frame({ maxWidth: Infinity }),
            onGeometryChange(onHeaderGeometry),
            listRowSeparator('hidden'),
            listRowInsets({ top: 8, leading: 0, bottom: 16, trailing: 0 }),
          ]}>
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
          <Text modifiers={[font({ textStyle: 'footnote' }), secondary]}>
            R&B/Soul · 2016 · Lossless
          </Text>
          <HStack spacing={PILL_GAP} modifiers={[padding({ top: 14 })]}>
            <PillButton icon="play.fill" label="Play" width={pillWidth} />
            <PillButton icon="shuffle" label="Shuffle" width={pillWidth} />
          </HStack>
        </VStack>

        {ROWS.map((track, index) => (
          <HStack key={index} spacing={12}>
            <AlbumArt uri={artUri} size={48} cornerRadius={5} />
            <VStack alignment="leading" spacing={2}>
              <Text>{track.title}</Text>
              <Text modifiers={[font({ textStyle: 'footnote' }), secondary]}>{track.artist}</Text>
            </VStack>
            <Spacer />
            <Image systemName="ellipsis" size={15} modifiers={[secondary]} />
          </HStack>
        ))}

        <VStack
          alignment="leading"
          spacing={2}
          modifiers={[listRowSeparator('hidden'), padding({ top: 4, bottom: 12 })]}>
          <Text modifiers={[font({ textStyle: 'footnote' }), secondary]}>
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
// survive the Button host's sizing, so the width is computed in JS from the
// measured content area (see `pillWidthFor`) and passed in.
function PillButton({ icon, label, width }: { icon: SFSymbol; label: string; width: number }) {
  return (
    <Button modifiers={[buttonStyle('plain')]}>
      <HStack
        spacing={8}
        modifiers={[
          frame({ width, height: 50 }),
          // Semantic fill: #F2F2F7 in light, #1C1C1E in dark — the same pair
          // Apple Music's own Play/Shuffle pills use.
          background(PlatformColor('secondarySystemBackground')),
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
