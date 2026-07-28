import { Host } from '@expo/ui';
import { Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle } from '@expo/ui/swift-ui/modifiers';

export default function UniversalSettingsScreen() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={12}>
        <Text modifiers={[font({ textStyle: 'headline' })]}>Universal Settings</Text>
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
