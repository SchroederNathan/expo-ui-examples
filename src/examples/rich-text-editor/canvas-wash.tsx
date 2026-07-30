import { Image, ZStack } from '@expo/ui/swift-ui';
import { blur, foregroundStyle, offset } from '@expo/ui/swift-ui/modifiers';

type BlobProps = {
  colors: string[];
  x: number;
  y: number;
  size: number;
};

function Blob({ colors, x, y, size }: BlobProps) {
  return (
    <Image
      systemName="circle.fill"
      size={size}
      modifiers={[
        foregroundStyle({
          type: 'linearGradient',
          colors,
          startPoint: { x: 0, y: 0 },
          endPoint: { x: 1, y: 1 },
        }),
        offset({ x, y }),
        blur(70),
      ]}
    />
  );
}

// Liquid Glass is a refraction of whatever sits behind it, so on a flat canvas the
// format bar reads as five plain circles. These two heavily blurred blobs give it
// something to bend — the lower one sits behind the bar on purpose. The alpha is
// kept low so this stays a writing surface rather than a poster.
export function CanvasWash() {
  return (
    <ZStack>
      <Blob colors={['#0A84FF3D', '#5E5CE63D']} x={-100} y={-150} size={300} />
      <Blob colors={['#FF9F0A33', '#FF375F33']} x={110} y={130} size={330} />
    </ZStack>
  );
}
