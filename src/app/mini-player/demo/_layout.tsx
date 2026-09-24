import { Redirect } from 'expo-router';
import { Platform } from 'react-native';

import MiniPlayerTabLayout from '@/examples/mini-player/tab-layout';

// The one nested layout the mini-player example owns. `NativeTabs` resolves
// its triggers from real sibling route files, so the tab layout can't be
// rendered through `[slug].tsx` like a normal example screen — it needs
// `index.tsx` and `library.tsx` next to it. The screen itself stays in the
// example folder, so the example is still one self-contained directory.
//
// The demo is SwiftUI throughout, so deep links from other platforms go back
// to the list instead of mounting views that only exist on iOS.
export default function MiniPlayerDemoLayout() {
  if (Platform.OS !== 'ios') {
    return <Redirect href="/" />;
  }
  return <MiniPlayerTabLayout />;
}
