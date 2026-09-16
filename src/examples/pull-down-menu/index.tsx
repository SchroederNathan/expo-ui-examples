import { Host } from '@expo/ui';
import { HStack, ScrollView, Spacer, VStack } from '@expo/ui/swift-ui';
import { animation, Animation, padding } from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';
import { useWindowDimensions } from 'react-native';

import { PhotoCard } from './photo-card';
import { PHOTOS, type Photo } from './photos';

export type Album = 'Travel' | 'Family' | 'Work';
export type CardPhoto = Photo & { favorite: boolean; album: Album | null };

const PADDING = 16;
const GAP = 16;

// Pull-Down Menu — a grid of photo cards, each with an ellipsis button that opens
// a SwiftUI Menu. This is the menu Apple's HIG calls a pull-down menu: it hangs
// from the button that opened it and offers actions on that card. The Dropdown
// Menu example is the same grid on Android with a Material 3 menu, so the two
// screens can be shown side by side. Fully self-contained; drop this folder into
// any Expo SDK 57 project.
export default function PullDownMenuScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = (width - PADDING * 2 - GAP) / 2;

  const [photos, setPhotos] = useState<CardPhoto[]>(() =>
    PHOTOS.map((photo) => ({ ...photo, favorite: false, album: null }))
  );

  const update = (id: string, patch: Partial<CardPhoto>) =>
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const remove = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  const rows: CardPhoto[][] = [];
  for (let i = 0; i < photos.length; i += 2) rows.push(photos.slice(i, i + 2));

  return (
    <Host style={{ flex: 1 }}>
      <ScrollView showsIndicators={false}>
        <VStack
          spacing={GAP}
          modifiers={[
            padding({ all: PADDING }),
            // Animates the remaining cards closing the gap after a delete.
            animation(Animation.spring({ duration: 0.4 }), photos.length),
          ]}>
          {rows.map((row) => (
            <HStack key={row[0].id} spacing={GAP} alignment="top">
              {row.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  width={cardWidth}
                  onChange={(patch) => update(photo.id, patch)}
                  onDelete={() => remove(photo.id)}
                />
              ))}
              {/* Keeps a lone last card on the leading edge. */}
              {row.length === 1 ? <Spacer /> : null}
            </HStack>
          ))}
        </VStack>
      </ScrollView>
    </Host>
  );
}
