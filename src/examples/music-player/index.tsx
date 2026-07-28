import { Stack } from 'expo-router';

import { MusicPlayer } from './music-player';

// Music Player — a mini-player parked at a BottomSheet's small detent that
// drags up into a full-screen now-playing view. The sheet does the gesture
// work, so the drag is native: rubber-banding, velocity and detent snapping.
export default function MusicPlayerScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTintColor: 'white',
          headerTitleStyle: { color: 'white' },
        }}
      />
      <MusicPlayer />
    </>
  );
}
