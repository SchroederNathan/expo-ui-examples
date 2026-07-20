import { Host } from '@expo/ui';
import {
  GlassEffectContainer,
  HStack,
  Image,
  Namespace,
  Slider,
  Text,
  Toggle,
  VStack,
  ZStack,
} from '@expo/ui/swift-ui';
import {
  Animation,
  animation,
  blur,
  font,
  foregroundStyle,
  frame,
  glassEffect,
  glassEffectId,
  offset,
  padding,
} from '@expo/ui/swift-ui/modifiers';
import { useId, useState } from 'react';
import type { SFSymbol } from 'sf-symbols-typescript';

const ORBS: { symbol: SFSymbol; direction: number }[] = [
  { symbol: 'cloud.sun.rain.fill', direction: -1 },
  { symbol: 'drop.fill', direction: 0 },
  { symbol: 'sparkles', direction: 1 },
];

const TINTED_PILLS: { symbol: SFSymbol; tint: string }[] = [
  { symbol: 'flame.fill', tint: '#FF375F80' },
  { symbol: 'bolt.fill', tint: '#FF9F0A80' },
  { symbol: 'leaf.fill', tint: '#30D15880' },
];

type BlobProps = {
  colors: string[];
  x: number;
  y: number;
  size: number;
};

// Colorful blurred blobs so the glass has something to refract.
function BackgroundBlob({ colors, x, y, size }: BlobProps) {
  return (
    <Image
      systemName="circle.fill"
      size={size}
      modifiers={[
        foregroundStyle({
          type: 'linearGradient',
          colors,
          startPoint: { x: 0, y: 0 },
          endPoint: { x: 1, y: 1 },
        }),
        offset({ x, y }),
        blur(50),
      ]}
    />
  );
}

// Drag the slider to pull three glass orbs apart — inside a
// GlassEffectContainer they melt into one blob as they get close.
// Requires iOS 26+ for Liquid Glass.
export function GlassPlayground() {
  const [spread, setSpread] = useState(0.8);
  const [clear, setClear] = useState(false);
  const namespaceId = useId();

  return (
    <Host style={{ flex: 1 }}>
      <ZStack>
        <BackgroundBlob colors={['#0A84FF', '#5E5CE6']} x={-110} y={-190} size={330} />
        <BackgroundBlob colors={['#BF5AF2', '#FF375F']} x={130} y={-20} size={300} />
        <BackgroundBlob colors={['#FF9F0A', '#30D158']} x={-90} y={200} size={310} />
        <VStack spacing={36}>
          <Namespace id={namespaceId}>
            <GlassEffectContainer spacing={40}>
              <ZStack>
                {ORBS.map(({ symbol, direction }) => (
                  <Image
                    key={symbol}
                    systemName={symbol}
                    size={30}
                    modifiers={[
                      frame({ width: 80, height: 80 }),
                      glassEffect({
                        glass: { variant: clear ? 'clear' : 'regular', interactive: true },
                      }),
                      glassEffectId(symbol, namespaceId),
                      offset({ x: direction * (20 + spread * 75) }),
                      animation(Animation.spring({ duration: 0.4 }), spread),
                    ]}
                  />
                ))}
              </ZStack>
            </GlassEffectContainer>
          </Namespace>
          <HStack spacing={20}>
            {TINTED_PILLS.map(({ symbol, tint }) => (
              <Image
                key={symbol}
                systemName={symbol}
                size={22}
                modifiers={[
                  frame({ width: 68, height: 44 }),
                  glassEffect({
                    glass: { variant: 'regular', tint, interactive: true },
                    shape: 'capsule',
                  }),
                ]}
              />
            ))}
          </HStack>
          <VStack
            spacing={16}
            modifiers={[
              padding({ top: 20, bottom: 20, leading: 24, trailing: 24 }),
              glassEffect({ shape: 'roundedRectangle', cornerRadius: 28 }),
            ]}>
            <HStack spacing={12}>
              <Text modifiers={[font({ textStyle: 'footnote' })]}>Merge</Text>
              <Slider value={spread} min={0} max={1} onValueChange={setSpread} />
              <Text modifiers={[font({ textStyle: 'footnote' })]}>Split</Text>
            </HStack>
            <Toggle
              isOn={clear}
              onIsOnChange={setClear}
              label="Clear glass"
              systemImage="circle.dotted.and.circle"
            />
          </VStack>
        </VStack>
      </ZStack>
    </Host>
  );
}
