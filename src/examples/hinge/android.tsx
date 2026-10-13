import { Button, Column, FieldGroup, Host, Row, Spacer, Text } from '@expo/ui';
import { isAvailable, useHinge, type HingeStatus } from 'expo-hinge';
import { useColorScheme, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHingeSession } from './use-hinge-session';

const postures: Record<HingeStatus, string> = {
  closed: 'Closed',
  partiallyOpen: 'Partially open',
  fullyOpen: 'Fully open',
  unknown: 'Unknown',
};

function Reading({ label, value, testID }: { label: string; value: string; testID?: string }) {
  return (
    <Row alignment="center" spacing={16}>
      <Text>{label}</Text>
      <Spacer flexible />
      <Text testID={testID} textStyle={{ fontFamily: 'monospace' }}>
        {value}
      </Text>
    </Row>
  );
}

export default function AndroidHingeScreen() {
  const hinge = useHinge();
  const available = isAvailable();
  const { session, reset } = useHingeSession();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const dark = useColorScheme() === 'dark';
  const foreground = dark ? '#E6E1E5' : '#1C1B1F';
  const secondary = dark ? '#CAC4D0' : '#49454F';
  const posture = hinge ? postures[hinge.status] : available ? 'No reading' : 'Unavailable';

  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup>
        <FieldGroup.Section title="Readings">
          <FieldGroup.SectionHeader>
            <Row alignment="center">
              <Spacer flexible />
              <Column alignment="center" spacing={8} style={{ paddingTop: 16, paddingBottom: 24 }}>
                <Text textStyle={{ fontSize: 14, color: secondary }}>Hinge angle</Text>
                <Text
                  testID="hinge-angle"
                  textStyle={{
                    fontSize: width < 400 ? 72 : 96,
                    fontWeight: '300',
                    color: foreground,
                  }}>
                  {hinge ? `${hinge.angle.toFixed(1)}°` : '—'}
                </Text>
                <Text testID="hinge-posture" textStyle={{ fontSize: 18, color: secondary }}>
                  {posture}
                </Text>
              </Column>
              <Spacer flexible />
            </Row>
          </FieldGroup.SectionHeader>
          <Reading label="System status" value={posture} testID="hinge-system-status" />
          <Reading label="API available" value={available ? 'Yes' : 'No'} />
          <FieldGroup.SectionFooter>
            <Text textStyle={{ fontSize: 13, color: secondary }}>
              {hinge
                ? 'A closed device has an angle near 0°. Android may report Unknown on the cover screen.'
                : available
                  ? 'No hinge reading. This device needs to expose a hinge-angle sensor.'
                  : 'Hinge readings require Android 11 or newer.'}
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>

        <FieldGroup.Section title="This session">
          <Reading
            label="Lowest"
            value={session.minimum === null ? 'No samples' : `${session.minimum.toFixed(1)}°`}
            testID="hinge-minimum"
          />
          <Reading
            label="Highest"
            value={session.maximum === null ? 'No samples' : `${session.maximum.toFixed(1)}°`}
            testID="hinge-maximum"
          />
          <Reading
            label="Events"
            value={session.events.toLocaleString()}
            testID="hinge-event-count"
          />
        </FieldGroup.Section>

        <FieldGroup.Section>
          <Button
            label="Reset session"
            variant="outlined"
            onPress={reset}
            disabled={!hinge && session.events === 0}
            testID="hinge-reset"
          />
          <FieldGroup.SectionFooter>
            <Text
              textStyle={{ fontSize: 13, color: secondary }}
              style={{ paddingBottom: insets.bottom + 8 }}>
              {
                'Fold and unfold the device to collect readings. Reset starts a new session at the current angle.'
              }
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
}
