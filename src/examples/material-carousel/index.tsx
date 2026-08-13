import {
  Column,
  HorizontalCenteredHeroCarousel,
  HorizontalMultiBrowseCarousel,
  HorizontalUncontainedCarousel,
  Host,
  Surface,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { fillMaxSize, fillMaxWidth, padding, verticalScroll } from '@expo/ui/jetpack-compose/modifiers';
import type { ReactNode } from 'react';

import { PhotoCard } from './photo-card';
import { PHOTOS } from './photos';

// Material 3 Carousel — the three native Compose carousel strategies side by side,
// browsing the same photo set as the Apple Zoom example. Hero centers one large
// item between peeks, multi-browse shows a large item with smaller ones trailing,
// and uncontained scrolls fixed-width items freely.
export default function MaterialCarouselScreen() {
  const colors = useMaterialColors();

  return (
    <Host style={{ flex: 1 }}>
      <Surface color={colors.background} modifiers={[fillMaxSize()]}>
        <Column
          modifiers={[fillMaxWidth(), verticalScroll(), padding(16, 16, 16, 32)]}
          verticalArrangement={{ spacedBy: 28 }}>
          <Section
            colors={colors}
            title="Hero"
            caption="One centered item between two small peeks — singleAdvance snaps a page at a time">
            <HorizontalCenteredHeroCarousel itemSpacing={8} flingBehavior="singleAdvance">
              {PHOTOS.map((p) => (
                <PhotoCard key={p.id} photo={p} cardHeight={340} />
              ))}
            </HorizontalCenteredHeroCarousel>
          </Section>

          <Section
            colors={colors}
            title="Multi-browse"
            caption="A large item with smaller ones peeking in, so you can see what comes next">
            <HorizontalMultiBrowseCarousel
              preferredItemWidth={240}
              itemSpacing={8}
              flingBehavior="singleAdvance">
              {PHOTOS.map((p) => (
                <PhotoCard key={p.id} photo={p} cardHeight={240} />
              ))}
            </HorizontalMultiBrowseCarousel>
          </Section>

          <Section
            colors={colors}
            title="Uncontained"
            caption="Fixed-width items with free-form scrolling, no snapping">
            <HorizontalUncontainedCarousel itemWidth={172} itemSpacing={8}>
              {PHOTOS.map((p) => (
                <PhotoCard key={p.id} photo={p} cardHeight={200} />
              ))}
            </HorizontalUncontainedCarousel>
          </Section>
        </Column>
      </Surface>
    </Host>
  );
}

function Section({
  colors,
  title,
  caption,
  children,
}: {
  colors: ReturnType<typeof useMaterialColors>;
  title: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <Column modifiers={[fillMaxWidth()]} verticalArrangement={{ spacedBy: 10 }}>
      <Column verticalArrangement={{ spacedBy: 2 }}>
        <Text color={colors.onBackground} style={{ typography: 'titleMedium' }}>
          {title}
        </Text>
        <Text color={colors.onSurfaceVariant} style={{ typography: 'bodySmall' }}>
          {caption}
        </Text>
      </Column>
      {children}
    </Column>
  );
}
