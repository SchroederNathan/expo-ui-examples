import type { ComponentType } from 'react';
import type { SFSymbol } from 'sf-symbols-typescript';

import AnimatedSymbolsScreen from './animated-symbols';
import NumericTransitionsScreen from './numeric-transitions';
import SwiftChartsScreen from './swift-charts';
import LiquidGlassScreen from './liquid-glass';
import SiriGlowScreen from './siri-glow';
import MusicPlayerScreen from './music-player';
import MaterialYouScreen from './material-you';

export type Example = {
  slug: string;
  title: string;
  description: string;
  /** Used by the iOS list. Android-only examples never render it. */
  systemImage: SFSymbol;
  /** Which list the example appears in. Defaults to `'ios'`. */
  platform?: 'ios' | 'android';
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
  {
    slug: 'music-player',
    title: 'Music Player',
    description: 'Mini-player that drags up into a full-screen now-playing sheet',
    systemImage: 'music.note',
    screen: MusicPlayerScreen,
  },
  {
    slug: 'material-you',
    title: 'Material You',
    description: 'Seed a Material 3 palette from a color or the device wallpaper',
    systemImage: 'paintpalette.fill',
    platform: 'android',
    screen: MaterialYouScreen,
  },
];

export const IOS_EXAMPLES = EXAMPLES.filter((e) => (e.platform ?? 'ios') === 'ios');
export const ANDROID_EXAMPLES = EXAMPLES.filter((e) => e.platform === 'android');
