import {
  Host,
  Icon,
  LazyColumn,
  ListItem,
  Surface,
  Text,
  useMaterialColors,
  type MaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  background,
  clickable,
  clip,
  fillMaxSize,
  fillMaxWidth,
  padding,
  paddingAll,
  Shapes,
  size,
} from '@expo/ui/jetpack-compose/modifiers';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ANDROID_EXAMPLES,
  UNIVERSAL_EXAMPLES,
  type AndroidExample,
  type UniversalExample,
} from '@/examples/registry';

const CHEVRON = require('../../assets/icons/chevron_right.xml');

// Material 3 "grouped list" corner treatment: the group reads as one rounded
// slab, so only its outer corners get the full radius and the seams stay tight.
const GROUP_RADIUS = 24;
const SEAM_RADIUS = 6;

function groupCorners(index: number, count: number) {
  const top = index === 0 ? GROUP_RADIUS : SEAM_RADIUS;
  const bottom = index === count - 1 ? GROUP_RADIUS : SEAM_RADIUS;
  return { topStart: top, topEnd: top, bottomStart: bottom, bottomEnd: bottom };
}

type RowProps = {
  example: AndroidExample | UniversalExample;
  /** Position within its own group, so each group rounds independently. */
  index: number;
  count: number;
  colors: MaterialColors;
  onPress: () => void;
};

function ExampleRow({ example, index, count, colors, onPress }: RowProps) {
  return (
    <ListItem
      colors={{
        containerColor: colors.surfaceContainerHigh,
        contentColor: colors.onSurface,
        supportingContentColor: colors.onSurfaceVariant,
        trailingContentColor: colors.onSurfaceVariant,
      }}
      // `clip` before `clickable` so the ripple stays inside the shape.
      modifiers={[
        fillMaxWidth(),
        clip(Shapes.RoundedCorner(groupCorners(index, count))),
        clickable(onPress),
      ]}>
      <ListItem.LeadingContent>
        {/*
          Sized through modifiers rather than the `size` prop: the prop is
          applied ahead of them, so `padding` would eat into the glyph
          instead of growing the tonal circle around it. 22 + 9 * 2 = 40dp.
        */}
        <Icon
          source={example.materialIcon}
          tint={colors.onSecondaryContainer}
          modifiers={[
            clip(Shapes.Circle),
            background(colors.secondaryContainer),
            paddingAll(9),
            size(22, 22),
          ]}
        />
      </ListItem.LeadingContent>
      <ListItem.HeadlineContent>
        <Text style={{ typography: 'titleMedium' }}>{example.title}</Text>
      </ListItem.HeadlineContent>
      <ListItem.SupportingContent>
        <Text style={{ typography: 'bodyMedium' }}>{example.description}</Text>
      </ListItem.SupportingContent>
      <ListItem.TrailingContent>
        <Icon source={CHEVRON} size={20} tint={colors.onSurfaceVariant} />
      </ListItem.TrailingContent>
    </ListItem>
  );
}

// Android counterpart to the SwiftUI list in `index.tsx`. Built with Jetpack
// Compose so the example browser is native on both platforms.
export default function ExampleList() {
  const router = useRouter();
  const colors = useMaterialColors();
  const insets = useSafeAreaInsets();

  const open = (slug: string) => router.push({ pathname: '/[slug]', params: { slug } });

  return (
    <Host style={{ flex: 1 }}>
      <Surface color={colors.background} modifiers={[fillMaxSize()]}>
        <LazyColumn
          modifiers={[fillMaxSize()]}
          verticalArrangement={{ spacedBy: 3 }}
          contentPadding={{
            start: 16,
            end: 16,
            top: insets.top + 16,
            bottom: insets.bottom + 24,
          }}>
          <Text
            color={colors.onBackground}
            style={{ typography: 'displaySmall' }}
            modifiers={[padding(4, 8, 4, 16)]}>
            Examples
          </Text>

          {ANDROID_EXAMPLES.map((example, index) => (
            <ExampleRow
              key={example.slug}
              example={example}
              index={index}
              count={ANDROID_EXAMPLES.length}
              colors={colors}
              onPress={() => open(example.slug)}
            />
          ))}

          {/* Universal examples get their own group rather than sitting among the
              Compose ones: the same screens are listed on iOS too. */}
          <Text
            color={colors.onSurfaceVariant}
            style={{ typography: 'titleSmall' }}
            modifiers={[padding(4, 28, 4, 12)]}>
            Universal
          </Text>

          {UNIVERSAL_EXAMPLES.map((example, index) => (
            <ExampleRow
              key={example.slug}
              example={example}
              index={index}
              count={UNIVERSAL_EXAMPLES.length}
              colors={colors}
              onPress={() => open(example.slug)}
            />
          ))}
        </LazyColumn>
      </Surface>
    </Host>
  );
}
