import { ColorPicker, RoundedRectangle, VStack } from '@expo/ui/swift-ui';
import { Host } from '@expo/ui';
import { animation, Animation, fixedSize, foregroundStyle, frame, shadow } from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';

// Tap the swatch next to "Change color" to open the native color wheel.
// Fully self-contained — drop this file into any Expo SDK 57 project.
export default function ColorPickerScreen() {
  const [color, setColor] = useState('#FF6482');

  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={32}>
        <RoundedRectangle
          cornerRadius={48}
          modifiers={[
            foregroundStyle(color),
            frame({ width: 240, height: 240 }),
            shadow({ radius: 32, color: `${color.slice(0, 7)}66`, y: 12 }),
            animation(Animation.spring({ duration: 0.4 }), parseInt(color.slice(1), 16)),
          ]}
        />
        <ColorPicker
          label="Change color"
          selection={color}
          onSelectionChange={setColor}
          modifiers={[fixedSize()]}
        />
      </VStack>
    </Host>
  );
}
