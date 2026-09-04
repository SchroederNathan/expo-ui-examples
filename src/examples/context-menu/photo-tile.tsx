import {
  Button,
  ContextMenu,
  Divider,
  Image as SymbolImage,
  Menu,
  RNHostView,
  Text,
  Toggle,
  VStack,
  ZStack,
} from '@expo/ui/swift-ui';
import {
  animation,
  Animation,
  background,
  clipShape,
  contentShape,
  font,
  foregroundStyle,
  frame,
  opacity,
  padding,
  scaleEffect,
  shadow,
  shapes,
} from '@expo/ui/swift-ui/modifiers';
import { Image } from 'expo-image';

import type { Album, TilePhoto } from './index';

export const ALBUMS: Album[] = ['Travel', 'Family', 'Work'];

// The preview is the same photo, just bigger — 4:5 like the Photos app.
const PREVIEW_WIDTH = 300;
const PREVIEW_HEIGHT = 375;

type Props = {
  photo: TilePhoto;
  /** Side of the square tile, in points. */
  size: number;
  onChange: (patch: Partial<TilePhoto>) => void;
  onDelete: () => void;
};

// One photo tile. Long-press it for the native context menu: a large preview
// above, and below it a plain action, a Toggle that renders as a checkmark row,
// a Menu that opens a submenu, a Divider, and a destructive Button. Every
// choice writes straight back onto the tile so the menu's effect is visible
// without leaving the grid. The Android example mirrors this screen with a
// Compose DropdownMenu, so the two can sit side by side.
export function PhotoTile({ photo, size, onChange, onDelete }: Props) {
  return (
    <ContextMenu>
      <ContextMenu.Trigger>
        <ZStack
          alignment="topTrailing"
          modifiers={[
            frame({ width: size, height: size }),
            clipShape('roundedRectangle', 16),
            // The lifted preview keeps the tile's rounded corners instead of
            // snapshotting a sharp rectangle.
            contentShape(shapes.roundedRectangle({ cornerRadius: 16 }), 'contextMenuPreview'),
          ]}>
          {/* There is no remote-image SwiftUI view in @expo/ui, so the photo is an
              expo-image hosted inside the SwiftUI tree. matchContents sizes the
              host from the RN view, which therefore needs explicit dimensions. */}
          <RNHostView matchContents>
            <Image
              source={{ uri: photo.uri }}
              style={{ width: size, height: size, borderRadius: 16 }}
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

          {/* Album caption, pinned to the bottom-leading corner. */}
          <VStack
            alignment="leading"
            modifiers={[frame({ width: size, height: size, alignment: 'bottomLeading' })]}>
            <Text
              modifiers={[
                font({ textStyle: 'caption2', weight: 'semibold' }),
                foregroundStyle('#FFFFFF'),
                padding({ horizontal: 8, vertical: 4 }),
                background('#00000099', shapes.capsule()),
                padding({ all: 10 }),
                opacity(photo.album ? 1 : 0),
                animation(Animation.easeInOut({ duration: 0.2 }), photo.album ? 1 : 0),
              ]}>
              {photo.album ?? ' '}
            </Text>
          </VStack>
        </ZStack>
      </ContextMenu.Trigger>

      <ContextMenu.Items>
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
      </ContextMenu.Items>

      <ContextMenu.Preview>
        <VStack>
          <RNHostView matchContents>
            <Image
              source={{ uri: photo.uri }}
              style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
              contentFit="cover"
            />
          </RNHostView>
        </VStack>
      </ContextMenu.Preview>
    </ContextMenu>
  );
}
