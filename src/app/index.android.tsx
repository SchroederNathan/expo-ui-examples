import { Column, Host, ListItem, Surface, Text, useMaterialColors } from '@expo/ui/jetpack-compose';
import {
  clickable,
  fillMaxSize,
  fillMaxWidth,
  padding,
  verticalScroll,
} from '@expo/ui/jetpack-compose/modifiers';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ANDROID_EXAMPLES } from '@/examples/registry';

// Android counterpart to the SwiftUI list in `index.tsx`. Built with Jetpack
// Compose so the example browser is native on both platforms.
export default function ExampleList() {
  const router = useRouter();
  const colors = useMaterialColors();
  const insets = useSafeAreaInsets();

  return (
    <Host style={{ flex: 1 }}>
      <Surface color={colors.background} modifiers={[fillMaxSize()]}>
        <Column modifiers={[fillMaxWidth(), verticalScroll()]}>
          <Text
            color={colors.onBackground}
            style={{ typography: 'displaySmall' }}
            modifiers={[padding(20, insets.top + 24, 20, 12)]}>
            Examples
          </Text>

          {ANDROID_EXAMPLES.map((example) => (
            <ListItem
              key={example.slug}
              modifiers={[
                clickable(() =>
                  router.push({ pathname: '/[slug]', params: { slug: example.slug } })
                ),
              ]}>
              <ListItem.HeadlineContent>
                <Text>{example.title}</Text>
              </ListItem.HeadlineContent>
              <ListItem.SupportingContent>
                <Text>{example.description}</Text>
              </ListItem.SupportingContent>
            </ListItem>
          ))}
        </Column>
      </Surface>
    </Host>
  );
}
