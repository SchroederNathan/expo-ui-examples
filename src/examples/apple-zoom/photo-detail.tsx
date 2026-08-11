import { Image } from 'expo-image';
import { Link, Redirect, Stack, useLocalSearchParams } from 'expo-router';
import { PlatformColor, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PHOTOS } from './photos';

// The destination of the zoom transition. It is reached through
// `src/app/apple-zoom/[id].tsx`, because the transition needs a real push onto
// the router's Stack.
export default function PhotoDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const photo = PHOTOS.find((p) => p.id === id);

  // Same guard as `src/app/[slug].tsx`: an unknown id goes back to the list.
  if (!photo) {
    return <Redirect href="/" />;
  }

  // The photo's own aspect ratio, scaled to fit the screen. Known on the first
  // render, so the zoom lands on the final frame instead of correcting itself.
  const scale = Math.min(window.width / photo.width, window.height / photo.height);
  const fitted = { width: photo.width * scale, height: photo.height * scale };

  return (
    <View style={styles.container}>
      {/*
        The zoom transition and a navigation bar fight over the same animation on
        iOS, so the destination runs headerless. Swiping down dismisses it, which
        rewinds the zoom back into the thumbnail.
      */}
      <Stack.Screen options={{ headerShown: false }} />

      <Link.AppleZoomTarget>
        <View style={fitted}>
          <Image source={photo.uri} style={styles.image} contentFit="cover" />
        </View>
      </Link.AppleZoomTarget>

      <View style={[styles.caption, { bottom: insets.bottom + 24 }]}>
        <Text style={styles.title}>{photo.title}</Text>
        <Text style={styles.hint}>Swipe down to dismiss</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PlatformColor('systemBackground'),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  caption: {
    position: 'absolute',
    alignItems: 'center',
    gap: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: PlatformColor('label'),
  },
  hint: {
    fontSize: 13,
    color: PlatformColor('secondaryLabel'),
  },
});
