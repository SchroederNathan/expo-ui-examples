import { Host } from '@expo/ui';
import { HStack, ScrollView, Spacer, VStack } from '@expo/ui/swift-ui';
import { animation, Animation, padding } from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';
import { useWindowDimensions } from 'react-native';

import { PhotoTile } from './photo-tile';
import { PHOTOS, type Photo } from './photos';

export type Album = 'Travel' | 'Family' | 'Work';
export type TilePhoto = Photo & { favorite: boolean; album: Album | null };

const PADDING = 16;
const GAP = 16;

// Context Menu — a photo grid where every tile owns a SwiftUI ContextMenu.
// Long-press a tile: the photo lifts into a large preview with the menu below.
// The menu is on the content, not in the header — Expo Router already covers
// header menus. The Dropdown Menu example is the same grid on Android, so the
// two screens can be shown side by side. Fully self-contained; drop this folder
// into any Expo SDK 57 project.
export default function ContextMenuScreen() {
  const { width } = useWindowDimensions();
  const size = (width - PADDING * 2 - GAP) / 2;

  const [photos, setPhotos] = useState<TilePhoto[]>(() =>
    PHOTOS.map((photo) => ({ ...photo, favorite: false, album: null }))
  );

  const update = (id: string, patch: Partial<TilePhoto>) =>
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const remove = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  const rows: TilePhoto[][] = [];
  for (let i = 0; i < photos.length; i += 2) rows.push(photos.slice(i, i + 2));

  return (
    <Host style={{ flex: 1 }}>
      <ScrollView showsIndicators={false}>
        <VStack
          spacing={GAP}
          modifiers={[
            padding({ all: PADDING }),
            // Animates the remaining tiles closing the gap after a delete.
            animation(Animation.spring({ duration: 0.4 }), photos.length),
          ]}>
          {rows.map((row) => (
            <HStack key={row[0].id} spacing={GAP}>
              {row.map((photo) => (
                <PhotoTile
                  key={photo.id}
                  photo={photo}
                  size={size}
                  onChange={(patch) => update(photo.id, patch)}
                  onDelete={() => remove(photo.id)}
                />
              ))}
              {/* Keeps a lone last tile on the leading edge. */}
              {row.length === 1 ? <Spacer /> : null}
            </HStack>
          ))}
        </VStack>
      </ScrollView>
    </Host>
  );
}
