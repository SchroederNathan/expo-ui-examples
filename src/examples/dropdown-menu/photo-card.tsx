import ArrowBack from '@expo/material-symbols/arrow_back.xml';
import Check from '@expo/material-symbols/check.xml';
import ChevronRight from '@expo/material-symbols/chevron_right.xml';
import Delete from '@expo/material-symbols/delete.xml';
import Favorite from '@expo/material-symbols/favorite.xml';
import MoreVert from '@expo/material-symbols/more_vert.xml';
import PhotoAlbum from '@expo/material-symbols/photo_album.xml';
import Share from '@expo/material-symbols/share.xml';
import {
  Box,
  Column,
  DropdownMenu,
  DropdownMenuItem,
  HorizontalDivider,
  Icon,
  IconButton,
  RNHostView,
  Row,
  Text,
  type MaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  align,
  alpha,
  clip,
  fillMaxWidth,
  paddingAll,
  Shapes,
  size,
  weight,
  width as widthModifier,
} from '@expo/ui/jetpack-compose/modifiers';
import { Image } from 'expo-image';
import { useState } from 'react';

import type { Album, CardPhoto } from './index';

export const ALBUMS: Album[] = ['Travel', 'Family', 'Work'];

type Props = {
  photo: CardPhoto;
  colors: MaterialColors;
  /** Width of the card, in dp. The photo is a square of this size. */
  width: number;
  /** Whether this card's menu is the one open on screen. */
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onChange: (patch: Partial<CardPhoto>) => void;
  onDelete: () => void;
};

// One photo card: the picture, then a footer with the title, the album it is in,
// and a ⋮ icon button. Tapping the button opens a Material 3 DropdownMenu anchored
// to it. Material has no nested menus, so "Add to album" swaps the items for a
// second page with a back row instead of a submenu. The Trigger slot is not
// pressable by itself and items do not auto-dismiss, so both run through the
// shared `open` state. The iOS Pull-Down Menu example draws the same card with a
// SwiftUI Menu, for a side-by-side.
export function PhotoCard({
  photo,
  colors,
  width,
  open,
  onOpen,
  onClose,
  onChange,
  onDelete,
}: Props) {
  const [page, setPage] = useState<'root' | 'albums'>('root');

  const close = () => {
    onClose();
    setPage('root');
  };
  const pick = (patch: Partial<CardPhoto>) => {
    onChange(patch);
    close();
  };

  return (
    <Column modifiers={[widthModifier(width)]} verticalArrangement={{ spacedBy: 4 }}>
      <Box modifiers={[size(width, width), clip(Shapes.RoundedCorner(16))]}>
        {/* There is no Compose Image in @expo/ui — the photo is an expo-image hosted
            inside the Compose tree via RNHostView, sized to fill the Box. */}
        <RNHostView>
          <Image
            source={{ uri: photo.uri }}
            style={{ width, height: width }}
            contentFit="cover"
            transition={200}
          />
        </RNHostView>

        {/* Heart badge — always in the tree, faded when off, so the grid never re-lays-out. */}
        <Box modifiers={[align('topEnd'), paddingAll(10), alpha(photo.favorite ? 1 : 0)]}>
          <Icon source={Favorite} size={20} tint="#FFFFFF" />
        </Box>
      </Box>

      <Row modifiers={[fillMaxWidth()]} verticalAlignment="center">
        <Column modifiers={[weight(1)]} verticalArrangement={{ spacedBy: 2 }}>
          <Text
            color={colors.onBackground}
            style={{ typography: 'titleSmall' }}
            maxLines={1}
            overflow="ellipsis">
            {photo.title}
          </Text>
          <Text
            color={colors.onSurfaceVariant}
            style={{ typography: 'bodySmall' }}
            maxLines={1}
            overflow="ellipsis">
            {photo.album ?? 'No album'}
          </Text>
        </Column>

        <DropdownMenu expanded={open} onDismissRequest={close}>
          <DropdownMenu.Trigger>
            <IconButton onClick={onOpen}>
              <Icon source={MoreVert} size={24} tint={colors.onSurfaceVariant} />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Items>
            {page === 'root' ? (
              <>
                <DropdownMenuItem onClick={close}>
                  <DropdownMenuItem.LeadingIcon>
                    <Icon source={Share} size={24} />
                  </DropdownMenuItem.LeadingIcon>
                  <DropdownMenuItem.Text>
                    <Text>Share</Text>
                  </DropdownMenuItem.Text>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => pick({ favorite: !photo.favorite })}>
                  <DropdownMenuItem.LeadingIcon>
                    <Icon source={Favorite} size={24} />
                  </DropdownMenuItem.LeadingIcon>
                  <DropdownMenuItem.Text>
                    <Text>Favorite</Text>
                  </DropdownMenuItem.Text>
                  {photo.favorite ? (
                    <DropdownMenuItem.TrailingIcon>
                      <Icon source={Check} size={24} />
                    </DropdownMenuItem.TrailingIcon>
                  ) : null}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPage('albums')}>
                  <DropdownMenuItem.LeadingIcon>
                    <Icon source={PhotoAlbum} size={24} />
                  </DropdownMenuItem.LeadingIcon>
                  <DropdownMenuItem.Text>
                    <Text>Add to album</Text>
                  </DropdownMenuItem.Text>
                  <DropdownMenuItem.TrailingIcon>
                    <Icon source={ChevronRight} size={24} />
                  </DropdownMenuItem.TrailingIcon>
                </DropdownMenuItem>
                <HorizontalDivider />
                <DropdownMenuItem
                  elementColors={{ textColor: colors.error, leadingIconColor: colors.error }}
                  onClick={() => {
                    close();
                    onDelete();
                  }}>
                  <DropdownMenuItem.LeadingIcon>
                    <Icon source={Delete} size={24} />
                  </DropdownMenuItem.LeadingIcon>
                  <DropdownMenuItem.Text>
                    <Text>Delete</Text>
                  </DropdownMenuItem.Text>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => setPage('root')}>
                  <DropdownMenuItem.LeadingIcon>
                    <Icon source={ArrowBack} size={24} />
                  </DropdownMenuItem.LeadingIcon>
                  <DropdownMenuItem.Text>
                    <Text>Add to album</Text>
                  </DropdownMenuItem.Text>
                </DropdownMenuItem>
                <HorizontalDivider />
                {ALBUMS.map((album) => (
                  <DropdownMenuItem key={album} onClick={() => pick({ album })}>
                    <DropdownMenuItem.LeadingIcon>
                      <Icon source={PhotoAlbum} size={24} />
                    </DropdownMenuItem.LeadingIcon>
                    <DropdownMenuItem.Text>
                      <Text>{album}</Text>
                    </DropdownMenuItem.Text>
                    {photo.album === album ? (
                      <DropdownMenuItem.TrailingIcon>
                        <Icon source={Check} size={24} />
                      </DropdownMenuItem.TrailingIcon>
                    ) : null}
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenu.Items>
        </DropdownMenu>
      </Row>
    </Column>
  );
}
