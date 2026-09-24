import LocalFireDepartment from '@expo/material-symbols/local_fire_department.xml';
import Steps from '@expo/material-symbols/steps.xml';
import Upload from '@expo/material-symbols/upload.xml';
import Watch from '@expo/material-symbols/watch.xml';
import { Column, Host, Icon, RNHostView } from '@expo/ui';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useSheetColors, type SheetColors } from './colors';
import { TIMING } from './timing';

const ROWS = [
  {
    icon: Icon.select({ ios: 'square.and.arrow.up', android: Upload }),
    text: 'Every workout you record here is bragged about to Apple Health.',
  },
  {
    icon: Icon.select({ ios: 'applewatch', android: Watch }),
    text: 'Your Apple Watch tattles on your heart rate in real time.',
  },
  {
    icon: Icon.select({ ios: 'flame', android: LocalFireDepartment }),
    text: 'Calories burned scrolling this sheet count. All twelve of them.',
  },
  {
    icon: Icon.select({ ios: 'figure.walk', android: Steps }),
    text: "Steps to the fridge sync as cardio. We don't judge.",
  },
];

export const ROW_COUNT = ROWS.length;

// The reveal height is computed, not measured, so every row has a fixed
// height: two lines of text, never more. It grows with the system text size so
// the second line still fits at large Dynamic Type / font scale settings.
const MIN_ROW_HEIGHT = 44;
const LINE_HEIGHT = 20;
const MAX_LINES = 2;
const ROW_GAP = 12;
// The section gap above the rows rides inside the animated height, so the
// collapsed island adds no dead space between description and button.
const TOP_GAP = 12;

function rowHeightFor(fontScale: number) {
  return Math.max(MIN_ROW_HEIGHT, Math.ceil(MAX_LINES * LINE_HEIGHT * fontScale));
}

function revealHeightFor(count: number, rowHeight: number) {
  return count === 0 ? 0 : TOP_GAP + count * rowHeight + (count - 1) * ROW_GAP;
}

// matchContents sizes the island to its RN content, so the rows need an
// explicit width, and the window can't supply it: the sheet is screen-wide
// only on a regular phone. It sits inside the horizontal safe area (iPhone
// Duo's folded display gives up an 84pt sensor column) and floats as a narrow
// card on a wide display (the unfolded Duo, tablets). An island wider than
// the sheet's column overflows both edges. So a zero-height probe island —
// which fills whatever its parent offers — reads the real content width, and
// the rows take exactly that. Until the probe reports, the rows island is not
// mounted at all: a 0-wide island collapses, then jumps to full width.
export function RowsReveal({ count }: { count: number }) {
  const [width, setWidth] = useState(0);

  const onProbeLayout = (event: LayoutChangeEvent) => {
    const next = Math.floor(event.nativeEvent.layout.width);
    // A transient 0 (before presentation, mid-dismissal) would collapse the rows.
    if (next > 0) {
      setWidth(next);
    }
  };

  return (
    <Column spacing={0}>
      <Column style={{ height: 0 }}>
        <RNHostView onLayout={onProbeLayout}>
          <View />
        </RNHostView>
      </Column>
      {width > 0 && (
        <RNHostView matchContents>
          <RevealRows count={count} width={width} />
        </RNHostView>
      )}
    </Column>
  );
}

// The sheet only animates its growth if the content height itself animates:
// iOS fitToContents snaps its detent to a newly measured size, and the M3
// sheet re-measures instantly, so natively-mounted rows would just pop in.
// Driving the reveal height with Reanimated inside this island feeds both
// platforms a continuous stream of content sizes — that is what makes the
// sheet visibly grow. The row icons stay universal Icon pairs by nesting a
// tiny Host per row back inside the island.
function RevealRows({ count, width }: { count: number; width: number }) {
  const height = useSharedValue(0);
  const colors = useSheetColors();
  const rowHeight = rowHeightFor(useWindowDimensions().fontScale);

  useEffect(() => {
    height.set(withTiming(revealHeightFor(count, rowHeight), TIMING));
  }, [count, rowHeight, height]);

  // Rows below the animated clip simply slide out from under it as the
  // height grows — every Continue press reveals the next batch.
  const revealStyle = useAnimatedStyle(() => ({
    height: height.get(),
  }));

  return (
    <Animated.View style={[styles.reveal, { width }, revealStyle]}>
      {ROWS.map((row) => (
        <Row key={row.text} icon={row.icon} text={row.text} height={rowHeight} colors={colors} />
      ))}
    </Animated.View>
  );
}

type RowProps = {
  icon: ReturnType<typeof Icon.select>;
  text: string;
  height: number;
  colors: SheetColors;
};

function Row({ icon, text, height, colors }: RowProps) {
  return (
    <View style={[styles.row, { height }]}>
      <Host style={styles.rowIcon}>
        <Icon name={icon} size={20} color={colors.secondaryLabel} />
      </Host>
      <Text numberOfLines={MAX_LINES} style={[styles.rowText, { color: colors.label }]}>
        {text}
      </Text>
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
    lineHeight: LINE_HEIGHT,
  },
});
