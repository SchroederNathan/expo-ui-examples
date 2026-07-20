import { Host, HStack, Image, VStack, useNativeState } from '@expo/ui/swift-ui';
import { frame, symbolEffect, type SymbolEffect } from '@expo/ui/swift-ui/modifiers';
import type { SFSymbol } from 'sf-symbols-typescript';
import { scheduleOnUI } from 'react-native-worklets';

type Item = { symbol: SFSymbol; effect: SymbolEffect };

const ROWS: Item[][] = [
  [
    { symbol: 'bell.and.waves.left.and.right.fill', effect: { effect: 'wiggle' } },
    {
      symbol: 'wifi',
      effect: { effect: 'variableColor', fillStyle: 'iterative', playbackStyle: 'reversing' },
    },
    { symbol: 'heart.fill', effect: { effect: 'bounce', direction: 'up' } },
  ],
  [
    { symbol: 'ellipsis.message.fill', effect: { effect: 'variableColor', fillStyle: 'cumulative' } },
    { symbol: 'arrow.triangle.2.circlepath', effect: { effect: 'rotate', direction: 'clockwise' } },
    {
      symbol: 'rays',
      effect: { effect: 'variableColor', fillStyle: 'iterative', inactiveLayers: 'dim' },
    },
  ],
  [
    { symbol: 'paperplane.fill', effect: { effect: 'bounce', direction: 'up' } },
    { symbol: 'star.fill', effect: { effect: 'breathe' } },
    {
      symbol: 'speaker.wave.3.fill',
      effect: { effect: 'variableColor', fillStyle: 'iterative', playbackStyle: 'reversing' },
    },
  ],
];

function TapSymbol({ symbol, effect }: Item) {
  const trigger = useNativeState(0);

  return (
    <Image
      systemName={symbol}
      size={44}
      onPress={() =>
        scheduleOnUI(() => {
          'worklet';
          trigger.value = trigger.value + 1;
        })
      }
      modifiers={[symbolEffect(effect, { value: trigger }), frame({ width: 92, height: 60 })]}
    />
  );
}

// Tap an icon to animate it. Fully self-contained — drop this file into any
// Expo SDK 57 project. Requires iOS 17+ for symbolEffect.
export function AnimatedSymbols() {
  return (
    <Host matchContents>
      <VStack spacing={24}>
        {ROWS.map((row, i) => (
          <HStack key={i} spacing={16}>
            {row.map((item) => (
              <TapSymbol key={item.symbol} {...item} />
            ))}
          </HStack>
        ))}
      </VStack>
    </Host>
  );
}
