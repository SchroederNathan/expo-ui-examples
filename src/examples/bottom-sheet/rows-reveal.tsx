import { Host, Icon } from '@expo/ui';
import { useEffect } from 'react';
import { StyleSheet, Text, View, useColorScheme, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { TIMING } from './timing';

const ROWS = [
  {
    icon: Icon.select({ ios: 'square.and.arrow.up', android: require('./icons/upload.xml') }),
    text: 'Every workout you record here is bragged about to Apple Health.',
  },
  {
    icon: Icon.select({ ios: 'applewatch', android: require('./icons/watch.xml') }),
    text: 'Your Apple Watch tattles on your heart rate in real time.',
  },
  {
    icon: Icon.select({ ios: 'flame', android: require('./icons/local_fire_department.xml') }),
    text: 'Calories burned scrolling this sheet count. All twelve of them.',
  },
  {
    icon: Icon.select({ ios: 'figure.walk', android: require('./icons/steps.xml') }),
    text: "Steps to the fridge sync as cardio. We don't judge.",
  },
];

export const ROW_COUNT = ROWS.length;

const ROW_HEIGHT = 44;
const ROW_GAP = 12;
// The section gap above the rows rides inside the animated height, so the
// collapsed island adds no dead space between description and button.
const TOP_GAP = 12;

function revealHeightFor(count: number) {
  return count === 0 ? 0 : TOP_GAP + count * ROW_HEIGHT + (count - 1) * ROW_GAP;
}

// The sheet only animates its growth if the content height itself animates:
// iOS fitToContents snaps its detent to a newly measured size, and the M3
// sheet re-measures instantly, so natively-mounted rows would just pop in.
// Driving the reveal height with Reanimated inside this island feeds both
// platforms a continuous stream of content sizes — that is what makes the
// sheet visibly grow. The row icons stay universal Icon pairs by nesting a
// tiny Host per row back inside the island.
export function RowsReveal({ count }: { count: number }) {
  const height = useSharedValue(0);
  const dark = useColorScheme() === 'dark';
  const { width } = useWindowDimensions();

  useEffect(() => {
    height.set(withTiming(revealHeightFor(count), TIMING));
  }, [count, height]);

  // Rows below the animated clip simply slide out from under it as the
  // height grows — every Continue press reveals the next batch.
  const revealStyle = useAnimatedStyle(() => ({
    height: height.get(),
  }));

  const iconColor = dark ? '#98989F' : '#6C6C70';
  const textColor = dark ? '#FFFFFF' : '#000000';

  return (
    // matchContents sizes the host to this view, so it needs an explicit
    // width: the sheet is screen-wide on phones and both platforms already
    // inset its content by 16.
    <Animated.View style={[styles.reveal, { width: width - 32 }, revealStyle]}>
      {ROWS.map((row) => (
        <Row
          key={row.text}
          icon={row.icon}
          iconColor={iconColor}
          textColor={textColor}
          text={row.text}
        />
      ))}
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
