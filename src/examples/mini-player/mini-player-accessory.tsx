import { Image } from 'expo-image';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';
import { PlatformColor, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Track } from './tracks';

type Props = {
  track: Track;
  playing: boolean;
  onToggle: () => void;
  onNext: () => void;
  onOpen: () => void;
};

const LABEL = PlatformColor('label');
const SECONDARY_LABEL = PlatformColor('secondaryLabel');
const ARTWORK = require('@/assets/images/blond.jpeg');

// The tab bar mounts this twice — once for the full 'regular' placement, once
// for the collapsed 'inline' one — so all state is owned by the tab layout and
// passed in as props rather than kept here.
export function MiniPlayerAccessory({ track, playing, onToggle, onNext, onOpen }: Props) {
  const placement = NativeTabs.BottomAccessory.usePlacement();

  // 'inline' is the wide pill riding next to the collapsed tab circle once the
  // bar minimizes, not an icon-sized slot — so it keeps the artwork, title, and
  // toggle, dropping only the artist line and skip button it can't fit.
  // Pressing the pill opens the full player; the glyph is its own pressable so
  // play/pause still works without expanding.
  if (placement === 'inline') {
    return (
      <Pressable onPress={onOpen} style={styles.inlineRow}>
        <Image source={ARTWORK} style={styles.inlineArt} />
        <Text numberOfLines={1} style={styles.inlineTitle}>
          {track.title}
        </Text>
        <Pressable onPress={onToggle} hitSlop={8}>
          <SymbolView name={playing ? 'pause.fill' : 'play.fill'} size={16} tintColor={LABEL} />
        </Pressable>
      </Pressable>
    );
  }

  return (
    <View style={styles.row}>
      <Pressable onPress={onOpen} style={styles.openArea}>
        <Image source={ARTWORK} style={styles.art} />
        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.title}>
            {track.title}
          </Text>
          <Text numberOfLines={1} style={styles.artist}>
            {track.artist}
          </Text>
        </View>
      </Pressable>
      <Pressable onPress={onToggle} hitSlop={8} style={styles.button}>
        <SymbolView name={playing ? 'pause.fill' : 'play.fill'} size={20} tintColor={LABEL} />
      </Pressable>
      <Pressable onPress={onNext} hitSlop={8} style={styles.button}>
        <SymbolView name="forward.fill" size={19} tintColor={LABEL} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // Measured off Apple Music's own 48pt-capsule accessory: 32pt artwork with
  // a ~15pt leading inset and 8pt vertical margins, so the art floats inside
  // the capsule's curve instead of hugging it.
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingLeft: 15,
    paddingRight: 14,
  },
  // The artwork + text block is the tap-to-open target, matching Apple Music;
  // the transport buttons stay their own targets.
  openArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  art: {
    width: 32,
    height: 32,
    borderRadius: 5,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: LABEL,
  },
  artist: {
    fontSize: 13,
    color: SECONDARY_LABEL,
  },
  button: {
    padding: 6,
  },
  // The trailing inset is far wider than the leading one: the glyph is
  // floating text, not a bounded card, so it needs generous room to clear
  // the capsule curve.
  inlineRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 24,
  },
  inlineArt: {
    width: 32,
    height: 32,
    borderRadius: 5,
  },
  inlineTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: LABEL,
  },
});
