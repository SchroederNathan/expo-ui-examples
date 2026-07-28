import { Host } from '@expo/ui';
import { Button, HStack, Image, Label, List, Section, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import { buttonStyle, font, foregroundStyle } from '@expo/ui/swift-ui/modifiers';
import { useRouter } from 'expo-router';

import { IOS_EXAMPLES, UNIVERSAL_EXAMPLES, type Example } from '@/examples/registry';

function ExampleRow({ example, onPress }: { example: Example; onPress: () => void }) {
  return (
    <Button onPress={onPress} modifiers={[buttonStyle('plain')]}>
      <HStack spacing={0}>
        <Label systemImage={example.systemImage}>
          <VStack alignment="leading" spacing={2}>
            <Text>{example.title}</Text>
            <Text
              modifiers={[
                font({ textStyle: 'footnote' }),
                foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
              ]}>
              {example.description}
            </Text>
          </VStack>
        </Label>
        <Spacer />
        <Image
          systemName="chevron.right"
          size={14}
          modifiers={[foregroundStyle({ type: 'hierarchical', style: 'tertiary' })]}
        />
      </HStack>
    </Button>
  );
}

export default function ExampleList() {
  const router = useRouter();
  const open = (slug: string) => router.push({ pathname: '/[slug]', params: { slug } });

  return (
    <Host style={{ flex: 1 }}>
      <List>
        <Section>
          {IOS_EXAMPLES.map((example) => (
            <ExampleRow key={example.slug} example={example} onPress={() => open(example.slug)} />
          ))}
        </Section>

        {/* Universal examples get their own group rather than sitting among the
            SwiftUI ones: the same screens are listed on Android too. */}
        <Section title="Universal">
          {UNIVERSAL_EXAMPLES.map((example) => (
            <ExampleRow key={example.slug} example={example} onPress={() => open(example.slug)} />
          ))}
        </Section>
      </List>
    </Host>
  );
}
