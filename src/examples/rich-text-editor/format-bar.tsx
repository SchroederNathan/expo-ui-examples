import { Image, Picker } from '@expo/ui/swift-ui';
import { accessibilityLabel, pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import type { SFSymbol } from 'sf-symbols-typescript';

import { useState } from 'react';

import type { RichText } from './use-rich-text';

type FormatBarProps = {
  state: RichText;
};

type Format = {
  /** The segment's `tag`, and what `onSelectionChange` reports back. */
  id: string;
  /** Read by VoiceOver: the segments are icon-only. */
  label: string;
  symbol: SFSymbol;
  apply: (state: RichText) => void;
};

const FORMATS: Format[] = [
  { id: 'bold', label: 'Bold', symbol: 'bold', apply: (state) => state.wrap('**', 'bold') },
  { id: 'italic', label: 'Italic', symbol: 'italic', apply: (state) => state.wrap('*', 'italic') },
  {
    id: 'strike',
    label: 'Strikethrough',
    symbol: 'strikethrough',
    apply: (state) => state.wrap('~~', 'strike'),
  },
  {
    id: 'code',
    label: 'Code',
    symbol: 'chevron.left.forwardslash.chevron.right',
    apply: (state) => state.wrap('`', 'code'),
  },
  { id: 'link', label: 'Link', symbol: 'link', apply: (state) => state.link() },
];

/** Two tags no segment carries, so neither draws a highlight. See `selection` below. */
const NOTHING = ['nothing-a', 'nothing-b'];

// The formatting bar: a segmented `Picker` of formats. `pickerStyle('segmented')` is
// what makes the picker a segmented control; `label` is required even though the
// segmented style never draws it — without a label the native view renders nothing
// at all.
export function FormatBar({ state }: FormatBarProps) {
  const [taps, setTaps] = useState(0);

  // A segmented control selects; these segments act, so the tapped one gives its
  // highlight back (a kept highlight would claim an active format, and a second
  // tap on it would not fire). Native copies `selection` only when the prop
  // changes, so "select nothing" alternates between two unused tags.
  const selection = NOTHING[taps % NOTHING.length];

  return (
    <Picker
      label="Format"
      selection={selection}
      onSelectionChange={(id) => {
        FORMATS.find((format) => format.id === id)?.apply(state);
        setTaps((count) => count + 1);
      }}
      modifiers={[pickerStyle('segmented')]}>
      {FORMATS.map((format) => (
        <Image
          key={format.id}
          systemName={format.symbol}
          size={15}
          modifiers={[tag(format.id), accessibilityLabel(format.label)]}
        />
      ))}
    </Picker>
  );
}
