import { Box, Row, type MaterialColors } from '@expo/ui/jetpack-compose';
import {
  background,
  clickable,
  clip,
  fillMaxWidth,
  Shapes,
  size,
  tween,
} from '@expo/ui/jetpack-compose/modifiers';

import { MORPH_DURATION, SEEDS, type Seed } from './seeds';

// Six rings have to fit the content width, so keep them small enough that even a
// 360dp phone has room to spare and let `spaceBetween` distribute the remainder.
const SWATCH = 42;
const RING = 52;

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
export function SeedPicker({ selected, onSelect, wallpaper, colors }: Props) {
  return (
    <Row
      modifiers={[fillMaxWidth()]}
      horizontalArrangement="spaceBetween"
      verticalAlignment="center">
      {SEEDS.map((seed) => {
        const isSelected = seed.name === selected.name;
        const shape = seed.color === null ? Shapes.Material.Clover4Leaf : Shapes.Circle;
        const morph = tween({ durationMillis: MORPH_DURATION });

        return (
          <Box
            key={seed.name}
            contentAlignment="center"
            modifiers={[
              size(RING, RING),
              clip(shape),
              background(isSelected ? colors.onBackground : colors.background, {
                animationSpec: morph,
              }),
              clickable(() => onSelect(seed)),
            ]}>
            <Box
              modifiers={[
                size(SWATCH, SWATCH),
                clip(shape),
                background(seed.color ?? wallpaper.primary, { animationSpec: morph }),
              ]}
            />
          </Box>
        );
      })}
    </Row>
  );
}
