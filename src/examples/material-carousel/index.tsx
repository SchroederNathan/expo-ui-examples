import { Column, Host, Text } from '@expo/ui/jetpack-compose';
import { padding } from '@expo/ui/jetpack-compose/modifiers';

export default function MaterialCarouselScreen() {
  return (
    <Host style={{ flex: 1 }}>
      <Column modifiers={[padding(20, 20, 20, 20)]} verticalArrangement={{ spacedBy: 12 }}>
        <Text style={{ typography: 'headlineSmall' }}>Material 3 Carousel</Text>
        <Text style={{ typography: 'bodyMedium' }}>Build the example here.</Text>
      </Column>
    </Host>
  );
}
