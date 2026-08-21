import { Host } from '@expo/ui';
import { Circle, ColorPicker, Rectangle, ZStack } from '@expo/ui/swift-ui';
import {
  animation,
  Animation,
  brightness,
  foregroundStyle,
  frame,
  grayscale,
  ignoreSafeArea,
  labelsHidden,
  scaleEffect,
  shadow,
} from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';

// Tap the white circle to open the native color wheel; the whole page takes
// the selected color. The circle IS the ColorPicker swatch, filtered white
// with grayscale + brightness so it stays tappable.
// Fully self-contained — drop this file into any Expo SDK 57 project.
export default function ColorPickerScreen() {
  const [color, setColor] = useState('#FF6482');
  // onSelectionChange can report #RRGGBBAA — keep the 6-digit base.
  const hex = color.slice(0, 7);

  return (
    <Host style={{ flex: 1 }}>
      <ZStack>
        <Rectangle
          modifiers={[
            foregroundStyle(hex),
            ignoreSafeArea(),
            animation(Animation.spring({ duration: 0.4 }), parseInt(hex.slice(1), 16)),
          ]}
        />
        <Circle
          modifiers={[
            foregroundStyle('#FFFFFF'),
            frame({ width: 88, height: 88 }),
            shadow({ radius: 24, color: '#00000033', y: 8 }),
          ]}
        />
        <ColorPicker
          selection={color}
          onSelectionChange={setColor}
          modifiers={[labelsHidden(), scaleEffect(2.75), grayscale(1), brightness(1)]}
        />
      </ZStack>
    </Host>
  );
}
