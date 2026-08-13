import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { TIMING } from './timing';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const APP_ICON = require('@/assets/images/icon.png');
const HEALTH_ICON = require('@/assets/images/apple-health-icon.png');

const ICON_SIZE = 64;
// How far the Health icon slides out from behind the app icon.
const TRAVEL = 56;
// Breathing room for the rotated icons' corners: the Compose host clips the
// island to its bounds, so they need space to swing inside it instead of
// getting shaved off. The left edge only gets a sliver — the stack has to
// stay visually flush with the title below it, and the rounded corners keep
// a 6° tilt inside 2px.
const PAD = 10;
const LEFT_PAD = 2;

// The universal layer has no Image component and no transform/animation
// surface at all, so the icon pair lives in an RNHostView island: plain RN
// views driven by Reanimated, identical on both platforms. The Health icon
// starts exactly underneath the app icon — fully occluded, so "invisible" —
// and springs out to the right when `synced` flips.
export function IconStack({ synced }: { synced: boolean }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(withTiming(synced ? 1 : 0, TIMING));
  }, [synced, progress]);

  const appIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(progress.get(), [0, 1], [0, -6])}deg` }],
  }));

  const healthIconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.get(), [0, 1], [0, TRAVEL]) },
      { rotate: `${interpolate(progress.get(), [0, 1], [0, 8])}deg` },
    ],
  }));

  return (
    <View style={styles.stage}>
      <AnimatedImage source={HEALTH_ICON} style={[styles.icon, styles.health, healthIconStyle]} />
      <AnimatedImage source={APP_ICON} style={[styles.icon, appIconStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: LEFT_PAD + ICON_SIZE + TRAVEL + PAD,
    height: PAD + ICON_SIZE + PAD,
  },
  icon: {
    position: 'absolute',
    left: LEFT_PAD,
    top: PAD,
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 14,
  },
  health: {
    // A hairline keeps the white tile visible against the sheet once it
    // slides out; while stacked it sits entirely behind the app icon.
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.15)',
  },
});
