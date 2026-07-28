import {
  Button,
  Column,
  ElevatedCard,
  FilledTonalButton,
  FilterChip,
  FlowRow,
  LinearWavyProgressIndicator,
  OutlinedButton,
  Row,
  Slider,
  Switch,
  Text,
} from '@expo/ui/jetpack-compose';
import { fillMaxWidth, paddingAll } from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';

const GENRES = ['Ambient', 'Shoegaze', 'Jazz', 'Post-rock'];

// Nothing here is passed a color. Every one of these is a real Material 3
// component, so they pick up the Host's palette on their own.
export function Showcase() {
  const [genre, setGenre] = useState('Shoegaze');
  const [shuffle, setShuffle] = useState(true);
  const [volume, setVolume] = useState(0.65);

  return (
    <ElevatedCard modifiers={[fillMaxWidth()]}>
      <Column modifiers={[paddingAll(16)]} verticalArrangement={{ spacedBy: 16 }}>
        <Row horizontalArrangement={{ spacedBy: 10 }}>
          <Button onClick={() => {}}>
            <Text>Play</Text>
          </Button>
          <FilledTonalButton onClick={() => {}}>
            <Text>Shuffle</Text>
          </FilledTonalButton>
          <OutlinedButton onClick={() => {}}>
            <Text>Queue</Text>
          </OutlinedButton>
        </Row>

        <FlowRow horizontalArrangement={{ spacedBy: 8 }} verticalArrangement={{ spacedBy: 8 }}>
          {GENRES.map((name) => (
            <FilterChip key={name} selected={genre === name} onClick={() => setGenre(name)}>
              <FilterChip.Label>
                <Text>{name}</Text>
              </FilterChip.Label>
            </FilterChip>
          ))}
        </FlowRow>

        <LinearWavyProgressIndicator modifiers={[fillMaxWidth()]} />

        <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 12 }}>
          <Switch value={shuffle} onCheckedChange={setShuffle} />
          <Slider value={volume} onValueChange={setVolume} modifiers={[fillMaxWidth()]} />
        </Row>
      </Column>
    </ElevatedCard>
  );
}
