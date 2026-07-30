import { Form, Host, Section, Text } from '@expo/ui/swift-ui';
import {
  foregroundStyle,
  multilineTextAlignment,
  scrollDismissesKeyboard,
} from '@expo/ui/swift-ui/modifiers';

import { MarkdownEditor } from './markdown-editor';
import { INITIAL_SOURCE, LITERAL, SUPPORTED } from './samples';
import { SyntaxRow } from './syntax-row';
import { useMarkdownSource } from './use-markdown-source';

// Markdown — a playground for `markdownEnabled` on the SwiftUI `Text`. The flag
// hands the string to `LocalizedStringKey`, so SwiftUI parses markdown while it
// renders: no parser, no library, no nested `Text`. It is inline-only, though —
// emphasis, strikethrough, code spans and links work, while headings, lists and
// quotes come through as literal characters. Newlines are kept, so a multi-line
// source renders as multiple lines with each one parsed on its own. Type in the
// field and the next two sections show the same string with the flag on and off.
//
// Requires iOS 17+. The chips reposition the caret, which needs iOS 18+; without
// it they append to the end instead.
export default function MarkdownScreen() {
  const state = useMarkdownSource(INITIAL_SOURCE);

  // A `Text` with an empty string renders nothing, which would collapse the row.
  const preview = state.source.length > 0 ? state.source : 'Nothing to render yet.';

  return (
    <Host style={{ flex: 1 }}>
      {/* `immediately` so any scroll frees the cheat sheet from the keyboard —
          `interactively` never fired here, since a Form's drag is not the
          downward gesture that mode waits for. */}
      <Form modifiers={[scrollDismissesKeyboard('immediately')]}>
        <Section
          title="Source"
          footer={<Text>Select some text, then tap a chip to wrap it.</Text>}>
          <MarkdownEditor state={state} />
        </Section>

        <Section
          title="markdownEnabled"
          footer={
            <Text markdownEnabled>
              {'The flag makes the string a `LocalizedStringKey`, which SwiftUI parses as markdown.'}
            </Text>
          }>
          <Text markdownEnabled modifiers={[multilineTextAlignment('leading')]}>
            {preview}
          </Text>
        </Section>

        <Section title="Without the flag">
          <Text
            modifiers={[
              multilineTextAlignment('leading'),
              foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
            ]}>
            {preview}
          </Text>
        </Section>

        <Section
          title="Supported"
          footer={
            <Text markdownEnabled>
              {'Either `*` or `_` works for emphasis, and a backslash escapes one. The image is parsed but collapses to its alt text — a `Text` cannot host one. Tap a row to load it above.'}
            </Text>
          }>
          {SUPPORTED.map((syntax) => (
            <SyntaxRow key={syntax} syntax={syntax} onPress={() => state.load(syntax)} />
          ))}
        </Section>

        <Section
          title="Renders literally"
          footer={
            <Text>
              {'Block syntax is left alone, so both columns are the same string. That is the point, not a bug. Newlines do survive — the parse is inline-only, not single-line.'}
            </Text>
          }>
          {LITERAL.map((syntax) => (
            <SyntaxRow key={syntax} syntax={syntax} onPress={() => state.load(syntax)} />
          ))}
        </Section>
      </Form>
    </Host>
  );
}
