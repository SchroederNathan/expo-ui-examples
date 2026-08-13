import { Host, Icon } from '@expo/ui';
import { useEffect } from 'react';
import { StyleSheet, Text, View, useColorScheme, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { TIMING } from './timing';

const UPLOAD = Icon.select({ ios: 'square.and.arrow.up', android: require('./icons/upload.xml') });
const WATCH = Icon.select({ ios: 'applewatch', android: require('./icons/watch.xml') });

const ROW_HEIGHT = 44;
const ROW_GAP = 12;
// The section gap above the rows rides inside the animated height, so the
// collapsed island adds no dead space between description and button.
const TOP_GAP = 12;
const REVEAL_HEIGHT = TOP_GAP + ROW_HEIGHT * 2 + ROW_GAP;

// The sheet only animates its growth if the content height itself animates:
// iOS fitToContents snaps its detent to a newly measured size, and the M3
// sheet re-measures instantly, so natively-mounted rows would just pop in.
// Driving the reveal height with Reanimated inside this island feeds both
// platforms a continuous stream of content sizes — that is what makes the
// sheet visibly grow. The row icons stay universal Icon pairs by nesting a
// tiny Host per row back inside the island.
export function RowsReveal({ synced }: { synced: boolean }) {
  const progress = useSharedValue(0);
  const dark = useColorScheme() === 'dark';
  const { width } = useWindowDimensions();

  useEffect(() => {
    progress.set(withTiming(synced ? 1 : 0, TIMING));
  }, [synced, progress]);

  const revealStyle = useAnimatedStyle(() => ({
    height: progress.get() * REVEAL_HEIGHT,
    opacity: progress.get(),
  }));

  const iconColor = dark ? '#98989F' : '#6C6C70';
  const textColor = dark ? '#FFFFFF' : '#000000';

  return (
    // matchContents sizes the host to this view, so it needs an explicit
    // width: the sheet is screen-wide on phones and both platforms already
    // inset its content by 16.
    <Animated.View style={[styles.reveal, { width: width - 32 }, revealStyle]}>
      <Row
        icon={UPLOAD}
        iconColor={iconColor}
        textColor={textColor}
        text="Workouts you record here are saved to Apple Health."
      />
      <Row
        icon={WATCH}
        iconColor={iconColor}
        textColor={textColor}
        text="Runs from Apple Watch and other apps appear here."
      />
    </Animated.View>
  );
}

type RowProps = {
  icon: ReturnType<typeof Icon.select>;
  iconColor: string;
  textColor: string;
  text: string;
};

function Row({ icon, iconColor, textColor, text }: RowProps) {
  return (
    <View style={styles.row}>
      <Host style={styles.rowIcon}>
        <Icon name={icon} size={20} color={iconColor} />
      </Host>
      <Text style={[styles.rowText, { color: textColor }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  reveal: {
    overflow: 'hidden',
    paddingTop: TOP_GAP,
    gap: ROW_GAP,
  },
  row: {
    height: ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 14,
  },
  rowIcon: {
    width: 24,
    height: 24,
  },
  rowText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
});
