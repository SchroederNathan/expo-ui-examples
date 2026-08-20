import { Host } from '@expo/ui';
import { HStack, Image, List, Section, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle } from '@expo/ui/swift-ui/modifiers';

const PLAYLISTS = [
  'Late Night Drive',
  'Sunday Reset',
  'Focus Static',
  'Long Runs',
  'Rainy Window',
  'Analog Warmth',
  'Low Light',
  'Empty Streets',
];

export default function Library() {
  return (
    <Host style={{ flex: 1 }}>
      <List>
        <Section title="Playlists">
          {PLAYLISTS.map((title) => (
            <HStack key={title} spacing={12}>
              <Image
                systemName="square.stack.fill"
                size={16}
                modifiers={[foregroundStyle({ type: 'hierarchical', style: 'secondary' })]}
              />
              <VStack alignment="leading" spacing={2}>
                <Text>{title}</Text>
                <Text
                  modifiers={[
                    font({ textStyle: 'footnote' }),
                    foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
                  ]}>
                  Playlist
                </Text>
              </VStack>
              <Spacer />
            </HStack>
          ))}
        </Section>
      </List>
    </Host>
  );
}
