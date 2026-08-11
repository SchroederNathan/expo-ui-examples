import { Image } from 'expo-image';
import { Link } from 'expo-router';
import {
  PlatformColor,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';

import { PHOTOS } from './photos';

const PADDING = 16;
const GAP = 16;

export function PhotoGrid() {
  const { width } = useWindowDimensions();
  const size = (width - PADDING * 2 - GAP) / 2;
  // `Link.AppleZoom` clones its child, and the clone rejects an array of styles —
  // flatten before handing the image over.
  const thumbnail = StyleSheet.flatten([styles.thumbnail, { height: size }]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={styles.scroll}>
      {PHOTOS.map((photo) => (
        <Link
          key={photo.id}
          href={{ pathname: '/apple-zoom/[id]', params: { id: photo.id } }}
          asChild>
          <Pressable style={{ width: size }}>
            {/*
              Only the image is wrapped, so the caption below stays put while the
              thumbnail flies to the next screen. `Link.AppleZoom` takes exactly
              one child.
            */}
            <Link.AppleZoom>
              <Image
                source={photo.uri}
                style={thumbnail}
                contentFit="cover"
                transition={200}
              />
            </Link.AppleZoom>
            <Text style={styles.caption} numberOfLines={1}>
              {photo.title}
            </Text>
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: PlatformColor('systemBackground'),
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: PADDING,
    gap: GAP,
  },
  thumbnail: {
    width: '100%',
    borderRadius: 16,
    // Held until the remote image arrives, so the grid never flashes empty.
    backgroundColor: PlatformColor('secondarySystemFill'),
  },
  caption: {
    marginTop: 8,
    fontSize: 13,
    color: PlatformColor('secondaryLabel'),
  },
});
