import { Image, Picker } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import type { SFSymbol } from 'sf-symbols-typescript';

import { useState } from 'react';

import type { RichText } from './use-rich-text';

type FormatBarProps = {
  state: RichText;
};

type Format = {
  /** The segment's `tag`, and what `onSelectionChange` reports back. */
  id: string;
  symbol: SFSymbol;
  apply: (state: RichText) => void;
};

const FORMATS: Format[] = [
  { id: 'bold', symbol: 'bold', apply: (state) => state.wrap('**', 'bold') },
  { id: 'italic', symbol: 'italic', apply: (state) => state.wrap('*', 'italic') },
  { id: 'strike', symbol: 'strikethrough', apply: (state) => state.wrap('~~', 'strike') },
  {
    id: 'code',
    symbol: 'chevron.left.forwardslash.chevron.right',
    apply: (state) => state.wrap('`', 'code'),
  },
  { id: 'link', symbol: 'link', apply: (state) => state.link() },
];

/** Two tags no segment carries, so neither draws a highlight. See `selection` below. */
const NOTHING = ['nothing-a', 'nothing-b'];

// The formatting bar: a segmented `Picker` of formats. `pickerStyle('segmented')` is
// what makes the picker a segmented control; `label` is required even though the
// segmented style never draws it — without a label the native view renders nothing
// at all.
export function FormatBar({ state }: FormatBarProps) {
  const [taps, setTaps] = useState(0);

  // A segmented control selects; these segments act, so the tapped one has to give
  // its highlight back. It cannot simply be told "select nothing": native copies
  // `selection` into the picker only when the prop *changes*, so a constant value
  // never lands. Hence two of them, alternating on every tap.
  //
  // Leaving the highlight is not an option either — it would claim an active
  // format, and a second tap on an already-selected segment is not a selection
  // change, so that format would quietly stop firing.
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
        <Image key={format.id} systemName={format.symbol} size={15} modifiers={[tag(format.id)]} />
      ))}
    </Picker>
  );
}
