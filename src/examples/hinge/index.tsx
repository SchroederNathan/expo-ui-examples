import { Host } from '@expo/ui';
import {
  ArrangementView,
  Button,
  Form,
  HStack,
  LabeledContent,
  Mask,
  Overlay,
  Rectangle,
  ScrollView,
  Section,
  Spacer,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import {
  accessibilityHidden,
  accessibilityIdentifier,
  accessibilityLabel,
  arrangementViewStyle,
  background,
  buttonStyle,
  disabled,
  font,
  foregroundStyle,
  frame,
  ignoreSafeArea,
  listSectionMargins,
  listSectionSpacing,
  minimumScaleFactor,
  monospacedDigit,
  onGeometryChange,
  padding,
  splitArrangementLayoutSize,
  textSelection,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { isAvailable, useHinge, type Hinge, type HingeStatus } from 'expo-hinge';
import { Color, Stack } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrangementPicker, type LayoutAxes } from './arrangement-picker';
import { useHingeSession } from './use-hinge-session';

const BACKGROUND = Color.ios.systemGroupedBackground;
const FILL = frame({ maxWidth: Infinity, maxHeight: Infinity });
const SECONDARY = foregroundStyle({ type: 'hierarchical', style: 'secondary' });
const SECTION_MARGIN = listSectionMargins({ edges: 'leading', length: 20 });
const VALUE = [SECONDARY, monospacedDigit(), textSelection(true)];
const FADE_HEIGHT = 32;

const POSTURES: Record<HingeStatus, string> = {
  closed: 'Closed',
  partiallyOpen: 'Partially open',
  fullyOpen: 'Fully open',
  unknown: 'Unknown',
};

function AnglePanel({
  hinge,
  available,
  controlsBottom,
  supportsArrangement,
  stacked,
}: {
  hinge: Hinge | null;
  available: boolean;
  controlsBottom: number;
  supportsArrangement: boolean;
  stacked: boolean;
}) {
  const [panel, setPanel] = useState({ y: 0, height: 0 });
  const topInset = Math.max(0, controlsBottom - panel.y);
  const availableHeight = Math.max(0, panel.height - topInset);
  const compact = availableHeight < 400;

  return (
    <ScrollView
      showsIndicators={false}
      modifiers={[
        frame({ maxWidth: Infinity, maxHeight: stacked ? controlsBottom + 180 : Infinity }),
        background(BACKGROUND),
        onGeometryChange(({ y, height }) => setPanel({ y, height })),
        ...(supportsArrangement
          ? [
              splitArrangementLayoutSize({
                minHeight: controlsBottom + 144,
                idealHeight: controlsBottom + 160,
                maxHeight: controlsBottom + 180,
              }),
            ]
          : []),
      ]}>
      <VStack
        spacing={8}
        modifiers={[
          frame({ minHeight: Math.max(0, availableHeight - 24), maxWidth: Infinity }),
          padding({ horizontal: 28, top: topInset + 12, bottom: 12 }),
        ]}>
        <Text modifiers={[font({ textStyle: 'caption' }), SECONDARY]}>Hinge angle</Text>
        <Text
          modifiers={[
            font({ size: compact ? 80 : 120, weight: 'light' }),
            monospacedDigit(),
            textSelection(true),
            minimumScaleFactor(0.5),
            accessibilityLabel(
              hinge ? `Hinge angle, ${hinge.angle.toFixed(1)} degrees` : 'Hinge angle unavailable'
            ),
            accessibilityIdentifier('hinge-angle'),
          ]}>
          {hinge ? `${compact ? hinge.angle.toFixed(1) : Math.round(hinge.angle)}°` : '—'}
        </Text>
        <Text
          modifiers={[
            font({ textStyle: compact ? 'body' : 'title3' }),
            SECONDARY,
            accessibilityIdentifier('hinge-posture'),
          ]}>
          {hinge ? POSTURES[hinge.status] : available ? 'No reading' : 'Unavailable'}
        </Text>
      </VStack>
    </ScrollView>
  );
}

export default function HingeScreen() {
  const hinge = useHinge();
  const available = isAvailable();
  const { session, reset } = useHingeSession();
  const [axes, setAxes] = useState<LayoutAxes>('both');
  const { width } = useWindowDimensions();
  const safeArea = useSafeAreaInsets();
  const wide = width >= 700 && axes !== 'vertical';
  const pickerOnRight = wide && hinge?.status === 'partiallyOpen';
  const headerHeight = useHeaderHeight();
  const [pickerHeight, setPickerHeight] = useState(56);
  const [formGeometry, setFormGeometry] = useState({ x: 0, y: 0, width: 0 });
  // A stacked secondary pane is already below the controls; only overlapping panes need an inset.
  const controlsBottom = headerHeight + pickerHeight + FADE_HEIGHT / 2;
  const formTopInset = Math.max(0, controlsBottom - formGeometry.y);
  const pickerWidth = Math.max(
    0,
    Math.min(formGeometry.x + formGeometry.width, width - safeArea.right) -
      Math.max(formGeometry.x, safeArea.left)
  );
  const controlsWidth =
    pickerOnRight && pickerWidth > 0 ? pickerWidth : width - safeArea.left - safeArea.right;
  const supportsArrangement = Number.parseFloat(String(Platform.Version)) >= 27.1;

  const primary = (
    <AnglePanel
      hinge={hinge}
      available={available}
      controlsBottom={controlsBottom}
      supportsArrangement={supportsArrangement}
      stacked={axes === 'vertical'}
    />
  );
  const secondary = (
    <Form
      modifiers={[
        FILL,
        listSectionSpacing('compact'),
        onGeometryChange(({ x, y, width }) => setFormGeometry({ x, y, width })),
        ...(supportsArrangement
          ? [splitArrangementLayoutSize({ minWidth: 280, idealWidth: 340, maxWidth: 420 })]
          : []),
      ]}>
      <Section
        header={
          <Text modifiers={[font({ textStyle: 'caption' }), padding({ top: formTopInset })]}>
            Readings
          </Text>
        }
        modifiers={[SECTION_MARGIN]}>
        {wide && (
          <LabeledContent label="Angle">
            <Text modifiers={VALUE}>{hinge ? `${hinge.angle.toFixed(1)}°` : 'Unavailable'}</Text>
          </LabeledContent>
        )}
        <LabeledContent label="System status">
          <Text modifiers={VALUE}>{hinge ? POSTURES[hinge.status] : 'Unavailable'}</Text>
        </LabeledContent>
        <LabeledContent label="API available">
          <Text modifiers={VALUE}>{available ? 'Yes' : 'No'}</Text>
        </LabeledContent>
        {wide && (
          <LabeledContent label="Layout">
            <Text modifiers={VALUE}>{supportsArrangement ? 'Split' : 'Stacked'}</Text>
          </LabeledContent>
        )}
      </Section>

      <Section
        header={
          <HStack>
            <Text modifiers={[font({ textStyle: 'caption' })]}>This session</Text>
            <Spacer />
            <Button
              label="Reset"
              onPress={reset}
              modifiers={[
                buttonStyle('plain'),
                foregroundStyle(Color.ios.systemBlue),
                font({ textStyle: 'subheadline' }),
                frame({ minHeight: 44 }),
                accessibilityLabel('Reset session'),
                accessibilityIdentifier('hinge-reset'),
                disabled(!hinge && session.events === 0),
              ]}
            />
          </HStack>
        }
        modifiers={[SECTION_MARGIN]}>
        <LabeledContent label="Lowest">
          <Text modifiers={VALUE}>
            {session.minimum === null ? 'No samples' : `${session.minimum.toFixed(1)}°`}
          </Text>
        </LabeledContent>
        <LabeledContent label="Highest">
          <Text modifiers={VALUE}>
            {session.maximum === null ? 'No samples' : `${session.maximum.toFixed(1)}°`}
          </Text>
        </LabeledContent>
        <LabeledContent label="Events">
          <Text modifiers={[...VALUE, accessibilityIdentifier('hinge-event-count')]}>
            {session.events.toLocaleString()}
          </Text>
        </LabeledContent>
      </Section>
    </Form>
  );

  return (
    <>
      <Stack.Screen options={{ headerTintColor: Color.ios.systemBlue }} />
      <Host style={{ flex: 1, backgroundColor: BACKGROUND }}>
        <Overlay
          alignment="top"
          modifiers={[
            FILL,
            tint(Color.ios.systemBlue),
            ignoreSafeArea({ regions: 'container', edges: 'top' }),
          ]}>
          <Mask alignment="top" modifiers={[FILL]}>
            {supportsArrangement && axes !== 'vertical' ? (
              <ArrangementView modifiers={[arrangementViewStyle('split', { axes }), FILL]}>
                <ArrangementView.Primary>{primary}</ArrangementView.Primary>
                <ArrangementView.Secondary>{secondary}</ArrangementView.Secondary>
              </ArrangementView>
            ) : (
              // A vertical-only ArrangementView collapses on the Duo's compact-height display.
              <VStack spacing={0} modifiers={[FILL]}>
                {primary}
                {secondary}
              </VStack>
            )}
            <Mask.Content>
              {/* Cover the whole viewport, including the Duo's side and bottom safe areas. */}
              <VStack spacing={0} modifiers={[FILL, ignoreSafeArea(), accessibilityHidden()]}>
                <Rectangle
                  modifiers={[
                    frame({ height: headerHeight + pickerHeight - FADE_HEIGHT / 2 }),
                    foregroundStyle('clear'),
                  ]}
                />
                <Rectangle
                  modifiers={[
                    frame({ height: FADE_HEIGHT }),
                    foregroundStyle({
                      type: 'linearGradient',
                      colors: ['#00000000', '#000000'],
                      startPoint: { x: 0, y: 0 },
                      endPoint: { x: 0, y: 1 },
                    }),
                  ]}
                />
                <Rectangle modifiers={[FILL, foregroundStyle('#000000')]} />
              </VStack>
            </Mask.Content>
          </Mask>
          <Overlay.Content>
            <ArrangementPicker
              selection={axes}
              onSelectionChange={setAxes}
              width={controlsWidth}
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
