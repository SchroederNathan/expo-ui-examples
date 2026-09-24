import { Redirect } from 'expo-router';
import { Platform } from 'react-native';

import PlayerScreen from '@/examples/mini-player/player-screen';

// SwiftUI only — see `demo/_layout.tsx`.
export default function PlayerRoute() {
  if (Platform.OS !== 'ios') {
    return <Redirect href="/" />;
  }
  return <PlayerScreen />;
}
