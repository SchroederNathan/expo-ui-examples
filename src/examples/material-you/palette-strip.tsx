import { Column, Row, Text, type MaterialColors } from '@expo/ui/jetpack-compose';
import {
  background,
  clip,
  height,
  paddingAll,
  Shapes,
  tween,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';

import { MORPH_DURATION } from './seeds';

type Token = { label: string; color: string; onColor: string };

type Props = { colors: MaterialColors };

// The generated palette, straight from `useMaterialColors()`. Every block animates
// its background, so switching seeds reads as a morph rather than a hard cut.
export function PaletteStrip({ colors }: Props) {
  const accents: Token[] = [
    { label: 'primary', color: colors.primary, onColor: colors.onPrimary },
    { label: 'secondary', color: colors.secondary, onColor: colors.onSecondary },
    { label: 'tertiary', color: colors.tertiary, onColor: colors.onTertiary },
  ];

  const containers: Token[] = [
    {
      label: 'primaryContainer',
      color: colors.primaryContainer,
      onColor: colors.onPrimaryContainer,
    },
    {
      label: 'secondaryContainer',
      color: colors.secondaryContainer,
      onColor: colors.onSecondaryContainer,
    },
    {
      label: 'tertiaryContainer',
      color: colors.tertiaryContainer,
      onColor: colors.onTertiaryContainer,
    },
  ];

  return (
    <Column verticalArrangement={{ spacedBy: 8 }}>
      <TokenRow tokens={accents} tall />
      <TokenRow tokens={containers} />
    </Column>
  );
}

function TokenRow({ tokens, tall = false }: { tokens: Token[]; tall?: boolean }) {
  return (
    <Row horizontalArrangement={{ spacedBy: 8 }}>
      {tokens.map((token) => (
        <Column
          key={token.label}
          verticalArrangement="bottom"
          modifiers={[
            weight(1),
            height(tall ? 96 : 64),
            clip(Shapes.RoundedCorner(20)),
            background(token.color, {
              animationSpec: tween({ durationMillis: MORPH_DURATION }),
            }),
            paddingAll(10),
          ]}>
          <Text color={token.onColor} style={{ typography: 'labelSmall' }}>
            {token.label}
          </Text>
        </Column>
      ))}
    </Row>
  );
}
