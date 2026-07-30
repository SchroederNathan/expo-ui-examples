import { Button, HStack, Image, TextField } from '@expo/ui/swift-ui';
import {
  autocorrectionDisabled,
  buttonStyle,
  controlSize,
  font,
  lineLimit,
  textInputAutocapitalization,
} from '@expo/ui/swift-ui/modifiers';
import type { SFSymbol } from 'sf-symbols-typescript';

import type { MarkdownSource } from './use-markdown-source';

type MarkdownEditorProps = {
  state: MarkdownSource;
};

type Chip = {
  symbol: SFSymbol;
  /** Wrapped around the selection on both sides. */
  delimiter: string;
  /** Placeholder inserted between the delimiters when nothing is selected. */
  word: string;
};

const CHIPS: Chip[] = [
  { symbol: 'bold', delimiter: '**', word: 'bold' },
  { symbol: 'italic', delimiter: '*', word: 'italic' },
  { symbol: 'strikethrough', delimiter: '~~', word: 'strike' },
  { symbol: 'chevron.left.forwardslash.chevron.right', delimiter: '`', word: 'code' },
];

// The field plus the syntax chips. Autocorrect and autocapitalization are off —
// both fight markdown delimiters. `axis="vertical"` is what makes the field grow
// past one line; `lineLimit` caps how far.
export function MarkdownEditor({ state }: MarkdownEditorProps) {
  return (
    <>
      <TextField
        text={state.text}
        selection={state.selection}
        axis="vertical"
        placeholder="Write some markdown"
        onTextChange={state.onTextChange}
        onSelectionChange={state.onSelectionChange}
        modifiers={[
          font({ textStyle: 'callout', design: 'monospaced' }),
          lineLimit({ min: 2, max: 8 }),
          autocorrectionDisabled(),
          textInputAutocapitalization('never'),
        ]}
      />
      <HStack spacing={8}>
        {CHIPS.map((chip) => (
          <Button
            key={chip.symbol}
            onPress={() => state.wrap(chip.delimiter, chip.word)}
            modifiers={[buttonStyle('bordered'), controlSize('small')]}>
            <Image systemName={chip.symbol} size={15} />
          </Button>
        ))}
        <Button
          onPress={state.link}
          modifiers={[buttonStyle('bordered'), controlSize('small')]}>
          <Image systemName="link" size={15} />
        </Button>
      </HStack>
    </>
  );
}
