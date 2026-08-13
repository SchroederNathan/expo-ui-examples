import { Box, RNHostView, Text } from '@expo/ui/jetpack-compose';
import {
  align,
  background,
  clip,
  fillMaxWidth,
  height,
  padding,
  Shapes,
} from '@expo/ui/jetpack-compose/modifiers';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import type { Photo } from './photos';

// One carousel item: a photo clipped to the Material 3 extra-large shape (28dp)
// with the title in a pill riding the bottom-left corner. The carousel strategy
// decides each item's width, so the card only fixes its height and fills the
// width it is given. There is no Compose Image component in @expo/ui — the photo
// is an expo-image hosted inside the Compose tree via RNHostView.
export function PhotoCard({ photo, cardHeight }: { photo: Photo; cardHeight: number }) {
  return (
    <Box modifiers={[fillMaxWidth(), height(cardHeight), clip(Shapes.RoundedCorner(28))]}>
      <RNHostView style={StyleSheet.absoluteFill}>
        <Image
          source={{ uri: photo.uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
      </RNHostView>
      <Box
        modifiers={[
          align('bottomStart'),
          padding(12, 0, 0, 12),
          clip(Shapes.RoundedCorner(50)),
          background('#000000A6'),
        ]}>
        <Text color="#FFFFFF" style={{ typography: 'labelMedium' }} modifiers={[padding(12, 6, 12, 6)]}>
          {photo.title}
        </Text>
      </Box>
    </Box>
  );
}
