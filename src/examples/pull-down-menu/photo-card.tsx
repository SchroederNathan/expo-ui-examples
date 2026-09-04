import {
  Button,
  Divider,
  HStack,
  Image as SymbolImage,
  Menu,
  RNHostView,
  Spacer,
  Text,
  Toggle,
  VStack,
  ZStack,
} from '@expo/ui/swift-ui';
import {
  animation,
  Animation,
  clipShape,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  opacity,
  padding,
  scaleEffect,
  shadow,
} from '@expo/ui/swift-ui/modifiers';
import { Image } from 'expo-image';

import type { Album, CardPhoto } from './index';

export const ALBUMS: Album[] = ['Travel', 'Family', 'Work'];

type Props = {
  photo: CardPhoto;
  /** Width of the card, in points. The photo is a square of this size. */
  width: number;
  onChange: (patch: Partial<CardPhoto>) => void;
  onDelete: () => void;
};

// One photo card: the picture, then a footer with the title, the album it is in,
// and an ellipsis button. Tapping the ellipsis opens a SwiftUI Menu — Apple's
// pull-down menu — with a plain action, a Toggle that renders as a checkmark row,
// a nested Menu for the album submenu, a Divider, and a destructive Button.
// Every choice writes straight back onto the card. The Android Dropdown Menu
// example draws the same card with a Material 3 menu, for a side-by-side.
export function PhotoCard({ photo, width, onChange, onDelete }: Props) {
  return (
    <VStack alignment="leading" spacing={8} modifiers={[frame({ width })]}>
      <ZStack
        alignment="topTrailing"
        modifiers={[frame({ width, height: width }), clipShape('roundedRectangle', 16)]}>
        {/* There is no remote-image SwiftUI view in @expo/ui, so the photo is an
            expo-image hosted inside the SwiftUI tree. matchContents sizes the host
            from the RN view, which therefore needs explicit dimensions. */}
        <RNHostView matchContents>
          <Image
            source={{ uri: photo.uri }}
            style={{ width, height: width, borderRadius: 16 }}
            contentFit="cover"
            transition={200}
          />
        </RNHostView>

        {/* Heart badge — always in the tree, faded and shrunk when off, so
            toggling it never re-lays-out the grid. */}
        <SymbolImage
          systemName="heart.fill"
          size={18}
          color="#FFFFFF"
          modifiers={[
            padding({ all: 10 }),
            shadow({ radius: 6, color: '#00000066', y: 1 }),
            opacity(photo.favorite ? 1 : 0),
            scaleEffect(photo.favorite ? 1 : 0.4),
            animation(Animation.spring({ duration: 0.35 }), photo.favorite),
          ]}
        />
      </ZStack>

      <HStack spacing={8}>
        <VStack alignment="leading" spacing={2}>
          <Text modifiers={[font({ textStyle: 'subheadline', weight: 'semibold' }), lineLimit(1)]}>
            {photo.title}
          </Text>
          <Text
            modifiers={[
              font({ textStyle: 'footnote' }),
              foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
              lineLimit(1),
            ]}>
            {photo.album ?? 'No album'}
          </Text>
        </VStack>
        <Spacer />
        <Menu
          label={
            <SymbolImage
              systemName="ellipsis.circle"
              size={22}
              modifiers={[foregroundStyle({ type: 'hierarchical', style: 'secondary' })]}
            />
          }>
          <Button label="Share" systemImage="square.and.arrow.up" onPress={() => {}} />
          <Toggle
            label="Favorite"
            systemImage="heart"
            isOn={photo.favorite}
            onIsOnChange={(favorite) => onChange({ favorite })}
          />
          <Menu label="Add to Album" systemImage="rectangle.stack.badge.plus">
            {ALBUMS.map((album) => (
              <Button
                key={album}
                label={album}
                systemImage={photo.album === album ? 'checkmark' : 'rectangle.stack'}
                onPress={() => onChange({ album })}
              />
            ))}
          </Menu>
          <Divider />
          <Button label="Delete" systemImage="trash" role="destructive" onPress={onDelete} />
        </Menu>
      </HStack>
    </VStack>
  );
}
