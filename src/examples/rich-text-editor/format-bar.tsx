import { Button, GlassEffectContainer, HStack, Image } from '@expo/ui/swift-ui';
import {
  buttonBorderShape,
  buttonStyle,
  controlSize,
  frame,
  padding,
} from '@expo/ui/swift-ui/modifiers';
import type { SFSymbol } from 'sf-symbols-typescript';

import type { RichText } from './use-rich-text';

type FormatBarProps = {
  state: RichText;
  /** Drops the keyboard. The field has no other way down: `axis="vertical"` means
   *  the return key inserts a newline instead of submitting. */
  onDismiss: () => void;
};

type Format = {
  symbol: SFSymbol;
  /** Wrapped around the selection on both sides. */
  delimiter: string;
  /** Placeholder inserted between the delimiters when nothing is selected. */
  word: string;
};

const FORMATS: Format[] = [
  { symbol: 'bold', delimiter: '**', word: 'bold' },
  { symbol: 'italic', delimiter: '*', word: 'italic' },
  { symbol: 'strikethrough', delimiter: '~~', word: 'strike' },
  { symbol: 'chevron.left.forwardslash.chevron.right', delimiter: '`', word: 'code' },
];

// The formatting bar. `buttonStyle('glass')` is what makes each button Liquid
// Glass; the GlassEffectContainer lets neighbours blend rather than each carrying
// its own separate pane. `'glass'` needs iOS 26+ — verified on 26.5 only, so treat
// the look below that as unknown.
//
// Glass refracts what is behind it, so the bar reads as plain circles on a flat
// canvas. That is what `CanvasWash` is for.
export function FormatBar({ state, onDismiss }: FormatBarProps) {
  const glass = [buttonStyle('glass'), buttonBorderShape('circle'), controlSize('large')];

  return (
    <GlassEffectContainer spacing={20}>
      {/* Clears the home indicator with the keyboard down, and leaves a little air
          above the keyboard with it up. */}
      <HStack spacing={10} modifiers={[padding({ bottom: 10 })]}>
        {FORMATS.map((format) => (
          <Button
            key={format.symbol}
            onPress={() => state.wrap(format.delimiter, format.word)}
            modifiers={glass}>
            <Image
              systemName={format.symbol}
              size={17}
              modifiers={[frame({ width: 22, height: 22 })]}
            />
          </Button>
        ))}
        <Button onPress={state.link} modifiers={glass}>
          <Image systemName="link" size={17} modifiers={[frame({ width: 22, height: 22 })]} />
        </Button>
        <Button onPress={onDismiss} modifiers={glass}>
          <Image
            systemName="keyboard.chevron.compact.down"
            size={17}
            modifiers={[frame({ width: 22, height: 22 })]}
          />
        </Button>
      </HStack>
    </GlassEffectContainer>
  );
}
