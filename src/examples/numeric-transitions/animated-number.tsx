import { Text } from '@expo/ui/swift-ui';
import {
  Animation,
  animation,
  contentTransition,
  font,
  monospacedDigit,
} from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';

type AnimatedNumberProps = {
  value: number;
  size?: number;
};

// Must be rendered inside a SwiftUI tree (a Host).
export function AnimatedNumber({ value, size = 84 }: AnimatedNumberProps) {
  const [prev, setPrev] = useState(value);
  const [countsDown, setCountsDown] = useState(false);
  if (prev !== value) {
    setCountsDown(value < prev);
    setPrev(value);
  }

  return (
    <Text
      modifiers={[
        font({ size, weight: 'bold', design: 'rounded' }),
        contentTransition('numericText', { countsDown }),
        animation(Animation.spring(), value),
        monospacedDigit(),
      ]}>
      {value.toLocaleString('en-US')}
    </Text>
  );
}
