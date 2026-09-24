import { Image } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, height, maskClip, Shapes } from '@expo/ui/jetpack-compose/modifiers';

import type { Photo } from './photos';

// One carousel item: a photo masked to the Material 3 extra-large shape (28dp).
// `maskClip` (not `clip`) rounds the carousel's reveal mask itself, so peek items
// keep their corners while the strategy squeezes them. The strategy sets the width.
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
