import {
  Box,
  CircularProgressIndicator,
  CircularWavyProgressIndicator,
  Column,
  ContainedLoadingIndicator,
  LinearProgressIndicator,
  LinearWavyProgressIndicator,
  LoadingIndicator,
  OutlinedCard,
  Row,
  Text,
  type MaterialColors,
} from '@expo/ui/jetpack-compose';
import { fillMaxWidth, paddingAll, size } from '@expo/ui/jetpack-compose/modifiers';

const CELL = 56;

// Every indeterminate variant, unstyled. None of them is passed a color — they read
// the Host's Material 3 palette, so this whole card retints with the system theme.
export function GalleryCard({ colors }: { colors: MaterialColors }) {
  return (
    <OutlinedCard modifiers={[fillMaxWidth()]}>
      <Column modifiers={[paddingAll(20)]} verticalArrangement={{ spacedBy: 18 }}>
        <Column verticalArrangement={{ spacedBy: 4 }}>
          <Text color={colors.onSurface} style={{ typography: 'titleMedium' }}>
            Indeterminate set
          </Text>
          <Text color={colors.onSurfaceVariant} style={{ typography: 'bodySmall' }}>
            Omit <Text style={{ fontFamily: 'monospace' }}>progress</Text> and each one
            animates on its own forever.
          </Text>
        </Column>

        <Row horizontalArrangement="spaceEvenly" modifiers={[fillMaxWidth()]}>
          <Cell label="Loading" colors={colors}>
            <LoadingIndicator />
          </Cell>
          <Cell label="Contained" colors={colors}>
            <ContainedLoadingIndicator />
          </Cell>
          <Cell label="Wavy" colors={colors}>
            <CircularWavyProgressIndicator />
          </Cell>
          <Cell label="Circular" colors={colors}>
            <CircularProgressIndicator />
          </Cell>
        </Row>

        <Column verticalArrangement={{ spacedBy: 12 }}>
          <Bar label="LinearWavyProgressIndicator" colors={colors}>
            <LinearWavyProgressIndicator modifiers={[fillMaxWidth()]} />
          </Bar>
          <Bar label="LinearProgressIndicator" colors={colors}>
            <LinearProgressIndicator modifiers={[fillMaxWidth()]} />
          </Bar>
        </Column>
      </Column>
    </OutlinedCard>
  );
}

function Cell({
  label,
  colors,
  children,
}: {
  label: string;
  colors: MaterialColors;
  children: React.ReactNode;
}) {
  return (
    <Column horizontalAlignment="center" verticalArrangement={{ spacedBy: 8 }}>
      <Box modifiers={[size(CELL, CELL)]} contentAlignment="center">
        {children}
      </Box>
      <Text color={colors.onSurfaceVariant} style={{ typography: 'labelSmall' }}>
        {label}
      </Text>
    </Column>
  );
}

function Bar({
  label,
  colors,
  children,
}: {
  label: string;
  colors: MaterialColors;
  children: React.ReactNode;
}) {
  return (
    <Column verticalArrangement={{ spacedBy: 6 }} modifiers={[fillMaxWidth()]}>
      {children}
      <Text color={colors.onSurfaceVariant} style={{ typography: 'labelSmall' }}>
        {label}
      </Text>
    </Column>
  );
}
