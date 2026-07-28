import {
  Button,
  Capsule,
  HStack,
  Image,
  Overlay,
  Rectangle,
  Slider,
  Spacer,
  Text,
  VStack,
  ZStack,
  useNativeState,
} from '@expo/ui/swift-ui';
import {
  accessibilityHidden,
  buttonStyle,
  contentShape,
  disabled,
  fixedSize,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  monospacedDigit,
  offset,
  onGeometryChange,
  onTapGesture,
  opacity,
  padding,
  shapes,
  symbolEffect,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';
import { scheduleOnUI } from 'react-native-worklets';

import { AlbumArt } from './album-art';
import { formatTime, type Track } from './tracks';

// --- Collapsed bar: every size below is derived from these tokens ---
const MINI_ART = 42;
const MINI_PAD = 11;
const MINI_TITLE = 15;
const MINI_ARTIST = 13;
const MINI_GAP = 1;
const MINI_GLYPH = 36;

// SwiftUI lays a line of text out at roughly 1.2x its point size.
const lineHeight = (size: number) => Math.ceil(size * 1.2);
const MINI_TEXT = lineHeight(MINI_TITLE) + MINI_GAP + lineHeight(MINI_ARTIST);

// The bar is as tall as its tallest element plus its padding. Derived rather than
// measured: the bar lives inside the very sheet whose height it would be feeding,
// so measuring it is circular — the sheet compresses the bar, the smaller reading
// shrinks the detent, and the sheet collapses a little further on every pass.
// Nothing here needs hand-syncing; change a token and the height follows.
export const MINI_H = Math.max(MINI_ART, MINI_TEXT, MINI_GLYPH) + MINI_PAD * 2;

// A sheet's content area is shorter than the detent it was asked for, and not by
// a clean margin (measured: 70 -> 60.2, 80 -> 65.2, 85 -> 65.0). This is only a
// floor, chosen so the area comfortably clears MINI_H; nothing is positioned from
// it, so being a couple of points out costs nothing.
export const SHEET_CHROME = 16;

// Drive the mini -> full transition from the sheet's live height, so the content
// follows the finger instead of only changing once a detent commits. The sheet
// itself always moves natively, so the worst case is the content trailing the
// sheet slightly, never a stuttering drag. Flip to false to key the transition
// off the committed detent alone.
export const TRACK_DRAG = true;

const EDGE = 16;
const PAD = 28;
const ART_TOP = 76;

const white = foregroundStyle({ type: 'color', color: '#FFFFFF' });
const dim = foregroundStyle({ type: 'color', color: '#FFFFFF99' });

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

type NowPlayingSheetProps = {
  artUri: string | null;
  track: Track;
  playing: boolean;
  elapsed: number;
  /** 0 = fully collapsed, 1 = fully expanded. */
  morph: number;
  artSize: number;
  width: number;
  /** Live measured height of the sheet's content area. */
  sheetH: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (value: number) => void;
  onExpand: () => void;
  onCollapse: () => void;
  onFrame: (frame: { height: number }) => void;
};

type GlyphButtonProps = {
  systemName: 'backward.end.fill' | 'forward.end.fill' | 'ellipsis';
  size: number;
  onPress: () => void;
};

function GlyphButton({ systemName, size, onPress }: GlyphButtonProps) {
  return (
    <Button onPress={onPress} modifiers={[buttonStyle('plain')]}>
      <Image
        systemName={systemName}
        size={size}
        modifiers={[white, frame({ width: size + 14, height: size + 14 })]}
      />
    </Button>
  );
}

// Must be rendered inside a SwiftUI tree — it lives in a BottomSheet's Group.
//
// There is exactly one artwork view and one title/artist block; both are placed
// by interpolated offsets so they travel from the mini bar into the centre of the
// full player rather than cross-fading between two copies.
//
// The base content is a single flexible Rectangle, so it measures exactly the
// current sheet height. Everything else sits in an Overlay (SwiftUI's .overlay),
// which contributes nothing to that measurement — otherwise the player's
// intrinsic height would force the sheet content taller than its own detent.
//
// Requires iOS 26+ for glassEffect.
export function NowPlayingSheet({
  artUri,
  track,
  playing,
  elapsed,
  morph,
  artSize,
  width,
  sheetH,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onExpand,
  onCollapse,
  onFrame,
}: NowPlayingSheetProps) {
  const [volume, setVolume] = useState(0.7);
  const bounce = useNativeState(0);

  const expanded = morph > 0.5;

  // The collapsed set leaves early and the expanded set arrives late, so the two
  // never wash over each other in the middle of the drag.
  const miniOpacity = Math.max(0, 1 - morph * 2.5);
  const fullOpacity = Math.max(0, Math.min(1, (morph - 0.45) / 0.5));

  // Keep each set mounted only while it is actually visible. accessibilityHidden
  // alone leaves the faded-out set in the AX tree, so at rest the set that isn't
  // in use is unmounted instead.
  const showMini = miniOpacity > 0;
  const showFull = fullOpacity > 0;

  // The cover is the only element that travels; everything else cross-fades in
  // place, which also avoids re-laying out text on every frame of the drag.
  const art = lerp(MINI_ART, artSize, morph);
  const artX = lerp(EDGE, (width - art) / 2, morph);
  // The cover sits in a full-height stack so that at rest it centres itself in the
  // sheet exactly as the bar's own contents do — no need to know how tall the
  // content area is, or where the sheet puts its chrome. Only the pull *away* from
  // centre is computed, from the live height, so it ends at ART_TOP when expanded.
  const artDy = morph * (ART_TOP - (sheetH - art) / 2);

  const fullTextY = ART_TOP + artSize + 28;
  const controlsY = fullTextY + 72;

  const togglePlay = () => {
    scheduleOnUI(() => {
      'worklet';
      bounce.value = bounce.value + 1;
    });
    onTogglePlay();
  };

  return (
    <Overlay alignment="topLeading">
      {/* Transparent on purpose. The sheet's own chrome is already Liquid Glass
          on iOS 26, so this paints nothing and exists only to measure — being
          flexible, it is the one view guaranteed to match the sheet's own size. */}
      <Rectangle
        modifiers={[
          foregroundStyle({ type: 'color', color: '#00000000' }),
          onGeometryChange(onFrame),
        ]}
      />

      <Overlay.Content>
        <ZStack alignment="topLeading">
          {/* The collapsed bar lays out in normal flow, so its contents centre
              themselves rather than being individually offset. The whole bar is
              the tap target. */}
          {showMini ? (
            <VStack
              spacing={0}
              modifiers={[
                opacity(miniOpacity),
                disabled(expanded),
                accessibilityHidden(expanded),
                contentShape(shapes.rectangle()),
                onTapGesture(onExpand),
              ]}>
              {/* Spacers rather than a computed offset: the sheet's chrome is not
                  split evenly top and bottom, so letting the bar centre itself in
                  whatever content area it is given beats guessing where that
                  chrome sits. */}
              <Spacer />
              <HStack
                spacing={12}
                modifiers={[
                  padding({ vertical: MINI_PAD, leading: EDGE, trailing: 12 }),
                  // Its ideal height, never whatever the sheet happens to offer.
                  fixedSize({ vertical: true }),
                ]}>
                {/* Holds the cover's slot open. The cover itself is drawn on top
                    as a sibling so that it can travel out of this bar. */}
                <Rectangle
                  modifiers={[
                    foregroundStyle({ type: 'color', color: '#00000000' }),
                    frame({ width: MINI_ART, height: MINI_ART }),
                  ]}
                />
                <VStack alignment="leading" spacing={MINI_GAP}>
                  <Text
                    modifiers={[font({ size: MINI_TITLE, weight: 'medium' }), white, lineLimit(1)]}>
                    {track.title}
                  </Text>
                  <Text modifiers={[font({ size: MINI_ARTIST }), dim, lineLimit(1)]}>
                    {track.artist}
                  </Text>
                </VStack>
                <Spacer />
                <Button onPress={togglePlay} modifiers={[buttonStyle('plain')]}>
                  <Image
                    systemName={playing ? 'pause.fill' : 'play.fill'}
                    size={24}
                    modifiers={[white, frame({ width: MINI_GLYPH, height: MINI_GLYPH })]}
                  />
                </Button>
                <GlyphButton systemName="forward.end.fill" size={20} onPress={onNext} />
              </HStack>
              <Spacer />
            </VStack>
          ) : null}

          {showFull ? (
            <Button
              onPress={onCollapse}
              modifiers={[
                buttonStyle('plain'),
                offset({ x: (width - 64) / 2, y: 6 }),
                opacity(fullOpacity),
                disabled(!expanded),
                accessibilityHidden(!expanded),
              ]}>
              <Capsule
                modifiers={[
                  foregroundStyle({ type: 'color', color: '#FFFFFF59' }),
                  frame({ width: 40, height: 5 }),
                  padding({ all: 12 }),
                ]}
              />
            </Button>
          ) : null}

          {showFull ? (
            <VStack
              alignment="leading"
              spacing={2}
              modifiers={[
                frame({ width: width - PAD * 2 - 40, alignment: 'leading' }),
                offset({ x: PAD, y: fullTextY }),
                opacity(fullOpacity),
                accessibilityHidden(!expanded),
              ]}>
              <Text modifiers={[font({ size: 22, weight: 'semibold' }), white, lineLimit(1)]}>
                {track.title}
              </Text>
              <Text modifiers={[font({ size: 22 }), dim, lineLimit(1)]}>{track.artist}</Text>
            </VStack>
          ) : null}

          {/* Expanded controls. */}
          {showFull ? (
            <VStack
              spacing={0}
              modifiers={[
                frame({ width: width - PAD * 2 }),
                // Without this the ZStack proposes the full sheet height and every
                // Spacer stretches, pushing the volume row off the bottom.
                fixedSize({ vertical: true }),
                offset({ x: PAD, y: controlsY }),
                opacity(fullOpacity),
                disabled(!expanded),
                accessibilityHidden(!expanded),
              ]}>
              <Slider
                value={elapsed}
                min={0}
                max={track.duration}
                onValueChange={onSeek}
                modifiers={[tint('#FFFFFFCC')]}
              />
              <HStack spacing={0}>
                <Text modifiers={[font({ size: 12 }), dim, monospacedDigit()]}>
                  {formatTime(elapsed)}
                </Text>
                <Spacer />
                <Text modifiers={[font({ size: 12 }), dim, monospacedDigit()]}>
                  {`-${formatTime(track.duration - elapsed)}`}
                </Text>
              </HStack>

              <Spacer minLength={26} />

              <HStack spacing={40}>
                <GlyphButton systemName="backward.end.fill" size={28} onPress={onPrev} />
                <Button onPress={togglePlay} modifiers={[buttonStyle('plain')]}>
                  <Image
                    systemName={playing ? 'pause.fill' : 'play.fill'}
                    size={42}
                    modifiers={[
                      white,
                      frame({ width: 56, height: 56 }),
                      symbolEffect({ effect: 'bounce', direction: 'up' }, { value: bounce }),
                    ]}
                  />
                </Button>
                <GlyphButton systemName="forward.end.fill" size={28} onPress={onNext} />
              </HStack>

              <Spacer minLength={30} />

              <HStack spacing={10}>
                <Image systemName="speaker.fill" size={12} modifiers={[dim]} />
                <Slider
                  value={volume}
                  min={0}
                  max={1}
                  onValueChange={setVolume}
                  modifiers={[tint('#FFFFFF99')]}
                />
                <Image systemName="speaker.wave.3.fill" size={12} modifiers={[dim]} />
              </HStack>

              <Spacer minLength={30} />

              <HStack spacing={52}>
                <Image systemName="quote.bubble" size={20} modifiers={[dim]} />
                <Image systemName="airplayaudio" size={20} modifiers={[dim]} />
                <Image systemName="list.bullet" size={20} modifiers={[dim]} />
              </HStack>
            </VStack>
          ) : null}

          {/* Last, so the travelling cover is drawn over whichever text set is
              fading rather than being overdrawn by it. */}
          <VStack spacing={0} modifiers={[offset({ x: artX, y: artDy })]}>
            <Spacer />
            <AlbumArt
              uri={artUri}
              size={art}
              cornerRadius={lerp(6, 10, morph)}
              shadowRadius={26 * morph}
            />
            <Spacer />
          </VStack>
        </ZStack>
      </Overlay.Content>
    </Overlay>
  );
}
