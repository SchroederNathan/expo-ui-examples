import { Host } from '@expo/ui';
import { Capsule, ColorPicker, Rectangle, ZStack } from '@expo/ui/swift-ui';
import {
  animation,
  Animation,
  fixedSize,
  font,
  foregroundStyle,
  frame,
  ignoreSafeArea,
  shadow,
} from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';

// Tap the pill to open the native color wheel; the whole page takes the
// selected color. The pill is a Capsule behind the ColorPicker's own label
// and dial, because SwiftUI only opens the wheel from that dial.
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
        <Capsule
          modifiers={[
            foregroundStyle('#FFFFFF'),
            frame({ width: 232, height: 64 }),
            shadow({ radius: 24, color: '#00000033', y: 8 }),
          ]}
        />
        <ColorPicker
          label="Change color"
          selection={color}
          onSelectionChange={setColor}
          modifiers={[
            font({ textStyle: 'headline' }),
            foregroundStyle('#1C1C1E'),
            fixedSize(),
          ]}
        />
      </ZStack>
    </Host>
  );
}
