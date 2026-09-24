import { Box, Row, type MaterialColors } from '@expo/ui/jetpack-compose';
import {
  background,
  clip,
  fillMaxWidth,
  selectable,
  selectableGroup,
  Shapes,
  size,
  tween,
} from '@expo/ui/jetpack-compose/modifiers';

import { MORPH_DURATION, SEEDS, type Seed } from './seeds';

// Six rings have to fit the content width, so keep them small enough that even a
// 360dp phone has room to spare and let `spaceBetween` distribute the remainder.
const SWATCH = 42;
const RING = 52;

const MORPH = tween({ durationMillis: MORPH_DURATION });

type Props = {
  selected: Seed;
  onSelect: (seed: Seed) => void;
  /** Palette the wallpaper produces, used to color the "Wallpaper" swatch itself. */
  wallpaper: MaterialColors;
  colors: MaterialColors;
};

// A row of seed colors. Each swatch is a Box clipped to a Material shape, nested
// in a larger Box that paints the selection ring — `border` has no shape param,
// so a ring drawn this way follows the clover as faithfully as the circles.
// `selectable` with the radio button role tells TalkBack which seed is chosen.
export function SeedPicker({ selected, onSelect, wallpaper, colors }: Props) {
  return (
    <Row
      modifiers={[fillMaxWidth(), selectableGroup()]}
      horizontalArrangement="spaceBetween"
      verticalAlignment="center">
      {SEEDS.map((seed) => {
        const isSelected = seed.name === selected.name;
        const shape = seed.color === null ? Shapes.Material.Clover4Leaf : Shapes.Circle;

        return (
          <Box
            key={seed.name}
            contentAlignment="center"
            modifiers={[
              size(RING, RING),
              clip(shape),
              background(isSelected ? colors.onBackground : colors.background, {
                animationSpec: MORPH,
              }),
              selectable(isSelected, () => onSelect(seed), 'radioButton'),
            ]}>
            <Box
              modifiers={[
                size(SWATCH, SWATCH),
                clip(shape),
                background(seed.color ?? wallpaper.primary, { animationSpec: MORPH }),
              ]}
            />
          </Box>
        );
      })}
    </Row>
  );
}
