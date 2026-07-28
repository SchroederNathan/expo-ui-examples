import {
  Box,
  CircularWavyProgressIndicator,
  Column,
  LinearWavyProgressIndicator,
  LoadingIndicator,
  OutlinedCard,
  Row,
  Slider,
  Text,
  useNativeState,
  type MaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  graphicsLayer,
  paddingAll,
  size,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';

// Same trick as the install card: the morph has no size prop, so scale the layer and
// reserve the room. 38dp is the indicator's intrinsic size when it isn't contained.
const SCALE = 1.7;
const BOX = 38 * SCALE + 8;

export function ScrubCard({ colors }: { colors: MaterialColors }) {
  const [value, setValue] = useState(0.35);
  const progress = useNativeState<number | null>(0.35);

  // The slider is a JS component, so its value lands in React state either way. The
  // native state exists only because that's the shape `LoadingIndicator` wants.
  const scrub = (next: number) => {
    setValue(next);
    progress.set(next);
  };

  return (
    <OutlinedCard modifiers={[fillMaxWidth()]}>
      <Column modifiers={[paddingAll(20)]} verticalArrangement={{ spacedBy: 16 }}>
        <Column verticalArrangement={{ spacedBy: 4 }}>
          <Text color={colors.onSurface} style={{ typography: 'titleMedium' }}>
            Scrub the morph
          </Text>
          <Text color={colors.onSurfaceVariant} style={{ typography: 'bodySmall' }}>
            Determinate loaders don&apos;t just fill — the shape itself is a function of
            progress. Drag to see it.
          </Text>
        </Column>

        <Row verticalAlignment="center" horizontalArrangement="spaceEvenly" modifiers={[fillMaxWidth()]}>
          <Column horizontalAlignment="center" verticalArrangement={{ spacedBy: 8 }}>
            <Box modifiers={[size(BOX, BOX)]} contentAlignment="center">
              <LoadingIndicator
                progress={progress}
                modifiers={[graphicsLayer({ scaleX: SCALE, scaleY: SCALE })]}
              />
            </Box>
            <Text color={colors.onSurfaceVariant} style={{ typography: 'labelSmall' }}>
              LoadingIndicator
            </Text>
          </Column>

          <Column horizontalAlignment="center" verticalArrangement={{ spacedBy: 8 }}>
            <Box modifiers={[size(BOX, BOX)]} contentAlignment="center">
              <CircularWavyProgressIndicator progress={value} />
            </Box>
            <Text color={colors.onSurfaceVariant} style={{ typography: 'labelSmall' }}>
              CircularWavy
            </Text>
          </Column>
        </Row>

        <LinearWavyProgressIndicator progress={value} modifiers={[fillMaxWidth()]} />

        <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 14 }}>
          <Slider value={value} onValueChange={scrub} modifiers={[weight(1)]} />
          <Text
            color={colors.onSurfaceVariant}
            style={{ typography: 'labelMedium', fontFamily: 'monospace' }}>
            {`${Math.round(value * 100)}%`.padStart(4, ' ')}
          </Text>
        </Row>
      </Column>
    </OutlinedCard>
  );
}
