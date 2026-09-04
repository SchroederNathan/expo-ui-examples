import type { Href } from 'expo-router';
import type { ComponentType } from 'react';
import type { ImageSourcePropType } from 'react-native';
import type { SFSymbol } from 'sf-symbols-typescript';

import AnimatedSymbolsScreen from './animated-symbols';
import NumericTransitionsScreen from './numeric-transitions';
import SwiftChartsScreen from './swift-charts';
import LiquidGlassScreen from './liquid-glass';
import SiriGlowScreen from './siri-glow';
import RichTextEditorScreen from './rich-text-editor';
import MaterialYouScreen from './material-you';
import ExpressiveLoadersScreen from './expressive-loaders';
import UniversalSettingsScreen from './universal-settings';
import AppleZoomScreen from './apple-zoom';
import MaterialCarouselScreen from './material-carousel';
import BottomSheetScreen from './bottom-sheet';
import MiniPlayerScreen from './mini-player';
import ColorPickerScreen from './color-picker';
import PullDownMenuScreen from './pull-down-menu';
import DropdownMenuScreen from './dropdown-menu';

// Material Symbols ship as importable Android drawables; the Compose list uses this one.
import MoreVert from '@expo/material-symbols/more_vert.xml';

type BaseExample = {
  slug: string;
  title: string;
  description: string;
  /** Used by the iOS list. Android-only examples never render it. */
  systemImage: SFSymbol;
  screen: ComponentType;
  /**
   * Route the home lists open instead of `/[slug]`, for examples that need
   * their own route files (e.g. a nested layout). `screen` still backs
   * `/[slug]` so direct links keep working.
   */
  href?: Href;
};

type WithMaterialIcon = {
  /**
   * Leading icon for the Android list. Material Symbols XML vector drawable —
   * see `assets/icons/README.md` for how these are generated.
   */
  materialIcon: ImageSourcePropType;
};

export type AndroidExample = BaseExample & WithMaterialIcon & { platform: 'android' };

/**
 * Built with the universal `@expo/ui` layer — one component tree for both
 * platforms — so it appears in the iOS list and the Android list.
 */
export type UniversalExample = BaseExample & WithMaterialIcon & { platform: 'universal' };

/** Which list the example appears in. `platform` defaults to `'ios'`. */
export type Example =
  | (BaseExample & { platform?: 'ios' })
  | AndroidExample
  | UniversalExample;

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
    slug: 'rich-text-editor',
    title: 'Rich Text Editor',
    description: 'Segmented formatting bar that rides above the keyboard',
    systemImage: 'square.and.pencil',
    screen: RichTextEditorScreen,
  },
  {
    slug: 'apple-zoom',
    title: 'Apple Zoom',
    description: 'Thumbnails that zoom into a full-screen photo with the iOS 18 transition',
    systemImage: 'photo.on.rectangle.angled',
    screen: AppleZoomScreen,
  },
  {
    slug: 'material-you',
    title: 'Material You',
    description: 'Seed a Material 3 palette from a color or the device wallpaper',
    systemImage: 'paintpalette.fill',
    platform: 'android',
    materialIcon: require('../../assets/icons/palette.xml'),
    screen: MaterialYouScreen,
  },
  {
    slug: 'expressive-loaders',
    title: 'Expressive Loaders',
    description: 'Morphing loading indicator and wavy progress driven by a fake install',
    systemImage: 'arrow.triangle.2.circlepath',
    platform: 'android',
    materialIcon: require('../../assets/icons/progress_activity.xml'),
    screen: ExpressiveLoadersScreen,
  },
  {
    slug: 'universal-settings',
    title: 'Universal Settings',
    description: 'One tree of universal components — a Form on iOS, a Material 3 list on Android',
    systemImage: 'switch.2',
    platform: 'universal',
    materialIcon: require('../../assets/icons/tune.xml'),
    screen: UniversalSettingsScreen,
  },
  {
    slug: 'material-carousel',
    title: 'Material 3 Carousel',
    description: 'Hero, multi-browse, and uncontained carousels browsing one photo set',
    systemImage: 'rectangle.stack',
    platform: 'android',
    materialIcon: require('../../assets/icons/view_carousel.xml'),
    screen: MaterialCarouselScreen,
  },
  {
    slug: 'bottom-sheet',
    title: 'Bottom Sheet',
    description: 'A universal bottom sheet that grows to fit its content',
    systemImage: 'rectangle.bottomhalf.inset.filled',
    platform: 'universal',
    materialIcon: require('../../assets/icons/bottom_panel_open.xml'),
    screen: BottomSheetScreen,
  },
  {
    slug: 'mini-player',
    title: 'Tab Bar Mini Player',
    description: 'A mini player docked above a liquid-glass tab bar with NativeTabs.BottomAccessory',
    systemImage: 'play.circle.fill',
    screen: MiniPlayerScreen,
    // The demo is its own NativeTabs layout built from real route files, so
    // the list jumps straight into it rather than through a landing screen.
    href: '/mini-player/demo',
  },
  {
    slug: 'color-picker',
    title: 'Color Picker',
    description: 'Native SwiftUI color picker',
    systemImage: 'paintpalette.fill',
    screen: ColorPickerScreen,
  },
  {
    slug: 'pull-down-menu',
    title: 'Pull-Down Menu',
    description: 'Tap the ellipsis on a photo card for a SwiftUI Menu with a favorite toggle and album submenu',
    systemImage: 'ellipsis.circle',
    screen: PullDownMenuScreen,
  },
  {
    slug: 'dropdown-menu',
    title: 'Dropdown Menu',
    description: 'Tap the more button on a photo card for a Material 3 DropdownMenu with a favorite toggle and album submenu',
    systemImage: 'filemenu.and.selection',
    platform: 'android',
    materialIcon: MoreVert,
    screen: DropdownMenuScreen,
  },
];

export const IOS_EXAMPLES = EXAMPLES.filter((e) => (e.platform ?? 'ios') === 'ios');
export const ANDROID_EXAMPLES = EXAMPLES.filter(
  (e): e is AndroidExample => e.platform === 'android'
);

/**
 * Listed under their own heading on both home screens rather than mixed into the
 * platform lists — the point of a universal example is that it isn't either one.
 */
export const UNIVERSAL_EXAMPLES = EXAMPLES.filter(
  (e): e is UniversalExample => e.platform === 'universal'
);
