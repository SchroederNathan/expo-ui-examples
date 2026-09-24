import { useNativeState, type TextFieldSelection } from '@expo/ui/swift-ui';
import { useRef, useState } from 'react';

/** Dropped in by the link button, left selected so it can be typed over. */
const LINK_URL = 'https://expo.dev';

// The field reports and accepts selection offsets in Swift `Character`s — whole
// grapheme clusters — while JS strings index UTF-16 code units. An emoji before
// the caret is one Character but up to a dozen code units, so every offset is
// resolved against the string split into Characters, never against `.slice`.
//
// Hermes has no `Intl.Segmenter`, so code points are joined by the grapheme rules
// typed text actually hits: combining marks, variation selectors, skin tones and
// tag sequences, zero-width-joiner emoji, flag pairs, and CRLF.
const EXTEND = /[\p{M}\u200D\uFE00-\uFE0F\u{1F3FB}-\u{1F3FF}\u{E0020}-\u{E007F}]/u;
const REGIONAL = /^[\u{1F1E6}-\u{1F1FF}]$/u;

function characters(value: string): string[] {
  const chars: string[] = [];
  let afterJoiner = false;
  for (const point of value) {
    const last = chars.length - 1;
    const joins =
      last >= 0 &&
      (afterJoiner ||
        EXTEND.test(point) ||
        (point === '\n' && chars[last] === '\r') ||
        (REGIONAL.test(point) && REGIONAL.test(chars[last])));
    if (joins) {
      chars[last] += point;
    } else {
      chars.push(point);
    }
    afterJoiner = point === '\u200D';
  }
  return chars;
}

/**
 * The editor's single source of truth.
 *
 * The string lives twice on purpose. `text` is an `ObservableState` the SwiftUI
 * field reads and writes, which is what lets a format button rewrite it. `source`
 * is the plain JS mirror, which is what `Text` needs — it takes a string and has
 * no observable equivalent.
 *
 * Programmatic writes to `text` deliberately do not echo back through
 * `onTextChange` (native only reports user edits), so there is no feedback loop:
 * every mutation below updates both halves itself.
 */
export function useRichText(initial: string) {
  const [source, setSource] = useState(initial);
  const text = useNativeState(initial);
  const selection = useNativeState<TextFieldSelection>({ start: 0, end: 0 });
  // The latest text, readable before React re-renders — a format tap can land
  // between a keystroke's event and the render that commits it.
  const latest = useRef(initial);
  // Reporting the caret needs iOS 18+. Until the field reports one, edits go to
  // the end — and stay there, since a range written here is only trusted once
  // the field has proven it reports its own.
  const caret = useRef<TextFieldSelection | null>(null);

  const setText = (next: string) => {
    latest.current = next;
    setSource(next);
  };

  const write = (next: string[], range: TextFieldSelection) => {
    const value = next.join('');
    text.set(value);
    selection.set(range);
    if (caret.current != null) {
      caret.current = range;
    }
    setText(value);
  };

  /** The current text as Characters, and the selection within it. */
  const read = () => {
    const chars = characters(latest.current);
    const { start, end } = caret.current ?? { start: chars.length, end: chars.length };
    return { chars, start, end, selected: chars.slice(start, end) };
  };

  return {
    source,
    /** Bind to the field's `text` prop. */
    text,
    /** Bind to the field's `selection` prop. */
    selection,
    /** Bind to the field's `onTextChange` — the user typing. */
    onTextChange: setText,
    /** Bind to the field's `onSelectionChange`. */
    onSelectionChange: (next: TextFieldSelection) => {
      caret.current = next;
    },

    /**
     * Wraps the selection in `delimiter` on both sides, then selects what is now
     * inside it. With no selection, `word` goes in as a placeholder.
     */
    wrap: (delimiter: string, word: string) => {
      const { chars, start, end, selected } = read();
      const inner = selected.length > 0 ? selected : characters(word);
      const marks = characters(delimiter);
      const innerStart = start + marks.length;
      write([...chars.slice(0, start), ...marks, ...inner, ...marks, ...chars.slice(end)], {
        start: innerStart,
        end: innerStart + inner.length,
      });
    },

    /** Turns the selection into a link label and leaves the URL selected. */
    link: () => {
      const { chars, start, end, selected } = read();
      const label = selected.length > 0 ? selected : characters('link');
      const url = characters(LINK_URL);
      const urlStart = start + label.length + 2; // `[` and `](`
      write([...chars.slice(0, start), '[', ...label, ']', '(', ...url, ')', ...chars.slice(end)], {
        start: urlStart,
        end: urlStart + url.length,
      });
    },
  };
}

export type RichText = ReturnType<typeof useRichText>;
