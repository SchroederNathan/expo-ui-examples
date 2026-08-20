import { Redirect } from 'expo-router';

// Tab Bar Mini Player — `NativeTabs.BottomAccessory` docks custom content
// above the (iOS 26+) liquid-glass tab bar, collapsing to an icon once the
// bar minimizes on scroll. The demo needs its own `NativeTabs` layout, and
// Expo Router resolves tabs from real route files rather than an arbitrary
// component tree, so it lives at `/mini-player/demo`
// (`src/app/mini-player/demo/`). The home list links there directly via the
// registry `href`; this screen only redirects `/mini-player` deep links.
export default function MiniPlayerScreen() {
  return <Redirect href="/mini-player/demo" />;
}
