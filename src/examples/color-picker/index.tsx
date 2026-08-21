import { Host } from '@expo/ui';
import { Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle } from '@expo/ui/swift-ui/modifiers';

export default function ColorPickerScreen() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={12}>
        <Text modifiers={[font({ textStyle: 'headline' })]}>Color Picker</Text>
        <Text
          modifiers={[
            font({ textStyle: 'footnote' }),
            foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
          ]}>
          Build the example here.
        </Text>
      </VStack>
    </Host>
  );
}
