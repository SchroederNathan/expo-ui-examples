import { useNativeState, type TextFieldSelection } from '@expo/ui/swift-ui';
import { useRef, useState } from 'react';

/** A URL the syntax chip drops in, left selected so it can be typed over. */
const LINK_URL = 'https://expo.dev';

/**
 * The playground's single source of truth for the markdown being edited.
 *
 * The string lives twice on purpose. `text` is an `ObservableState` the SwiftUI
 * field reads and writes, which is what lets the field start populated and lets a
 * chip rewrite it. `source` is the plain JS mirror, which is what `Text` needs —
 * it takes a string and has no observable equivalent.
 *
 * Programmatic writes to `text` deliberately do not echo back through
 * `onTextChange` (native only reports user edits), so there is no feedback loop:
 * every mutation below updates both halves itself.
 */
export function useMarkdownSource(initial: string) {
  const [source, setSource] = useState(initial);
  const text = useNativeState(initial);
  const selection = useNativeState<TextFieldSelection>({ start: 0, end: 0 });
  // Reporting the caret needs iOS 18+. Until the field reports one, edits go to the end.
  const caret = useRef<TextFieldSelection | null>(null);

  const write = (next: string, range: TextFieldSelection) => {
    text.set(next);
    selection.set(range);
    caret.current = range;
    setSource(next);
  };

  const at = () => caret.current ?? { start: source.length, end: source.length };

  return {
    source,
    /** Bind to the field's `text` prop. */
    text,
    /** Bind to the field's `selection` prop. */
    selection,
    /** Bind to the field's `onTextChange` — the user typing. */
    onTextChange: setSource,
    /** Bind to the field's `onSelectionChange`. */
    onSelectionChange: (next: TextFieldSelection) => {
      caret.current = next;
    },

    /** Replaces the whole document and parks the caret at the end. */
    load: (next: string) => {
      write(next, { start: next.length, end: next.length });
    },

    /**
     * Wraps the selection in `delimiter` on both sides, then selects what is now
     * inside it. With no selection, `word` goes in as a placeholder.
     */
    wrap: (delimiter: string, word: string) => {
      const { start, end } = at();
      const inner = start === end ? word : source.slice(start, end);
      const innerStart = start + delimiter.length;
      write(source.slice(0, start) + delimiter + inner + delimiter + source.slice(end), {
        start: innerStart,
        end: innerStart + inner.length,
      });
    },

    /** Turns the selection into a link label and leaves the URL selected. */
    link: () => {
      const { start, end } = at();
      const label = start === end ? 'link' : source.slice(start, end);
      const urlStart = start + `[${label}](`.length;
      write(`${source.slice(0, start)}[${label}](${LINK_URL})${source.slice(end)}`, {
        start: urlStart,
        end: urlStart + LINK_URL.length,
      });
    },
  };
}

export type MarkdownSource = ReturnType<typeof useMarkdownSource>;
