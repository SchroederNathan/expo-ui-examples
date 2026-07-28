import { Host } from '@expo/ui';
import {
  Button,
  ConcentricRectangle,
  EdgeCornerStyle,
  Image,
  Rectangle,
  Text,
  VStack,
  ZStack,
} from '@expo/ui/swift-ui';
import type { ConcentricRectangleCornerParams } from '@expo/ui/swift-ui';
import {
  Animation,
  animation,
  blur,
  buttonStyle,
  font,
  foregroundStyle,
  frame,
  glassEffect,
  hueRotation,
  ignoreSafeArea,
  opacity,
  padding,
} from '@expo/ui/swift-ui/modifiers';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';

const FOREVER = 1_000_000;

// Angular gradient sweeping around the screen center — the Siri rainbow.
const rainbow = foregroundStyle({
  type: 'angularGradient',
  colors: ['#32D5FF', '#0A84FF', '#5E5CE6', '#BF5AF2', '#FF375F', '#FF9F0A', '#32D5FF'],
  center: { x: 0.5, y: 0.5 },
});

const black = foregroundStyle({ type: 'color', color: '#000000' });

// Bloom, mid glow, and crisp core — layered for the light-spill look.
const LAYERS = [
  { thickness: 30, blurRadius: 26, glow: 0.8 },
  { thickness: 14, blurRadius: 9, glow: 0.9 },
  { thickness: 5, blurRadius: 1.5, glow: 1 },
];

// Where the glow waits before the summon button expands it into position.
const COLLAPSED_INSET = 190;

function concentricCorners(minimumRadius?: number): ConcentricRectangleCornerParams {
  const corner = EdgeCornerStyle.concentric(minimumRadius);
  return {
    topLeadingCorner: corner,
    topTrailingCorner: corner,
    bottomLeadingCorner: corner,
    bottomTrailingCorner: corner,
  };
}

type GlowRingProps = {
  inset: number;
  thickness: number;
  blurRadius: number;
  ringOpacity: number;
  minimumRadius?: number;
  modifiers?: ComponentProps<typeof ZStack>['modifiers'];
};

// A border band that hugs the device bezel: a rainbow-filled
// ConcentricRectangle with a black ConcentricRectangle punched over its
// center. Both shapes derive every corner radius from the screen corners,
// so the band stays perfectly concentric at any inset. The optional
// minimumRadius keeps deeply-inset rings rounded once the concentric
// radius would otherwise shrink to zero.
function GlowRing({
  inset,
  thickness,
  blurRadius,
  ringOpacity,
  minimumRadius,
  modifiers = [],
}: GlowRingProps) {
  const corners = concentricCorners(minimumRadius);
  return (
    <ZStack
      modifiers={[padding({ all: inset }), blur(blurRadius), opacity(ringOpacity), ...modifiers]}>
      <ConcentricRectangle corners={corners} modifiers={[rainbow]} />
      <ConcentricRectangle corners={corners} modifiers={[padding({ all: thickness }), black]} />
    </ZStack>
  );
}

// Thin waves that keep travelling outward through the glow band and
// dissolve as they reach the bezel. Mounted only while listening; each
// ring loops on its own staggered, repeating ease-out.
function Ripples() {
  const [phase, setPhase] = useState(false);

  useEffect(() => {
    setPhase(true);
  }, []);

  return (
    <>
      {[0, 1, 2].map((wave) => (
        <GlowRing
          key={wave}
          inset={phase ? 0 : 90}
          thickness={3}
          blurRadius={2}
          ringOpacity={phase ? 0 : 0.9}
          minimumRadius={26}
          modifiers={[
            animation(
              Animation.easeOut({ duration: 2.4 })
                .delay(wave * 0.8)
                .repeat({ repeatCount: FOREVER, autoreverses: false }),
              phase
            ),
          ]}
        />
      ))}
    </>
  );
}

// Apple Intelligence-style edge glow built from ConcentricRectangle:
// every layer follows the device bezel and knows its corner radius.
// Press the button to expand the glow into position; waves ripple
// through the band while it listens. Requires iOS 26+.
export function EdgeGlow() {
  const [active, setActive] = useState(false);
  const [hue, setHue] = useState(0);
  const [breathe, setBreathe] = useState(false);

  // Kick off the endless color travel and the bloom's slow breathing.
  useEffect(() => {
    setHue(360);
    setBreathe(true);
  }, []);

  return (
    <Host style={{ flex: 1 }}>
      <ZStack modifiers={[ignoreSafeArea()]}>
        <Rectangle modifiers={[black]} />
        <ZStack
          modifiers={[
            hueRotation(hue),
            animation(
              Animation.linear({ duration: 6 }).repeat({ repeatCount: FOREVER, autoreverses: false }),
              hue
            ),
          ]}>
          {LAYERS.map(({ thickness, blurRadius, glow }, layer) => (
            <ZStack
              key={thickness}
              modifiers={
                layer === 0
                  ? [
                      opacity(breathe ? 1 : 0.65),
                      animation(
                        Animation.easeInOut({ duration: 2.2 }).repeat({
                          repeatCount: FOREVER,
                          autoreverses: true,
                        }),
                        breathe
                      ),
                    ]
                  : []
              }>
              <GlowRing
                inset={active ? 0 : COLLAPSED_INSET}
                thickness={thickness}
                blurRadius={blurRadius}
                ringOpacity={active ? glow : 0}
                modifiers={[
                  animation(
                    Animation.spring({ duration: 0.55, bounce: 0.2 }).delay(layer * 0.08),
                    active
                  ),
                ]}
              />
            </ZStack>
          ))}
          {active && <Ripples />}
        </ZStack>
        <VStack spacing={16}>
          <Button onPress={() => setActive((current) => !current)} modifiers={[buttonStyle('plain')]}>
            <Image
              systemName={active ? 'waveform' : 'sparkles'}
              size={30}
              modifiers={[
                foregroundStyle({ type: 'color', color: '#FFFFFF' }),
                frame({ width: 84, height: 84 }),
                glassEffect({ glass: { variant: 'regular', interactive: true }, shape: 'circle' }),
              ]}
            />
          </Button>
          <Text
            modifiers={[
              font({ textStyle: 'footnote' }),
              foregroundStyle({ type: 'color', color: '#FFFFFF' }),
              opacity(active ? 0 : 0.55),
              animation(Animation.easeInOut({ duration: 0.3 }), active),
            ]}>
            Tap to summon
          </Text>
        </VStack>
      </ZStack>
    </Host>
  );
}
