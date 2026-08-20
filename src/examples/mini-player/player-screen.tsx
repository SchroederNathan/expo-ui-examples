import { Host } from '@expo/ui';
import {
  Button,
  Capsule,
  HStack,
  Image,
  Rectangle,
  Slider,
  Spacer,
  Text,
  VStack,
  ZStack,
} from '@expo/ui/swift-ui';
import {
  backgroundOverlay,
  buttonStyle,
  clipShape,
  disabled,
  font,
  foregroundStyle,
  frame,
  ignoreSafeArea,
  lineLimit,
  monospacedDigit,
  padding,
  shadow,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import type { SFSymbol } from 'sf-symbols-typescript';
import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

import { AlbumArt } from './album-art';
import { player, usePlayer } from './player-store';
import { formatTime, TRACKS } from './tracks';
import { useAlbumArt } from './use-album-art';

// The warm gray Apple Music derives from the blond artwork.
export const PLAYER_BG = '#38332F';
const white = foregroundStyle({ type: 'color', color: '#FFFFFF' });
const dim = foregroundStyle({ type: 'color', color: '#FFFFFF99' });

function GlyphButton({
  systemName,
  size,
  onPress,
}: {
  systemName: SFSymbol;
  size: number;
  onPress: () => void;
}) {
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

// Apple Music's full player. Presented as a formSheet route (see the root
// layout), so arriving, the grabber, and drag-to-dismiss are all the system
// sheet's own behavior. Metrics are measured off a real Apple Music
// screenshot: 27pt art margins, 33pt content margins, and the volume/icon
// rows anchored 96pt and 66pt off the bottom edge.
export default function PlayerScreen() {
  const { trackIndex, playing } = usePlayer();
  const track = TRACKS[trackIndex];
  const artUri = useAlbumArt();
  const { width } = useWindowDimensions();
  const [elapsed, setElapsed] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const artSize = width - 54;
  const contentW = width - 66;
  const progress = Math.min(1, elapsed / track.duration);

  useEffect(() => {
    setElapsed(0);
  }, [track]);

  useEffect(() => {
    if (!playing) {
      return;
    }
    const id = setInterval(() => {
      setElapsed((value) => (value + 0.5 >= track.duration ? 0 : value + 0.5));
    }, 500);
    return () => {
      clearInterval(id);
    };
  }, [playing, track.duration]);

  return (
    <Host style={{ flex: 1 }}>
      <ZStack>
        {/* Slightly lighter toward the top, like Apple Music's blurred-artwork
            backdrop. */}
        <Rectangle
          modifiers={[
            foregroundStyle({
              type: 'linearGradient',
              colors: ['#4A443F', PLAYER_BG],
              startPoint: { x: 0.5, y: 0 },
              endPoint: { x: 0.5, y: 1 },
            }),
            ignoreSafeArea(),
          ]}
        />

        <VStack spacing={0}>
          <AlbumArt
            uri={artUri}
            size={artSize}
            cornerRadius={10}
            // A softer shadow than AlbumArt's built-in one. disabled() keeps
            // the artwork from claiming touches, so the sheet's drag-to-dismiss
            // works from the player's biggest surface. (Text and stack views
            // don't release touches the same way — their rows stay
            // non-draggable, an @expo/ui hosting limitation.)
            modifiers={[
              shadow({ radius: 16, y: 8, color: '#00000040' }),
              padding({ top: 62 }),
              disabled(true),
            ]}
          />

          <HStack spacing={0} modifiers={[frame({ width: contentW }), padding({ top: 34 })]}>
            <VStack alignment="leading" spacing={0}>
              <HStack spacing={8}>
                <Text modifiers={[font({ size: 22, weight: 'bold' }), white, lineLimit(1)]}>
                  {track.title}
                </Text>
                {/* The explicit-lyrics badge. */}
                <Text
                  modifiers={[
                    font({ size: 12, weight: 'bold' }),
                    foregroundStyle(PLAYER_BG),
                    frame({ width: 17, height: 17 }),
                    backgroundOverlay({ color: '#FFFFFF99' }),
                    clipShape('roundedRectangle', 4),
                  ]}>
                  E
                </Text>
              </HStack>
              <Text modifiers={[font({ size: 22 }), dim, lineLimit(1)]}>{track.artist}</Text>
            </VStack>
            <Spacer />
            <Image systemName="ellipsis" size={20} modifiers={[dim]} />
          </HStack>

          {/* Apple Music's scrubber reads as a bare progress line, so it is
              drawn with capsules rather than a thumbed Slider. */}
          <ZStack alignment="leading" modifiers={[padding({ top: 31 })]}>
            <Capsule
              modifiers={[
                foregroundStyle({ type: 'color', color: '#FFFFFF33' }),
                frame({ width: contentW, height: 7 }),
              ]}
            />
            <Capsule
              modifiers={[
                foregroundStyle({ type: 'color', color: '#D9D5D1' }),
                frame({ width: Math.max(7, contentW * progress), height: 7 }),
              ]}
            />
          </ZStack>
          <HStack spacing={0} modifiers={[frame({ width: contentW }), padding({ top: 11 })]}>
            <Text modifiers={[font({ size: 13 }), dim, monospacedDigit()]}>
              {formatTime(elapsed)}
            </Text>
            <Spacer />
            <Text modifiers={[font({ size: 13 }), dim, monospacedDigit()]}>
              {`-${formatTime(track.duration - elapsed)}`}
            </Text>
          </HStack>

          <HStack spacing={48} modifiers={[padding({ top: 40 })]}>
            <GlyphButton systemName="backward.fill" size={34} onPress={player.prev} />
            <Button onPress={player.toggle} modifiers={[buttonStyle('plain')]}>
              <Image
                systemName={playing ? 'pause.fill' : 'play.fill'}
                size={50}
                modifiers={[white, frame({ width: 58, height: 58 })]}
              />
            </Button>
            <GlyphButton systemName="forward.fill" size={34} onPress={player.next} />
          </HStack>

          {/* The volume and icon rows hug the bottom; the leftover space
              collects here, above them, exactly as in the real player. */}
          <Spacer />

          <HStack spacing={12} modifiers={[frame({ width: contentW })]}>
            <Image systemName="speaker.fill" size={13} modifiers={[dim]} />
            <Slider
              value={volume}
              min={0}
              max={1}
              onValueChange={setVolume}
              modifiers={[tint('#D9D5D1')]}
            />
            <Image systemName="speaker.wave.3.fill" size={13} modifiers={[dim]} />
          </HStack>

          <HStack spacing={86} modifiers={[padding({ top: 23, bottom: 21 })]}>
            <Image systemName="quote.bubble" size={21} modifiers={[dim]} />
            <Image systemName="airplayaudio" size={21} modifiers={[dim]} />
            <Image systemName="list.bullet" size={21} modifiers={[dim]} />
          </HStack>
        </VStack>
      </ZStack>
    </Host>
  );
}
