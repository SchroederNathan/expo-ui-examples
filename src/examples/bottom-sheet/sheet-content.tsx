import { BottomSheet, Column, RNHostView, Text } from '@expo/ui';
import { useEffect, useState } from 'react';

import { useSheetColors } from './colors';
import { ContinueButton } from './continue-button';
import { IconStack } from './icon-stack';
import { ROW_COUNT, RowsReveal } from './rows-reveal';

// Each Continue press reveals this many more rows until they're all out.
const ROWS_PER_PRESS = 2;

// Keep the animated content at its current height until the native sheet has
// finished leaving. Collapsing it during Compose's hide animation makes the
// modal remeasure on every frame, which produces a visibly broken Android
// dismissal. This is intentionally a little longer than the native exit.
const DISMISS_CLEANUP_DELAY_MS = 500;

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
  const colors = useSheetColors();

  // A reopen inside the cleanup delay cancels the pending reset below, so start
  // over here instead. Adjusting state during render means the old rows never
  // paint in the new presentation.
  const [wasPresented, setWasPresented] = useState(isPresented);
  if (isPresented !== wasPresented) {
    setWasPresented(isPresented);
    if (isPresented && visibleRows > 0) {
      setVisibleRows(0);
    }
  }

  useEffect(() => {
    if (isPresented || visibleRows === 0) return;

    const cleanup = setTimeout(() => setVisibleRows(0), DISMISS_CLEANUP_DELAY_MS);
    return () => clearTimeout(cleanup);
  }, [isPresented, visibleRows]);

  return (
    <BottomSheet isPresented={isPresented} onDismiss={onDismiss}>
      <Column spacing={12} style={{ paddingTop: 8 }}>
        <RNHostView matchContents>
          <IconStack synced={visibleRows > 0} />
        </RNHostView>
        <Text
          textStyle={{ fontSize: 22, fontWeight: '700', color: colors.label }}
          style={{ paddingTop: 8 }}>
          Apple Health Sync
        </Text>
        <Text textStyle={{ fontSize: 15, color: colors.secondaryLabel }} style={{ height: 40 }}>
          Connect with Apple Health so both apps can gossip about your workouts behind your back.
        </Text>
        <RowsReveal count={visibleRows} />
        <ContinueButton
          label={allShown ? 'Done' : 'Continue'}
          onPress={
            allShown
              ? onDismiss
              : () => setVisibleRows((n) => Math.min(n + ROWS_PER_PRESS, ROW_COUNT))
          }
        />
      </Column>
    </BottomSheet>
  );
}
