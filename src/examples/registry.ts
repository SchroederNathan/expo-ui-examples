import type { ComponentType } from 'react';
import type { SFSymbol } from 'sf-symbols-typescript';

import AnimatedSymbolsScreen from './animated-symbols';
import NumericTransitionsScreen from './numeric-transitions';
import SwiftChartsScreen from './swift-charts';
import LiquidGlassScreen from './liquid-glass';
import SiriGlowScreen from './siri-glow';

export type Example = {
  slug: string;
  title: string;
  description: string;
  systemImage: SFSymbol;
  screen: ComponentType;
};

export const EXAMPLES: Example[] = [
  {
    slug: 'animated-symbols',
    title: 'Animated Symbols',
    description: 'Tap SF Symbols to play symbolEffect animations',
    systemImage: 'sparkles',
    screen: AnimatedSymbolsScreen,
  },
  {
    slug: 'numeric-transitions',
    title: 'Numeric Transitions',
    description: 'Counter with numericText content transitions',
    systemImage: 'number',
    screen: NumericTransitionsScreen,
  },
  {
    slug: 'swift-charts',
    title: 'Swift Charts',
    description: 'Every native chart type animating on one data set',
    systemImage: 'chart.bar.fill',
    screen: SwiftChartsScreen,
  },
  {
    slug: 'liquid-glass',
    title: 'Liquid Glass',
    description: 'GlassEffectContainer morphing, tints, and glass buttons',
    systemImage: 'drop.fill',
    screen: LiquidGlassScreen,
  },
  {
    slug: 'siri-glow',
    title: 'Siri Glow',
    description: 'Apple Intelligence-style edge glow that hugs the device bezel with ConcentricRectangle',
    systemImage: 'sparkles',
    screen: SiriGlowScreen,
  },
];
