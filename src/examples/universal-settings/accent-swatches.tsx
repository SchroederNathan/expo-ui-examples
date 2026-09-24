import Check from '@expo/material-symbols/check.xml';
import { Icon, Row } from '@expo/ui';

import { ACCENTS } from './accents';

// One `Icon.select` ships an SF Symbol to iOS and a Material Symbol to Android.
// A bare SF Symbol string renders nothing on Android, so cross-platform icons
// always come in pairs.
const CHECK = Icon.select({ ios: 'checkmark', android: Check });

const GLYPH = 18;
// 13pt around the 18pt glyph makes a 44pt circle: the minimum touch target.
const INSET = 13;

type Props = {
  selected: string;
  onSelect: (color: string) => void;
};

// A row of tappable color circles from universal primitives only: `style` becomes
// `.padding`/`.background`/`.clipShape` on iOS and `clip`/`background`/`padding`
// modifiers on Android. The circle is sized by its padding rather than
// `width`/`height` because neither platform can center a child horizontally inside
// a universal `Row`, so the checkmark is centered by construction.
//
// The universal layer has no accessibility props on `Row`, so the label rides on
// the checkmark `Icon`. Android reads it through the clickable row; on iOS
// `accessibilityLabel` is not wired up in @expo/ui yet.
export function AccentSwatches({ selected, onSelect }: Props) {
  return (
    <Row spacing={12} alignment="center">
      {ACCENTS.map((accent) => (
        <Row
          key={accent.name}
          alignment="center"
          style={{
            padding: INSET,
            borderRadius: (GLYPH + INSET * 2) / 2,
            backgroundColor: accent.color,
          }}
          onPress={() => onSelect(accent.color)}>
          {/* Fades rather than unmounts: `hidden` returns null on Android, which
              would collapse the circle it lives in. */}
          <Icon
            name={CHECK}
            size={GLYPH}
            color="#FFFFFF"
            accessibilityLabel={
              accent.color === selected ? `${accent.name}, selected` : accent.name
            }
            style={{ opacity: accent.color === selected ? 1 : 0 }}
          />
        </Row>
      ))}
    </Row>
  );
}
