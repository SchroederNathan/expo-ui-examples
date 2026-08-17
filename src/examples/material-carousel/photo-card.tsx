import { Box, RNHostView, Text } from '@expo/ui/jetpack-compose';
import { align, clip, fillMaxWidth, height, padding, Shapes } from '@expo/ui/jetpack-compose/modifiers';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import type { Photo } from './photos';

// One carousel item, styled after the Material 3 spec sample: a photo clipped to
// the extra-large shape (28dp) with the title as plain white text in the
// bottom-left corner. The carousel strategy decides each item's width, so the
// card only fixes its height and fills the width it is given. There is no
// Compose Image component in @expo/ui — the photo is an expo-image hosted inside
// the Compose tree via RNHostView.
export function PhotoCard({ photo, cardHeight }: { photo: Photo; cardHeight: number }) {
  return (
    <Box
      modifiers={[
        fillMaxWidth(),
        height(cardHeight),
        clip(Shapes.RoundedCorner(28)),
        // Temporary local demo of the maskClip modifier from expo/expo#48852 —
        // needs the patched @expo/ui in node_modules, delete after recording.
        { $type: 'maskClip', shape: Shapes.RoundedCorner(28) },
      ]}>
      <RNHostView style={StyleSheet.absoluteFill}>
        <Image
          source={{ uri: photo.uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
      </RNHostView>
      <Text
        color="#FFFFFF"
        style={{
          typography: 'titleMedium',
          shadow: { color: '#000000AA', offsetY: 1, blurRadius: 4 },
        }}
        modifiers={[align('bottomStart'), padding(16, 0, 0, 16)]}>
        {photo.title}
      </Text>
    </Box>
  );
}
