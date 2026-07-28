import { Stack } from 'expo-router';

import { EdgeGlow } from './edge-glow';

// Siri Glow — an Apple Intelligence-style edge glow that hugs the device
// bezel using ConcentricRectangle, so the band's corners always match the
// screen's corner radius. Requires iOS 26+.
export default function SiriGlowScreen() {
  return (
    <>
      <Stack.Screen
        options={{ headerTintColor: 'white', headerTitleStyle: { color: 'white' } }}
      />
      <EdgeGlow />
    </>
  );
}
