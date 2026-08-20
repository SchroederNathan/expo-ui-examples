import { Stack, useRouter } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { PlatformColor } from 'react-native';

import { MiniPlayerAccessory } from './mini-player-accessory';
import { player, usePlayer } from './player-store';
import { TRACKS } from './tracks';

// The demo's own NativeTabs layout — Expo Router resolves tabs from real
// route files, so this can't be rendered inline inside the registry screen.
// The Stack header stays on but transparent: content scrolls under it like
// Apple Music, and the floating glass back circle is the way out of the demo.
export default function MiniPlayerTabLayout() {
  const { trackIndex, playing } = usePlayer();
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerTransparent: true, title: '' }} />
      <NativeTabs minimizeBehavior="onScrollDown" tintColor="#FA233B">
        <NativeTabs.BottomAccessory>
          <MiniPlayerAccessory
            track={TRACKS[trackIndex]}
            playing={playing}
            onToggle={player.toggle}
            onNext={player.next}
            onOpen={() => router.push('/mini-player/player')}
          />
        </NativeTabs.BottomAccessory>
        {/* The tab screen's own background shows through the list's top
            content inset as a gray band under the transparent header — paint
            it the system background so the page is white to the very top. */}
        <NativeTabs.Trigger
          name="index"
          contentStyle={{ backgroundColor: PlatformColor('systemBackground') }}>
          <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="new">
          <NativeTabs.Trigger.Icon sf="square.grid.2x2.fill" md="grid_view" />
          <NativeTabs.Trigger.Label>New</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="radio">
          <NativeTabs.Trigger.Icon sf="dot.radiowaves.left.and.right" md="radio" />
          <NativeTabs.Trigger.Label>Radio</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="library">
          <NativeTabs.Trigger.Icon sf="music.note.square.stack.fill" md="library_music" />
          <NativeTabs.Trigger.Label>Library</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        {/* `role="search"` splits this tab into its own trailing circle on
            iOS 26, so the minimized bar reads tab pill · accessory · search —
            the accessory stays centered instead of sliding bottom-right. */}
        <NativeTabs.Trigger name="search" role="search">
          <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
          <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </>
  );
}
