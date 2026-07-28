import { Stack } from 'expo-router';

import { ExpressiveLoaders } from './expressive-loaders';

// Expressive Loaders — the Material 3 Expressive `LoadingIndicator` (a morphing shape)
// and `LinearWavyProgressIndicator`, driven by a simulated app update that moves through
// indeterminate → determinate → indeterminate the way a real download does. The header is
// hidden so the whole screen is Compose. Android only.
export default function ExpressiveLoadersScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ExpressiveLoaders />
    </>
  );
}
