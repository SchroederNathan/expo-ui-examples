import { Host } from '@expo/ui';
import {
  BottomSheet,
  Button,
  Group,
  HStack,
  Image,
  Rectangle,
  ScrollView,
  Spacer,
  Text,
  VStack,
  ZStack,
} from '@expo/ui/swift-ui';
import {
  buttonStyle,
  contentShape,
  font,
  foregroundStyle,
  frame,
  ignoreSafeArea,
  interactiveDismissDisabled,
  lineLimit,
  monospacedDigit,
  padding,
  presentationBackgroundInteraction,
  presentationDetents,
  presentationDragIndicator,
  shapes,
  type PresentationDetent,
} from '@expo/ui/swift-ui/modifiers';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';

import { AlbumArt } from './album-art';
import { MINI_H, NowPlayingSheet, SHEET_CHROME, TRACK_DRAG } from './now-playing-sheet';
import { formatTime, TRACKS, type Track } from './tracks';
import { useAlbumArt } from './use-album-art';
import { useMorph } from './use-morph';

const MINI_DETENT: PresentationDetent = { height: MINI_H + SHEET_CHROME };

const white = foregroundStyle({ type: 'color', color: '#FFFFFF' });
const dim = foregroundStyle({ type: 'color', color: '#FFFFFF8C' });
const accent = foregroundStyle({ type: 'color', color: '#FF375F' });

type TrackRowProps = {
  track: Track;
  index: number;
  current: boolean;
  onPress: () => void;
};

function TrackRow({ track, index, current, onPress }: TrackRowProps) {
  return (
    <Button onPress={onPress} modifiers={[buttonStyle('plain')]}>
      <HStack
        spacing={14}
        modifiers={[
          padding({ leading: 24, trailing: 24, top: 11, bottom: 11 }),
          contentShape(shapes.rectangle()),
        ]}>
        {current ? (
          <Image
            systemName="speaker.wave.2.fill"
            size={13}
            modifiers={[accent, frame({ width: 22 })]}
          />
        ) : (
          <Text modifiers={[font({ size: 15 }), dim, monospacedDigit(), frame({ width: 22 })]}>
            {String(index + 1)}
          </Text>
        )}
        <Text modifiers={[font({ size: 16 }), current ? accent : white, lineLimit(1)]}>
          {track.title}
        </Text>
        <Spacer />
        <Text modifiers={[font({ size: 13 }), dim, monospacedDigit()]}>
          {formatTime(track.duration)}
        </Text>
      </HStack>
    </Button>
  );
}

// An Apple Music-style player: the mini bar is a BottomSheet parked at a small
// fixed detent, so dragging it up to `large` is a real native sheet gesture —
// rubber-banding and velocity included — rather than anything driven from JS.
// Requires iOS 16.4+ for presentationBackgroundInteraction.
export function MusicPlayer() {
  const artUri = useAlbumArt();
  const { width, height } = useWindowDimensions();

  const [trackIndex, setTrackIndex] = useState(2);
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [large, setLarge] = useState(false);
  const [presented, setPresented] = useState(true);
  // Live content-area height. Safe to feed back: it drives positioning only,
  // never the detent, so it cannot start a resize loop.
  const [sheetH, setSheetH] = useState(MINI_H);
  const { morph, aim } = useMorph();

  const track = TRACKS[trackIndex];
  const artSize = Math.min(width - 120, 290);

  const detent: PresentationDetent = large ? 'large' : MINI_DETENT;

  // Tear the sheet down when the screen loses focus, otherwise it outlives the
  // Host and floats over the examples list.
  useFocusEffect(
    useCallback(() => {
      setPresented(true);
      return () => {
        setPresented(false);
      };
    }, []),
  );

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

  // Map the sheet's live height onto 0..1. Both bounds are learned from what is
  // actually observed — the collapsed one because sheet chrome makes the content
  // area a few points shy of the detent, and the expanded one seeded low so that
  // Math.max can only ever correct it upward.
  const bounds = useRef({ min: Number.POSITIVE_INFINITY, max: height * 0.85 });

  const handleFrame = ({ height: sheetHeight }: { height: number }) => {
    const next = bounds.current;
    setSheetH(sheetHeight);
    next.min = Math.min(next.min, sheetHeight);
    next.max = Math.max(next.max, sheetHeight);
    const span = next.max - next.min;
    if (!Number.isFinite(span) || span <= 1 || !TRACK_DRAG) {
      return;
    }
    aim((sheetHeight - next.min) / span);
  };

  const selectTrack = (index: number) => {
    setTrackIndex(index);
    setElapsed(0);
    setPlaying(true);
  };

  return (
    <Host style={{ flex: 1 }}>
      <ZStack>
        {/* Bleeds under the transparent nav header and both safe areas. */}
        <Rectangle
          modifiers={[
            foregroundStyle({
              type: 'linearGradient',
              // Deliberately does not fade to black: the glass sheet needs
              // something with colour behind it or there is nothing to refract.
              colors: ['#4A6455', '#1B2620', '#2C3E34'],
              startPoint: { x: 0.5, y: 0 },
              endPoint: { x: 0.5, y: 1 },
            }),
            ignoreSafeArea(),
          ]}
        />
        <ScrollView>
          <VStack spacing={0} modifiers={[padding({ top: 10, bottom: MINI_H + 44 })]}>
            <AlbumArt uri={artUri} size={220} cornerRadius={8} shadowRadius={30} />
            <Spacer minLength={18} />
            <Text modifiers={[font({ size: 22, weight: 'bold' }), white]}>Blonde</Text>
            <Text modifiers={[font({ size: 20 }), accent]}>Frank Ocean</Text>
            <Spacer minLength={4} />
            <Text modifiers={[font({ size: 12 }), dim]}>Alternative · 2016</Text>
            <Spacer minLength={24} />
            {TRACKS.map((item, index) => (
              <TrackRow
                key={item.title}
                track={item}
                index={index}
                current={index === trackIndex}
                onPress={() => selectTrack(index)}
              />
            ))}
          </VStack>
        </ScrollView>

        <BottomSheet isPresented={presented} onIsPresentedChange={setPresented}>
          <Group
            modifiers={[
              presentationDetents([MINI_DETENT, 'large'], {
                selection: detent,
                onSelectionChange: (next) => {
                  const isLarge = next === 'large';
                  setLarge(isLarge);
                  if (!TRACK_DRAG) {
                    aim(isLarge ? 1 : 0);
                  }
                },
              }),
              // 'enabled' rather than 'enabledUpThrough': above the interactive
              // detent iOS dims the presenting view, which is what was making
              // the expanded sheet read as an opaque panel. This keeps the
              // library undimmed at every detent so the glass has something to
              // show, and keeps it scrollable throughout.
              presentationBackgroundInteraction('enabled'),
              presentationDragIndicator('hidden'),
              // Deliberately no presentationBackground: leaving the chrome alone
              // is what keeps the sheet's built-in Liquid Glass material.
              interactiveDismissDisabled(true),
            ]}>
            <NowPlayingSheet
              artUri={artUri}
              track={track}
              playing={playing}
              elapsed={elapsed}
              morph={morph}
              artSize={artSize}
              width={width}
              sheetH={sheetH}
              onTogglePlay={() => setPlaying((value) => !value)}
              onNext={() => selectTrack((trackIndex + 1) % TRACKS.length)}
              onPrev={() => selectTrack((trackIndex - 1 + TRACKS.length) % TRACKS.length)}
              onSeek={setElapsed}
              onExpand={() => setLarge(true)}
              onCollapse={() => setLarge(false)}
              onFrame={handleFrame}
            />
          </Group>
        </BottomSheet>
      </ZStack>
    </Host>
  );
}
