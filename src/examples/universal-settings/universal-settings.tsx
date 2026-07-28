import {
  Button,
  Checkbox,
  Column,
  FieldGroup,
  Host,
  Icon,
  Row,
  Slider,
  Spacer,
  Switch,
  Text,
} from '@expo/ui';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccentSwatches } from './accent-swatches';
import { ACCENTS, DEFAULT_TEXT_SIZE, MAX_TEXT_SIZE, MIN_TEXT_SIZE } from './accents';

// SF Symbols mirror themselves in a right-to-left layout; an XML vector drawable
// needs `android:autoMirrored`, which @expo/ui's loader doesn't read — so this
// arrow keeps pointing left while the RTL switch below is on.
const BACK = Icon.select({ ios: 'chevron.backward', android: require('./icons/arrow_back.xml') });

type Props = {
  /** Owned by the route adapter so this tree stays free of navigation. */
  onBack: () => void;
};

export function UniversalSettings({ onBack }: Props) {
  const systemScheme = useColorScheme();

  // Seeded from the device so the screen opens looking like the rest of the OS,
  // then owned by the switch below — `colorScheme` is passed explicitly either way
  // so the toggle always visibly does something, even on an already-dark device.
  const [dark, setDark] = useState(systemScheme === 'dark');
  const [accent, setAccent] = useState(ACCENTS[0].color);
  const [textSize, setTextSize] = useState(DEFAULT_TEXT_SIZE);
  const [rightToLeft, setRightToLeft] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [crashReports, setCrashReports] = useState(true);

  const insets = useSafeAreaInsets();

  // Header and footer slots render outside the row containers — on Android that
  // means outside the Compose `ListItem` that provides `LocalContentColor`, whose
  // default is black. Text in those slots needs an explicit color; text inside
  // rows inherits the right one on both platforms.
  const titleColor = dark ? '#FFFFFF' : '#000000';
  const captionColor = dark ? '#98989F' : '#6C6C70';

  const reset = () => {
    setDark(systemScheme === 'dark');
    setAccent(ACCENTS[0].color);
    setTextSize(DEFAULT_TEXT_SIZE);
    setRightToLeft(false);
    setNotifications(true);
    setSounds(true);
    setCrashReports(true);
  };

  return (
    <>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <Host
        // Remounting on a direction change is deliberate. Flipping
        // `layoutDirection` on a live Host leaves the SwiftUI subtree
        // mirror-imaged — glyphs and all — and the switch that flipped it stops
        // responding, so there's no way back. A fresh Host each way is reliable.
        key={rightToLeft ? 'rtl' : 'ltr'}
        style={{ flex: 1 }}
        colorScheme={dark ? 'dark' : 'light'}
        seedColor={accent}
        layoutDirection={rightToLeft ? 'rightToLeft' : 'leftToRight'}
        // SwiftUI insets its content for the safe area and Compose doesn't. Opting
        // out on iOS puts both platforms edge to edge, so the group's background
        // runs under the status bar on both and a single shared `insets` path — the
        // header row below, and the closing footer — handles the rest. The prop is
        // a no-op on Android, which never insets anyway.
        ignoreSafeArea="all">
        {/* `FieldGroup` scrolls itself — a SwiftUI Form on iOS, a Material 3 grouped
            LazyColumn on Android — and has to be the Host's only child, since a lazy
            list measured with unbounded height throws on Android. That's why the
            screen title lives inside it, in a section header slot. */}
        <FieldGroup>
          {/* No `title` on this section: a `SectionHeader` slot overrides it on both
              platforms, and the screen title is doing that job here. */}
          <FieldGroup.Section>
            <FieldGroup.SectionHeader>
              <Row alignment="center" spacing={12} style={{ paddingTop: insets.top + 8 }}>
                <Icon name={BACK} size={20} color={titleColor} onPress={onBack} />
                <Text textStyle={{ fontSize: 30, fontWeight: '700', color: titleColor }}>
                  Settings
                </Text>
              </Row>
            </FieldGroup.SectionHeader>

            {/* No `Picker` here. It's the universal component for a choice like
                this, but the two platforms render it too differently to belong in
                an example about writing one tree: iOS gets a compact menu button,
                Android a Material exposed dropdown whose anchor is a filled
                `TextField` with no caret, and `PickerProps` exposes no `style` to
                close the gap. A `Switch` says the same thing identically on both. */}
            <Switch label="Dark appearance" value={dark} onValueChange={setDark} />

            <Column spacing={10}>
              <Text>Accent</Text>
              <AccentSwatches selected={accent} onSelect={setAccent} />
            </Column>

            <Switch
              label="Right-to-left layout"
              value={rightToLeft}
              onValueChange={setRightToLeft}
            />

            <FieldGroup.SectionFooter>
              <Text textStyle={{ fontSize: 13, color: captionColor }}>
                Every control here writes back to the same Host: the color scheme, the seed color,
                and the layout direction. Seeding tints the controls on iOS and grows a whole
                Material 3 palette on Android.
              </Text>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>

          <FieldGroup.Section title="Text">
            <Row alignment="center">
              <Text>Size</Text>
              <Spacer flexible />
              <Text>{`${textSize}pt`}</Text>
            </Row>
            {/* The slider gets its own row. A Compose Slider is greedy, so pairing it
                with a label in one Row starves whatever follows it. */}
            <Slider
              value={textSize}
              onValueChange={(value) => setTextSize(Math.round(value))}
              min={MIN_TEXT_SIZE}
              max={MAX_TEXT_SIZE}
              step={1}
            />
            <Text textStyle={{ fontSize: textSize }} numberOfLines={3}>
              This preview scales as you drag.
            </Text>

            <FieldGroup.SectionFooter>
              <Text textStyle={{ fontSize: 13, color: captionColor }}>
                Scoped to this section on purpose — a Switch label is a plain string with no text
                style, so a screen-wide size control would leave those rows behind.
              </Text>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>

          <FieldGroup.Section title="Notifications">
            <Switch
              label="Allow notifications"
              value={notifications}
              onValueChange={setNotifications}
            />
            <Switch
              label="Sounds"
              value={sounds}
              onValueChange={setSounds}
              disabled={!notifications}
            />
          </FieldGroup.Section>

          <FieldGroup.Section title="Diagnostics">
            <Checkbox
              label="Send crash reports"
              value={crashReports}
              onValueChange={setCrashReports}
            />

            <FieldGroup.SectionFooter>
              <Text textStyle={{ fontSize: 13, color: captionColor }}>
                A real Material checkbox on Android. SwiftUI has no checkbox for a form row, so on
                iOS the same component renders the toggle you see above — which is why it sits in a
                section of its own.
              </Text>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>

          <FieldGroup.Section>
            <Button variant="outlined" label="Reset all settings" onPress={reset} />

            <FieldGroup.SectionFooter>
              <Text
                textStyle={{ fontSize: 13, color: captionColor }}
                style={{ paddingBottom: insets.bottom + 8 }}>
                One component tree, no platform files: every import on this screen comes from the
                @expo/ui root.
              </Text>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>
        </FieldGroup>
      </Host>
    </>
  );
}
