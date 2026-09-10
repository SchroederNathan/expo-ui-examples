import { Host } from '@expo/ui';
import {
  Gauge,
  HStack,
  Image,
  Label,
  Slider,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import {
  Animation,
  animation,
  font,
  foregroundStyle,
  frame,
  gaugeStyle,
  glassEffect,
  monospacedDigit,
  padding,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';

const STORAGE_GB = 128;
const STEP_GOAL = 10_000;

// One slider drives every gauge so simulator recordings show live animation.
// circular / circularCapacity / linear / linearCapacity each get a fitness-themed slot.
export default function GaugesScreen() {
  const [level, setLevel] = useState(0.62);

  const percent = Math.round(level * 100);
  const steps = Math.round(level * STEP_GOAL);
  const storageGb = level * STORAGE_GB;

  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={28} modifiers={[padding({ all: 24 })]}>
        <VStack spacing={4}>
          <Text modifiers={[font({ textStyle: 'title2', weight: 'bold' })]}>Wellness</Text>
          <Text
            modifiers={[
              font({ textStyle: 'subheadline' }),
              foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
            ]}>
            Activity, battery, and storage — one shared value.
          </Text>
        </VStack>

        <HStack spacing={28}>
          <Gauge
            value={percent}
            min={0}
            max={100}
            currentValueLabel={
              <Text modifiers={[font({ textStyle: 'title3', weight: 'semibold' }), monospacedDigit()]}>
                {percent}%
              </Text>
            }
            minimumValueLabel={<Text modifiers={[font({ textStyle: 'caption2' })]}>0</Text>}
            maximumValueLabel={<Text modifiers={[font({ textStyle: 'caption2' })]}>100</Text>}
            modifiers={[
              gaugeStyle('circular'),
              tint('#FF375F'),
              frame({ width: 132, height: 132 }),
              animation(Animation.spring({ duration: 0.35 }), level),
            ]}>
            <Label title="Move" systemImage="figure.run" />
          </Gauge>

          <Gauge
            value={level}
            currentValueLabel={
              <Text modifiers={[font({ textStyle: 'caption', weight: 'semibold' }), monospacedDigit()]}>
                {percent}%
              </Text>
            }
            modifiers={[
              gaugeStyle('circularCapacity'),
              tint('#30D158'),
              frame({ width: 88, height: 88 }),
              animation(Animation.spring({ duration: 0.35 }), level),
            ]}>
            <Image systemName="battery.100percent.bolt" size={14} />
          </Gauge>
        </HStack>

        <Gauge
          value={storageGb}
          min={0}
          max={STORAGE_GB}
          currentValueLabel={
            <Text modifiers={[font({ textStyle: 'footnote' }), monospacedDigit()]}>
              {storageGb.toFixed(1)} GB
            </Text>
          }
          minimumValueLabel={<Text modifiers={[font({ textStyle: 'caption2' })]}>0</Text>}
          maximumValueLabel={
            <Text modifiers={[font({ textStyle: 'caption2' })]}>{STORAGE_GB}</Text>
          }
          modifiers={[
            gaugeStyle('linearCapacity'),
            tint('#5E5CE6'),
            animation(Animation.spring({ duration: 0.35 }), level),
          ]}>
          <Label title="iCloud" systemImage="icloud.fill" />
        </Gauge>

        <Gauge
          value={level}
          modifiers={[
            gaugeStyle('linear'),
            tint('#FF9F0A'),
            frame({ height: 10 }),
            animation(Animation.spring({ duration: 0.35 }), level),
          ]}>
          <Label title="Workout intensity" systemImage="flame.fill" />
        </Gauge>

        <VStack
          spacing={12}
          modifiers={[
            padding({ top: 16, bottom: 16, leading: 20, trailing: 20 }),
            glassEffect({ shape: 'roundedRectangle', cornerRadius: 20 }),
          ]}>
          <HStack spacing={12}>
            <Image systemName="minus.circle" size={14} />
            <Slider value={level} min={0} max={1} onValueChange={setLevel} />
            <Image systemName="plus.circle" size={14} />
          </HStack>
          <Text
            modifiers={[
              font({ textStyle: 'caption' }),
              foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
              monospacedDigit(),
            ]}>
            {percent}% · {steps.toLocaleString()} steps · {storageGb.toFixed(1)} GB
          </Text>
        </VStack>
      </VStack>
    </Host>
  );
}
