import {
  Divider,
  Host,
  Spacer,
  Text,
  TextField,
  VStack,
  ZStack,
  type TextFieldRef,
} from '@expo/ui/swift-ui';
import {
  autocorrectionDisabled,
  font,
  foregroundStyle,
  lineLimit,
  multilineTextAlignment,
  padding,
  textInputAutocapitalization,
} from '@expo/ui/swift-ui/modifiers';

import { useRef } from 'react';

import { CanvasWash } from './canvas-wash';
import { FormatBar } from './format-bar';
import { useRichText } from './use-rich-text';

const INITIAL_SOURCE = 'Select a word, then hit **bold**.';

// Rich Text Editor — type markdown, watch it render, and format the selection from
// a glass bar that rides above the keyboard.
//
// The bar is pinned to the bottom of the `Host` and nothing tracks the keyboard in
// JS. SwiftUI insets its content for the keyboard's safe area, so the whole tree
// shrinks when the keyboard opens and the trailing `Spacer` collapses — which lifts
// the bar and keeps the editor centered in whatever space is left. `@expo/ui` has
// no keyboard-toolbar API, and this needs none.
//
// Requires iOS 17+; the glass bar needs iOS 26+ and the format buttons reposition
// the caret, which needs iOS 18+ (without it they append to the end).
export default function RichTextEditorScreen() {
  const state = useRichText(INITIAL_SOURCE);
  const field = useRef<TextFieldRef>(null);

  // A `Text` with an empty string renders nothing, which would collapse the layout.
  const rendered = state.source.length > 0 ? state.source : 'Start typing…';

  return (
    <Host style={{ flex: 1 }}>
      <ZStack>
        <CanvasWash />

        <VStack spacing={0}>
          <Spacer />

          <VStack spacing={20} modifiers={[padding({ leading: 24, trailing: 24 })]}>
            <Text
              markdownEnabled
              modifiers={[
                font({ textStyle: 'title2' }),
                multilineTextAlignment('leading'),
                lineLimit({ min: 1, max: 8 }),
              ]}>
              {rendered}
            </Text>

            <Divider />

            <TextField
              ref={field}
              text={state.text}
              selection={state.selection}
              axis="vertical"
              autoFocus
              placeholder="Write something"
              onTextChange={state.onTextChange}
              onSelectionChange={state.onSelectionChange}
              modifiers={[
                font({ textStyle: 'callout', design: 'monospaced' }),
                foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
                lineLimit({ min: 1, max: 6 }),
                // Both fight markdown delimiters.
                autocorrectionDisabled(),
                textInputAutocapitalization('never'),
              ]}
            />
          </VStack>

          <Spacer />

          <FormatBar state={state} onDismiss={() => field.current?.blur()} />
        </VStack>
      </ZStack>
    </Host>
  );
}
