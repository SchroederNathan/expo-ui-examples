import { BottomSheet, Column, RNHostView, Text } from '@expo/ui';
import { useState } from 'react';
import { useColorScheme } from 'react-native';

import { ContinueButton } from './continue-button';
import { IconStack } from './icon-stack';
import { ROW_COUNT, RowsReveal } from './rows-reveal';

// Each Continue press reveals this many more rows until they're all out.
const ROWS_PER_PRESS = 2;

type Props = {
  isPresented: boolean;
  onDismiss: () => void;
};

// No `snapPoints` is the whole trick: the sheet fits its content on both
// platforms (fitToContents on iOS, intrinsic M3 sizing on Android), so the
// rows animating in on Continue is what grows it. BottomSheet hosts itself —
// it must stay a sibling of the screen's Host, never a child.
export function HealthSyncSheet({ isPresented, onDismiss }: Props) {
  const [visibleRows, setVisibleRows] = useState(0);
  const allShown = visibleRows >= ROW_COUNT;
  const dark = useColorScheme() === 'dark';

  // Compose provides no LocalContentColor inside a bare Column, so every Text
  // needs an explicit color to survive Android dark mode.
  const titleColor = dark ? '#FFFFFF' : '#000000';
  const captionColor = dark ? '#98989F' : '#6C6C70';

  const dismiss = () => {
    onDismiss();
    setVisibleRows(0);
  };

  return (
    <BottomSheet isPresented={isPresented} onDismiss={dismiss}>
      {/* No bottom padding: the button rides directly on the bottom safe-area
          inset, like a system sheet's primary action. */}
      <Column spacing={12} style={{ paddingTop: 8 }}>
        <RNHostView matchContents>
          <IconStack synced={visibleRows > 0} />
        </RNHostView>
        <Text
          textStyle={{ fontSize: 22, fontWeight: '700', color: titleColor }}
          style={{ paddingTop: 8 }}>
          Apple Health Sync
        </Text>
        {/* Fixed height keeps this text rigid: fitToContents measures content
            inside the sheet's current detent, and while the height animates
            SwiftUI would rather squash flexible text than overflow it.
            The same value is plain dp on Android. */}
        <Text textStyle={{ fontSize: 15, color: captionColor }} style={{ height: 40 }}>
          Connect with Apple Health so both apps can gossip about your workouts behind your back.
        </Text>
        <RNHostView matchContents>
          <RowsReveal count={visibleRows} />
        </RNHostView>
        <ContinueButton
          label={allShown ? 'Done' : 'Continue'}
          onPress={
            allShown
              ? dismiss
              : () => setVisibleRows((n) => Math.min(n + ROWS_PER_PRESS, ROW_COUNT))
          }
        />
      </Column>
    </BottomSheet>
  );
}
