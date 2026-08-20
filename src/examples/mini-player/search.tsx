import { Host } from '@expo/ui';
import { HStack, Image, List, Section, Spacer, Text } from '@expo/ui/swift-ui';
import { foregroundStyle } from '@expo/ui/swift-ui/modifiers';
import type { SFSymbol } from 'sf-symbols-typescript';

const CATEGORIES: { title: string; icon: SFSymbol }[] = [
  { title: 'New Music', icon: 'sparkles' },
  { title: 'Charts', icon: 'chart.bar.fill' },
  { title: 'Radio', icon: 'dot.radiowaves.left.and.right' },
  { title: 'Moods', icon: 'face.smiling' },
  { title: 'Decades', icon: 'clock.fill' },
  { title: 'Live Sessions', icon: 'music.mic' },
];

export default function Search() {
  return (
    <Host style={{ flex: 1 }}>
      <List>
        <Section title="Browse Categories">
          {CATEGORIES.map(({ title, icon }) => (
            <HStack key={title} spacing={12}>
              <Image
                systemName={icon}
                size={16}
                modifiers={[foregroundStyle({ type: 'hierarchical', style: 'secondary' })]}
              />
              <Text>{title}</Text>
              <Spacer />
            </HStack>
          ))}
        </Section>
      </List>
    </Host>
  );
}
