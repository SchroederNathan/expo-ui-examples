import { Host } from '@expo/ui';
import { Button, HStack, Image, VStack } from '@expo/ui/swift-ui';
import {
  buttonBorderShape,
  buttonStyle,
  controlSize,
  frame,
} from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';

import { AnimatedNumber } from './animated-number';

const STEP = 123;

export default function NumericTransitionsScreen() {
  const [count, setCount] = useState(1_000);

  const change = (delta: number) => {
    setCount((n) => n + delta);
  };

  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={32}>
        <AnimatedNumber value={count} />
        <HStack spacing={16}>
          <Button
            onPress={() => change(-STEP)}
            modifiers={[buttonStyle('glass'), buttonBorderShape('circle'), controlSize('large')]}>
            <Image systemName="minus" size={20} modifiers={[frame({ width: 24, height: 24 })]} />
          </Button>
          <Button
            onPress={() => change(STEP)}
            modifiers={[buttonStyle('glass'), buttonBorderShape('circle'), controlSize('large')]}>
            <Image systemName="plus" size={20} modifiers={[frame({ width: 24, height: 24 })]} />
          </Button>
        </HStack>
      </VStack>
    </Host>
  );
}
