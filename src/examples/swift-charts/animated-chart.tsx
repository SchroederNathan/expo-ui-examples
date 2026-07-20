// Usage: <AnimatedCharts /> — every native Swift Charts type from @expo/ui/swift-ui, one shared data set, animating as points are added and removed. iOS 16+ (pie 17+).
import { Host } from '@expo/ui';
import {
  Button,
  Chart,
  HStack,
  Image,
  Text,
  VStack,
  type ChartDataPoint,
  type ChartType,
} from '@expo/ui/swift-ui';
import {
  buttonBorderShape,
  buttonStyle,
  controlSize,
  font,
  foregroundStyle,
  frame,
} from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';

const CHART_ROWS: ChartType[][] = [
  ['bar', 'line'],
  ['area', 'point'],
  ['pie', 'rectangle'],
];

const COLORS = ['#0A84FF', '#5E5CE6', '#BF5AF2', '#FF375F', '#FF9F0A', '#30D158'];

const makeBar = (index: number): ChartDataPoint => ({
  x: `${index + 1}`,
  y: Math.round(20 + Math.random() * 80),
  color: COLORS[index % COLORS.length],
});

const INITIAL_BARS = [64, 38, 82, 51].map((y, i) => ({ ...makeBar(i), y }));

export function AnimatedCharts() {
  const [data, setData] = useState<ChartDataPoint[]>(INITIAL_BARS);

  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={20}>
        {CHART_ROWS.map((row) => (
          <HStack key={row.join('-')} spacing={20}>
            {row.map((type) => (
              <VStack key={type} spacing={6}>
                <Text
                  modifiers={[
                    font({ textStyle: 'footnote', weight: 'semibold' }),
                    foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
                  ]}>
                  {type}
                </Text>
                <Chart
                  type={type}
                  data={data}
                  barStyle={{ cornerRadius: 4 }}
                  lineStyle={{ width: 2 }}
                  pointStyle={{ pointSize: 60 }}
                  pieStyle={{ innerRadius: 0.5, angularInset: 2 }}
                  modifiers={[frame({ width: 165, height: 160 })]}
                />
              </VStack>
            ))}
          </HStack>
        ))}
        <HStack spacing={16}>
          <Button
            onPress={() => setData((bars) => (bars.length > 1 ? bars.slice(0, -1) : bars))}
            modifiers={[buttonStyle('glass'), buttonBorderShape('circle'), controlSize('large')]}>
            <Image systemName="minus" size={20} modifiers={[frame({ width: 24, height: 24 })]} />
          </Button>
          <Button
            onPress={() => setData((bars) => [...bars, makeBar(bars.length)])}
            modifiers={[buttonStyle('glass'), buttonBorderShape('circle'), controlSize('large')]}>
            <Image systemName="plus" size={20} modifiers={[frame({ width: 24, height: 24 })]} />
          </Button>
        </HStack>
      </VStack>
    </Host>
  );
}
