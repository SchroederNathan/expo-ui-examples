import {
  Host,
  ScrollView,
  Spacer,
  Text,
  TextField,
  VStack,
  type TextFieldRef,
} from '@expo/ui/swift-ui';
import {
  autocorrectionDisabled,
  font,
  foregroundStyle,
  ignoreSafeArea,
  lineLimit,
  multilineTextAlignment,
  padding,
  textInputAutocapitalization,
} from '@expo/ui/swift-ui/modifiers';

import { Stack } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from './card';
import { FormatBar } from './format-bar';
import { useRichText } from './use-rich-text';

// Seeds the preview with a bold run, a code span, and a line break, so all three
// show before the first tap.
const INITIAL_SOURCE = 'Select a word, then hit **bold**.\n\n`npx expo install @expo/ui`.';

/** The only place the black canvas shows: the strip between the two panels. */
const GAP = 12;

// Rich Text Editor — type markdown in the bottom panel, watch it render in the top
// one, and format the selection from a segmented bar that rides above the keyboard.
//
// Two white squircles on black, split by a `VStack`. Both run to the screen edge so
// the bezel frames the corners that reach it, which leaves the gap as the only black
// on screen. `ignoreSafeArea` is scoped to the container region for that: the keyboard
// region stays in force, so SwiftUI still insets the tree when the keyboard opens —
// the editor panel gives up the height and its format bar rises with it. Nothing
// tracks the keyboard in JS, and `@expo/ui` has no keyboard-toolbar API anyway.
//
// Since the panels run under the transparent header and the home indicator, the safe
// area becomes the content's problem — hence the insets handed to each `Card`.
//
// Tap the preview panel to dismiss the keyboard. It has no other way down: a
// multiline field spends the return key on newlines, and there is no `onSubmit` to
// catch instead.
//
// Requires iOS 26+ for the panels' concentric corners; the format segments also
// reposition the caret, which needs iOS 18+ (without it they append to the end).
export default function RichTextEditorScreen() {
  const state = useRichText(INITIAL_SOURCE);
  // The shared header is transparent and overlays the screen, so its height is not
  // part of `insets.top` — the upper panel's text has to clear it by itself.
  const header = useHeaderHeight();
  const insets = useSafeAreaInsets();

  // The keyboard covers the home indicator, so its inset would be dead space under
  // the format bar. Focus is the signal: it is what raises the keyboard.
  const [editing, setEditing] = useState(false);

  // The only way down. `axis="vertical"` spends the return key on newlines, so
  // tapping the preview panel is what dismisses the keyboard.
  const field = useRef<TextFieldRef>(null);

  // A `Text` with an empty string renders nothing, which would collapse the layout.
  const rendered = state.source.length > 0 ? state.source : 'Start typing…';

  return (
    <>
      {/* The panels are white whatever the system appearance, so the header's label
          color is pinned rather than left to follow it. */}
      <Stack.Screen
        options={{ headerTintColor: '#000000', headerTitleStyle: { color: '#000000' } }}
      />

      <Host style={{ flex: 1, backgroundColor: '#000000' }}>
        <VStack
          spacing={GAP}
          modifiers={[ignoreSafeArea({ regions: 'container', edges: 'vertical' })]}>
          {/* The header is the only thing the preview backs off for. It scrolls all
              the way to the panel's bottom edge. */}
          <Card top={header} onTap={() => field.current?.blur()}>
            {/* Scrolls rather than truncates once the rendered text outgrows the
                panel. No `lineLimit` for the same reason — a cap here would clip the
                text before the ScrollView ever got a chance to scroll it. */}
            <ScrollView showsIndicators={false}>
              <Text
                markdownEnabled
                modifiers={[
                  // Small enough that a code span the width of an install command
                  // stays on one line.
                  padding({ vertical: 16 }),
                  font({ textStyle: 'body' }),
                  multilineTextAlignment('leading'),
                ]}>
                {rendered}
              </Text>
            </ScrollView>
          </Card>

          {/* The field starts at the panel's top edge. Below, the bar sits `GAP` off
              the keyboard — the same distance the two panels sit from each other —
              plus the home indicator once the keyboard is down. */}
          <Card bottom={GAP + (editing ? 0 : insets.bottom)}>
            <TextField
              ref={field}
              text={state.text}
              selection={state.selection}
              axis="vertical"
              autoFocus
              placeholder="Write something"
              onTextChange={state.onTextChange}
              onSelectionChange={state.onSelectionChange}
              onFocusChange={setEditing}
              modifiers={[
                padding({ vertical: 16 }),
                font({ textStyle: 'callout', design: 'monospaced' }),
                foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
                lineLimit({ min: 1, max: 10 }),
                // Both fight markdown delimiters.
                autocorrectionDisabled(),
                textInputAutocapitalization('never'),
              ]}
            />

            <Spacer />

            <FormatBar state={state} />
          </Card>
        </VStack>
      </Host>
    </>
  );
}
