import { Stack, useRouter } from 'expo-router';

import { UniversalSettings } from './universal-settings';

// Universal Settings — one component tree, imported entirely from the `@expo/ui`
// root, that renders a SwiftUI Form on iOS and a Material 3 grouped list on Android.
// The theme, accent, text-size and layout-direction controls all write back to the
// Host, so the screen restyles itself as you use it. The header is hidden on both
// platforms so the Host owns the full screen and a forced color scheme reaches the
// title too; back is the chevron, the iOS edge swipe, or the Android system back.
export default function UniversalSettingsScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <UniversalSettings onBack={() => router.back()} />
    </>
  );
}
