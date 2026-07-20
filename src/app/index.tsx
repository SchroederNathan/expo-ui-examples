import { Host } from '@expo/ui';
import { Button, HStack, Image, List, Section, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle, frame } from '@expo/ui/swift-ui/modifiers';
import { useRouter } from 'expo-router';

import { EXAMPLES } from '@/examples/registry';

export default function ExampleList() {
  const router = useRouter();

  return (
    <Host style={{ flex: 1 }}>
      <List>
        <Section title="Examples">
          {EXAMPLES.map((example) => (
            <Button
              key={example.slug}
              onPress={() =>
                router.push({ pathname: '/[slug]', params: { slug: example.slug } })
              }>
              <HStack spacing={14}>
                <Image
                  systemName={example.systemImage}
                  size={22}
                  modifiers={[frame({ width: 30 })]}
                />
                <VStack alignment="leading" spacing={2}>
                  <Text
                    modifiers={[foregroundStyle({ type: 'hierarchical', style: 'primary' })]}>
                    {example.title}
                  </Text>
                  <Text
                    modifiers={[
                      font({ textStyle: 'footnote' }),
                      foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
                    ]}>
                    {example.description}
                  </Text>
                </VStack>
                <Spacer />
                <Image
                  systemName="chevron.right"
                  size={14}
                  modifiers={[foregroundStyle({ type: 'hierarchical', style: 'tertiary' })]}
                />
              </HStack>
            </Button>
          ))}
        </Section>
      </List>
    </Host>
  );
}
