import {
  Box,
  Button,
  Column,
  ContainedLoadingIndicator,
  ElevatedCard,
  LinearWavyProgressIndicator,
  OutlinedButton,
  Row,
  Text,
  type MaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  graphicsLayer,
  paddingAll,
  size,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';

import { useInstall, type Stage } from './use-install';

// `ContainedLoadingIndicator` draws at a fixed 48dp — Compose takes the size as a
// `containerSize` parameter, which isn't exposed as a prop, so `size()` alone would
// only pad it. Scaling in a graphics layer blows it up for real; that doesn't affect
// layout, so the surrounding Box reserves the space the scaled loader ends up needing.
const HERO_SCALE = 2.2;
const HERO_BOX = 48 * HERO_SCALE + 8;

const COPY: Record<Stage, { title: string; detail: string }> = {
  idle: { title: 'Aurora 3.2', detail: '142 MB · ready to install' },
  downloading: { title: 'Downloading', detail: '142 MB from 3 mirrors' },
  verifying: { title: 'Verifying', detail: 'Checking the package signature' },
  done: { title: 'Installed', detail: 'Aurora 3.2 is ready to run' },
};

export function InstallCard({ colors }: { colors: MaterialColors }) {
  const { stage, percent, progress, start, cancel } = useInstall();

  // Both loaders below take the indeterminate branch whenever `progress` is absent,
  // so one flag switches the pair between "measurable" and "still working on it".
  // Only the trailing verify step has nothing to report.
  const determinate = stage !== 'verifying';
  const busy = stage === 'downloading' || stage === 'verifying';
  const copy = COPY[stage];

  return (
    <ElevatedCard modifiers={[fillMaxWidth()]}>
      <Column modifiers={[paddingAll(20)]} verticalArrangement={{ spacedBy: 20 }}>
        <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 18 }}>
          <Box modifiers={[size(HERO_BOX, HERO_BOX)]} contentAlignment="center">
            <ContainedLoadingIndicator
              progress={determinate ? progress : undefined}
              modifiers={[graphicsLayer({ scaleX: HERO_SCALE, scaleY: HERO_SCALE })]}
            />
          </Box>

          <Column modifiers={[weight(1)]} verticalArrangement={{ spacedBy: 4 }}>
            <Text color={colors.onSurface} style={{ typography: 'titleLarge' }}>
              {copy.title}
            </Text>
            <Text color={colors.onSurfaceVariant} style={{ typography: 'bodyMedium' }}>
              {copy.detail}
            </Text>
          </Column>
        </Row>

        <Column verticalArrangement={{ spacedBy: 10 }}>
          {/* The wavy bar takes progress as an ordinary number, so this one does
              re-render with React — once per whole percent. */}
          <LinearWavyProgressIndicator
            progress={determinate ? percent / 100 : null}
            modifiers={[fillMaxWidth()]}
          />
          <Row horizontalArrangement="spaceBetween" modifiers={[fillMaxWidth()]}>
            <Text color={colors.onSurfaceVariant} style={{ typography: 'labelMedium' }}>
              {determinate ? 'Determinate' : 'Indeterminate'}
            </Text>
            {/* Monospace so the row doesn't twitch as the digits change. */}
            <Text
              color={colors.onSurfaceVariant}
              style={{ typography: 'labelMedium', fontFamily: 'monospace' }}>
              {determinate ? `${percent}%` : '--'}
            </Text>
          </Row>
        </Column>

        {busy ? (
          <OutlinedButton onClick={cancel} modifiers={[fillMaxWidth()]}>
            <Text>Cancel</Text>
          </OutlinedButton>
        ) : (
          <Button onClick={start} modifiers={[fillMaxWidth()]}>
            <Text>{stage === 'done' ? 'Install again' : 'Install'}</Text>
          </Button>
        )}
      </Column>
    </ElevatedCard>
  );
}
