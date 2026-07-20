import { Host } from '@expo/ui';
import { Button, HStack, Image, Label, List, Section, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import { buttonStyle, font, foregroundStyle } from '@expo/ui/swift-ui/modifiers';
import { useRouter } from 'expo-router';

import { EXAMPLES } from '@/examples/registry';

export default function ExampleList() {
  const router = useRouter();

  return (
    <Host style={{ flex: 1 }}>
      <List>
        <Section>
          {EXAMPLES.map((example) => (
            <Button
              key={example.slug}
              onPress={() =>
                router.push({ pathname: '/[slug]', params: { slug: example.slug } })
              }
              modifiers={[buttonStyle('plain')]}>
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
          ))}
        </Section>
      </List>
    </Host>
  );
}
