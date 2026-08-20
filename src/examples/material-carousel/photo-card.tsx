import { Box, RNHostView } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, height, maskClip, Shapes } from '@expo/ui/jetpack-compose/modifiers';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import type { Photo } from './photos';

// One carousel item, styled after the Material 3 spec sample: a photo masked to
// the extra-large shape (28dp). maskClip (not clip) rounds the carousel's reveal
// mask itself, so peek items keep their corners while the strategy squeezes them.
// The carousel strategy decides each item's width, so the card only fixes its
// height and fills the width it is given. There is no Compose Image component in
// @expo/ui — the photo is an expo-image hosted inside the Compose tree via
// RNHostView.
export function PhotoCard({ photo, cardHeight }: { photo: Photo; cardHeight: number }) {
  return (
    <Box modifiers={[fillMaxWidth(), height(cardHeight), maskClip(Shapes.RoundedCorner(28))]}>
      <RNHostView style={StyleSheet.absoluteFill}>
        <Image
          source={{ uri: photo.uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
      </RNHostView>
    </Box>
  );
}
