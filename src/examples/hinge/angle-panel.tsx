import { ScrollView, Text, VStack } from '@expo/ui/swift-ui';
import {
  accessibilityIdentifier,
  accessibilityLabel,
  background,
  font,
  foregroundStyle,
  frame,
  minimumScaleFactor,
  monospacedDigit,
  onGeometryChange,
  padding,
  splitArrangementLayoutSize,
  textSelection,
} from '@expo/ui/swift-ui/modifiers';
import type { Hinge } from 'expo-hinge';
import { Color } from 'expo-router';
import { useState } from 'react';

const secondary = foregroundStyle({ type: 'hierarchical', style: 'secondary' });

type AnglePanelProps = {
  hinge: Hinge | null;
  posture: string;
  contentTop: number;
  stacked: boolean;
};

export function AnglePanel({ hinge, posture, contentTop, stacked }: AnglePanelProps) {
  const [panel, setPanel] = useState({ y: 0, height: 0 });
  const topInset = Math.max(0, contentTop - panel.y);
  const availableHeight = Math.max(0, panel.height - topInset);
  const compact = availableHeight < 400;

  return (
    <ScrollView
      showsIndicators={false}
      modifiers={[
        frame({ maxWidth: Infinity, maxHeight: stacked ? contentTop + 180 : Infinity }),
        background(Color.ios.systemGroupedBackground),
        onGeometryChange(({ y, height }) => setPanel({ y, height })),
        splitArrangementLayoutSize({
          minHeight: contentTop + 144,
          idealHeight: contentTop + 160,
          maxHeight: contentTop + 180,
        }),
      ]}>
      <VStack
        spacing={8}
        modifiers={[
          frame({ minHeight: Math.max(0, availableHeight - 24), maxWidth: Infinity }),
          padding({ horizontal: 28, top: topInset + 12, bottom: 12 }),
        ]}>
        <Text modifiers={[font({ textStyle: 'caption' }), secondary]}>Hinge angle</Text>
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
            secondary,
            accessibilityIdentifier('hinge-posture'),
          ]}>
          {posture}
        </Text>
      </VStack>
    </ScrollView>
  );
}
