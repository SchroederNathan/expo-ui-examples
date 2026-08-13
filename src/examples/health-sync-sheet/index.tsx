import { Button, Column, Host, Spacer, Text } from '@expo/ui';
import { useState } from 'react';
import { useColorScheme } from 'react-native';

import { HealthSyncSheet } from './sheet-content';

// Bottom Sheet — a universal BottomSheet that fits its content and grows
// when Continue reveals more of it. Everything inside is one `@expo/ui` tree
// except two deliberate escape hatches: an RNHostView island for the animated
// app icons (the universal layer has no Image or animation surface) and a
// platform-split Continue button (glass is SwiftUI-only).
export default function HealthSyncSheetScreen() {
  const [isPresented, setIsPresented] = useState(false);
  const dark = useColorScheme() === 'dark';

  return (
    <>
      <Host style={{ flex: 1 }}>
        {/* Flexible spacers center the launcher on both platforms — a SwiftUI
            VStack centers itself but a Compose Column top-aligns. */}
        <Column spacing={16} alignment="center" style={{ paddingHorizontal: 32 }}>
          <Spacer flexible />
          <Text
            textStyle={{
              fontSize: 15,
              textAlign: 'center',
              color: dark ? '#98989F' : '#6C6C70',
            }}>
            The sheet below has no snap points, so it always fits its content. Press Continue
            inside it to watch it grow.
          </Text>
          <Button variant="text" onPress={() => setIsPresented(true)}>
            <Text textStyle={{ color: '#007AFF' }}>Show sheet</Text>
          </Button>
          <Spacer flexible />
        </Column>
      </Host>
      <HealthSyncSheet isPresented={isPresented} onDismiss={() => setIsPresented(false)} />
    </>
  );
}
