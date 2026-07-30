import { Button, HStack, Spacer, Text } from '@expo/ui/swift-ui';
import {
  buttonStyle,
  contentShape,
  font,
  foregroundStyle,
  frame,
  shapes,
} from '@expo/ui/swift-ui/modifiers';

type SyntaxRowProps = {
  /** Raw markdown. Printed verbatim on the left, rendered on the right. */
  syntax: string;
  onPress: () => void;
};

// One cheat-sheet row: the source on the left, the same string through
// `markdownEnabled` on the right. `buttonStyle('plain')` keeps the row from
// rendering entirely in the tint color, which is what a SwiftUI List does to
// anything inside a button.
export function SyntaxRow({ syntax, onPress }: SyntaxRowProps) {
  return (
    <Button onPress={onPress} modifiers={[buttonStyle('plain')]}>
      <HStack
        spacing={12}
        alignment="firstTextBaseline"
        modifiers={[contentShape(shapes.rectangle())]}>
        <Text
          modifiers={[
            font({ textStyle: 'footnote', design: 'monospaced' }),
            foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
            frame({ width: 150, alignment: 'leading' }),
          ]}>
          {syntax}
        </Text>
        <Text markdownEnabled modifiers={[font({ textStyle: 'footnote' })]}>
          {syntax}
        </Text>
        {/* The Spacer stretches the row to full width; `contentShape` above is what
            makes that empty space hit-testable. Without both, the only tappable text
            on the link row is the link itself, which opens Safari instead. */}
        <Spacer />
      </HStack>
    </Button>
  );
}
