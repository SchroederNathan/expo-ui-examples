import { BottomSheet, Column, RNHostView, Text } from '@expo/ui';
import { useState } from 'react';
import { useColorScheme } from 'react-native';

import { ContinueButton } from './continue-button';
import { IconStack } from './icon-stack';
import { RowsReveal } from './rows-reveal';

type Props = {
  isPresented: boolean;
  onDismiss: () => void;
};

// No `snapPoints` is the whole trick: the sheet fits its content on both
// platforms (fitToContents on iOS, intrinsic M3 sizing on Android), so the
// rows animating in on Continue is what grows it. BottomSheet hosts itself —
// it must stay a sibling of the screen's Host, never a child.
export function HealthSyncSheet({ isPresented, onDismiss }: Props) {
  const [synced, setSynced] = useState(false);
  const dark = useColorScheme() === 'dark';

  // Compose provides no LocalContentColor inside a bare Column, so every Text
  // needs an explicit color to survive Android dark mode.
  const titleColor = dark ? '#FFFFFF' : '#000000';
  const captionColor = dark ? '#98989F' : '#6C6C70';

  const dismiss = () => {
    onDismiss();
    setSynced(false);
  };

  return (
    <BottomSheet isPresented={isPresented} onDismiss={dismiss}>
      <Column spacing={12} style={{ paddingTop: 8, paddingBottom: 16 }}>
        <RNHostView matchContents>
          <IconStack synced={synced} />
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
          You can connect with Apple Health to sync your workout data with this app.
        </Text>
        <RNHostView matchContents>
          <RowsReveal synced={synced} />
        </RNHostView>
        <ContinueButton
          label={synced ? 'Done' : 'Continue'}
          onPress={synced ? dismiss : () => setSynced(true)}
        />
      </Column>
    </BottomSheet>
  );
}
