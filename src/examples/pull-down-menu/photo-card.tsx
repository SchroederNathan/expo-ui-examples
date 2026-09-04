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
  buttonStyle,
  clipShape,
  contentShape,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  offset,
  opacity,
  padding,
  rotationEffect,
  scaleEffect,
  shadow,
  shapes,
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
        {/* A plain vertical ellipsis in the label color, to match the Android ⋮.
            SF Symbols has no bare vertical ellipsis, so the horizontal one is turned;
            the plain button style keeps the accent tint off the label. The frame gives
            the thin glyph a square tap target that grows inward, and the content shape
            makes all of it tappable. The symbol's own box has about 7pt of empty space
            after the dots, so the drawing is nudged by that much to land the ink on
            the photo's trailing edge. */}
        <Menu
          label={
            <SymbolImage
              systemName="ellipsis"
              size={15}
              modifiers={[
                rotationEffect(90),
                foregroundStyle({ type: 'hierarchical', style: 'primary' }),
                frame({ width: 28, height: 28, alignment: 'trailing' }),
                offset({ x: 7 }),
                contentShape(shapes.rectangle()),
              ]}
            />
          }
          modifiers={[buttonStyle('plain')]}>
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
