import { Stack } from 'expo-router';

import { MaterialYou } from './material-you';

// Material You — pick a seed color (or the device wallpaper) and every native
// Material 3 component on screen retints itself. The header is hidden so the
// whole screen belongs to the generated palette. Android only.
export default function MaterialYouScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MaterialYou />
    </>
  );
}
