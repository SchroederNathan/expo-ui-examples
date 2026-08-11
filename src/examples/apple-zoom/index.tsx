import { PhotoGrid } from './photo-grid';

// Apple Zoom — the iOS 18 zoom transition, wired up by Expo Router. A thumbnail
// wrapped in `Link.AppleZoom` flies into the `Link.AppleZoomTarget` on the next
// screen, and the swipe-down dismissal rewinds the same animation.
//
// iOS 18+ only. On anything older the link still navigates, with the standard
// push animation. The destination lives in `src/app/apple-zoom/[id].tsx`, since
// the transition needs a second route in the Stack.
//
// Opening or dismissing repeatedly can lag by about a second — an upstream
// react-native-screens issue: https://github.com/expo/expo/issues/42797
export default function AppleZoomScreen() {
  return <PhotoGrid />;
}
