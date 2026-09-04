import { Column, Host, Row, Surface, useMaterialColors } from '@expo/ui/jetpack-compose';
import {
  animateContentSize,
  fillMaxSize,
  fillMaxWidth,
  padding,
  verticalScroll,
} from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';
import { useWindowDimensions } from 'react-native';

import { BUTTON_OVERHANG, PhotoCard } from './photo-card';
import { PHOTOS, type Photo } from './photos';

export type Album = 'Travel' | 'Family' | 'Work';
export type CardPhoto = Photo & { favorite: boolean; album: Album | null };

const PADDING = 16;
const GAP = 16;

// Dropdown Menu — a grid of photo cards, each with a ⋮ icon button that opens a
// Material 3 DropdownMenu anchored to it. This is the same grid as the iOS
// Pull-Down Menu example, so the two screens can be shown side by side with each
// platform's own menu. Android only. Fully self-contained; drop this folder into
// any Expo SDK 57 project.
export default function DropdownMenuScreen() {
  const colors = useMaterialColors();
  const { width } = useWindowDimensions();
  const cardWidth = (width - PADDING * 2 - GAP) / 2;

  const [photos, setPhotos] = useState<CardPhoto[]>(() =>
    PHOTOS.map((photo) => ({ ...photo, favorite: false, album: null }))
  );
  // One menu open at a time, keyed by card. The button writes here and every
  // item click plus the outside tap clears it.
  const [openId, setOpenId] = useState<string | null>(null);

  const update = (id: string, patch: Partial<CardPhoto>) =>
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const remove = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  const rows: CardPhoto[][] = [];
  for (let i = 0; i < photos.length; i += 2) rows.push(photos.slice(i, i + 2));

  return (
    <Host style={{ flex: 1 }}>
      <Surface color={colors.background} modifiers={[fillMaxSize()]}>
        {/* Each card is BUTTON_OVERHANG wider than its photo (see PhotoCard), so the
            column gap and the end padding give that back — the photos land exactly
            where the iOS grid puts them. */}
        <Column
          modifiers={[
            fillMaxWidth(),
            verticalScroll(),
            padding(PADDING, PADDING, PADDING - BUTTON_OVERHANG, PADDING * 2),
            animateContentSize(),
          ]}
          verticalArrangement={{ spacedBy: GAP }}>
          {rows.map((row) => (
            <Row
              key={row[0].id}
              horizontalArrangement={{ spacedBy: GAP - BUTTON_OVERHANG }}
              verticalAlignment="top">
              {row.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  colors={colors}
                  width={cardWidth}
                  open={openId === photo.id}
                  onOpen={() => setOpenId(photo.id)}
                  onClose={() => setOpenId(null)}
                  onChange={(patch) => update(photo.id, patch)}
                  onDelete={() => remove(photo.id)}
                />
              ))}
            </Row>
          ))}
        </Column>
      </Surface>
    </Host>
  );
}
