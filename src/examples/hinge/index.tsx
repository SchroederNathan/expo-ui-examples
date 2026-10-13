import { Host } from '@expo/ui';
import { ArrangementView, Overlay, VStack } from '@expo/ui/swift-ui';
import { arrangementViewStyle, frame, ignoreSafeArea, tint } from '@expo/ui/swift-ui/modifiers';
import { isAvailable, useHinge, type HingeStatus } from 'expo-hinge';
import { Color, Stack } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnglePanel } from './angle-panel';
import { ArrangementPicker, type LayoutAxes } from './arrangement-picker';
import { ReadingsForm } from './readings-form';
import { TopFade, FADE_HEIGHT } from './top-fade';
import { useHingeSession } from './use-hinge-session';

const fill = frame({ maxWidth: Infinity, maxHeight: Infinity });
const postures: Record<HingeStatus, string> = {
  closed: 'Closed',
  partiallyOpen: 'Partially open',
  fullyOpen: 'Fully open',
  unknown: 'Unknown',
};

export default function HingeScreen() {
  const hinge = useHinge();
  const available = isAvailable();
  const { session, reset } = useHingeSession();
  const [axes, setAxes] = useState<LayoutAxes>('both');
  const supportsArrangement = Number.parseFloat(String(Platform.Version)) >= 27.1;
  const stacked = !supportsArrangement || axes === 'vertical';
  const posture = hinge ? postures[hinge.status] : available ? 'No reading' : 'Unavailable';

  const { width } = useWindowDimensions();
  const safeArea = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const [pickerHeight, setPickerHeight] = useState(56);
  const [detailsFrame, setDetailsFrame] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const contentTop = headerHeight + pickerHeight + FADE_HEIGHT / 2;
  const sideBySide = !stacked && detailsFrame.x > safeArea.left;
  const pickerOnRight = sideBySide && hinge?.status === 'partiallyOpen';
  const availableWidth = width - safeArea.left - safeArea.right;
  const detailsWidth = Math.max(
    0,
    Math.min(detailsFrame.x + detailsFrame.width, width - safeArea.right) -
      Math.max(detailsFrame.x, safeArea.left)
  );
  const pickerWidth = pickerOnRight && detailsWidth > 0 ? detailsWidth : availableWidth;

  const primary = (
    <AnglePanel hinge={hinge} posture={posture} contentTop={contentTop} stacked={stacked} />
  );
  const secondary = (
    <ReadingsForm
      hinge={hinge}
      posture={posture}
      available={available}
      session={session}
      onReset={reset}
      sideBySide={sideBySide}
      topInset={Math.max(0, contentTop - detailsFrame.y)}
      onFrameChange={setDetailsFrame}
    />
  );

  return (
    <>
      <Stack.Screen options={{ headerTintColor: Color.ios.systemBlue }} />
      <Host style={{ flex: 1, backgroundColor: Color.ios.systemGroupedBackground }}>
        <Overlay
          alignment="top"
          modifiers={[
            fill,
            tint(Color.ios.systemBlue),
            ignoreSafeArea({ regions: 'container', edges: 'top' }),
          ]}>
          <TopFade contentTop={contentTop}>
            {stacked ? (
              // A vertical-only ArrangementView collapses on Duo's compact-height display.
              <VStack spacing={0} modifiers={[fill]}>
                {primary}
                {secondary}
              </VStack>
            ) : (
              <ArrangementView modifiers={[arrangementViewStyle('split', { axes }), fill]}>
                <ArrangementView.Primary>{primary}</ArrangementView.Primary>
                <ArrangementView.Secondary>{secondary}</ArrangementView.Secondary>
              </ArrangementView>
            )}
          </TopFade>
          <Overlay.Content>
            <ArrangementPicker
              selection={axes}
              onSelectionChange={setAxes}
              width={pickerWidth}
              headerHeight={headerHeight}
              onHeightChange={setPickerHeight}
              supportsArrangement={supportsArrangement}
            />
          </Overlay.Content>
        </Overlay>
      </Host>
    </>
  );
}
