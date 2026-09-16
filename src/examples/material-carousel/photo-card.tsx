import { Image } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, height, maskClip, Shapes } from '@expo/ui/jetpack-compose/modifiers';

import type { Photo } from './photos';

// One carousel item, styled after the Material 3 spec sample: a photo masked to
// the extra-large shape (28dp). maskClip (not clip) rounds the carousel's reveal
// mask itself, so peek items keep their corners while the strategy squeezes them.
// The carousel strategy decides each item's width, so the card only fixes its
// height and fills the width it is given. The photo renders with the Compose
// Image component, so the whole card stays inside the Compose tree.
export function PhotoCard({ photo, cardHeight }: { photo: Photo; cardHeight: number }) {
  return (
    <Image
      source={{ uri: photo.uri }}
      contentScale="crop"
      contentDescription={photo.title}
      modifiers={[fillMaxWidth(), height(cardHeight), maskClip(Shapes.RoundedCorner(28))]}
    />
  );
}
