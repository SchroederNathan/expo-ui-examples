import { HStack, Picker, Spacer, Text } from '@expo/ui/swift-ui';
import {
  Animation,
  animation,
  disabled,
  frame,
  onGeometryChange,
  padding,
  pickerStyle,
  tag,
} from '@expo/ui/swift-ui/modifiers';
import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export type LayoutAxes = 'both' | 'horizontal' | 'vertical';

type ArrangementPickerProps = {
  selection: LayoutAxes;
  onSelectionChange: (selection: LayoutAxes) => void;
  width: number;
  headerHeight: number;
  onHeightChange: (height: number) => void;
  supportsArrangement: boolean;
};

export function ArrangementPicker({
  selection,
  onSelectionChange,
  width,
  headerHeight,
  onHeightChange,
  supportsArrangement,
}: ArrangementPickerProps) {
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    let active = true;
    const update = (enabled: boolean) => {
      if (active) setReduceMotion(enabled);
    };
    void AccessibilityInfo.isReduceMotionEnabled().then(update);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', update);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return (
    <HStack
      spacing={0}
      modifiers={[
        frame({ maxWidth: Infinity }),
        animation(reduceMotion ? Animation.linear({ duration: 0 }) : Animation.easeInOut(), width),
      ]}>
      <Spacer minLength={0} />
      <Picker
        label="Arrangement"
        selection={selection}
        onSelectionChange={onSelectionChange}
        modifiers={[
          pickerStyle('segmented'),
          padding({ horizontal: 20, vertical: 12 }),
          frame({ width }),
          onGeometryChange(({ height }) => onHeightChange(height)),
          padding({ top: headerHeight }),
          disabled(!supportsArrangement),
        ]}>
        <Text modifiers={[tag('both')]}>Adaptive</Text>
        <Text modifiers={[tag('horizontal')]}>Side by side</Text>
        <Text modifiers={[tag('vertical')]}>Stacked</Text>
      </Picker>
    </HStack>
  );
}
