# Expo UI Examples

A collection of small, self-contained [`@expo/ui`](https://docs.expo.dev/versions/v58.0.0/sdk/ui/) demos (Expo SDK 58 beta). The whole app is built with Expo UI.

## Examples

| Example | What it shows |
| --- | --- |
| [Animated Symbols](src/examples/animated-symbols) | Tap SF Symbols to play `symbolEffect` animations |
| [Numeric Transitions](src/examples/numeric-transitions) | Counter with `numericText` content transitions and glass buttons |
| [Swift Charts](src/examples/swift-charts) | Every native `Chart` type animating on one shared data set |
| [Liquid Glass](src/examples/liquid-glass) | `GlassEffectContainer` morphing orbs, tinted glass, clear/regular variants (iOS 26+) |
| [Tab Bar Mini Player](src/examples/mini-player) | A mini player docked above the liquid-glass tab bar with `NativeTabs.BottomAccessory`, expanding into a full-screen player (iOS 26+) |
| [Rich Text Editor](src/examples/rich-text-editor) | Two `ConcentricRectangle` panels (iOS 26+; plain rounded panels before that), with a segmented format bar that rides the keyboard's safe area |
| [Apple Zoom](src/examples/apple-zoom) | A photo grid whose thumbnails zoom into a full-screen photo with `Link.AppleZoom` (iOS 18+) |
| [Color Picker](src/examples/color-picker) | The native SwiftUI `ColorPicker` repainting the whole page with the selected color |

### Android

| Example | What it shows |
| --- | --- |
| [Material You](src/examples/material-you) | Seed a Material 3 palette from a color or the device wallpaper with `useMaterialColors` |
| [Expressive Loaders](src/examples/expressive-loaders) | Morphing `LoadingIndicator` and wavy progress indicators driven by a fake install |
| [Material 3 Carousel](src/examples/material-carousel) | Hero, multi-browse, and uncontained native Compose carousels browsing one photo set |

### Universal

| Example | What it shows |
| --- | --- |
| [Universal Settings](src/examples/universal-settings) | One tree of universal components rendering as a SwiftUI `Form` and a Material 3 grouped list, with every control wired back into `Host` |
| [Bottom Sheet](src/examples/bottom-sheet) | A universal `BottomSheet` that fits its content and grows as additional rows are revealed |

Each example lives in its own folder under `src/examples/` with all of its components, so a demo can be dropped into any Expo SDK 58 project as-is. New examples register themselves in [`src/examples/registry.ts`](src/examples/registry.ts), where `platform` decides which list they appear in — `'universal'` puts an example in both.

An example that demos a navigation transition needs its own routes, since the transition is played by the router. Those examples own thin files under `src/app/` that render screens from the example folder — a single detail route like [`src/app/apple-zoom/[id].tsx`](src/app/apple-zoom/%5Bid%5D.tsx), or a whole `NativeTabs` layout like [`src/app/mini-player/`](src/app/mini-player).

> The iOS examples use `@expo/ui/swift-ui` (SF Symbols, Swift Charts, glass buttons) and need iOS 17+. The Android examples use `@expo/ui/jetpack-compose`; wallpaper-derived colors need Android 12+, and everything else falls back to the Material 3 baseline. The universal examples import from the `@expo/ui` root instead, so the same files run on both. Universal Settings has no platform code at all; Bottom Sheet splits only its Continue button (glass exists only in SwiftUI).

Android icons come from [`@expo/material-symbols`](https://www.npmjs.com/package/@expo/material-symbols), one import per icon, and iOS icons are SF Symbols by name.

## Get started

1. Install dependencies

   ```bash
   bun install
   ```

2. Start the app

   ```bash
   bun run ios
   # or
   bun run android
   ```

Both scripts run a native build (`expo run:*`) — `@expo/ui` renders real SwiftUI and Jetpack Compose views, so Expo Go isn't enough.

`bun run lint` runs ESLint and `bun run format` applies the repo's Prettier config.

### Demoing Material You

Driving the wallpaper picker by hand is fiddly on an emulator. Android 12+ keeps the
Material You source color in `Settings.Secure`, so you can set it directly:

```bash
adb shell "settings put secure theme_customization_overlay_packages \
  '{\"android.theme.customization.system_palette\":\"FF1B6E00\",\
    \"android.theme.customization.color_source\":\"preset\",\
    \"android.theme.customization.theme_style\":\"TONAL_SPOT\"}'"

# back to the real wallpaper palette
adb shell "settings delete secure theme_customization_overlay_packages"
```

Compose components retheme immediately. Colors read in JS through `useMaterialColors`
do not — the hook reads the palette per render but never subscribes to system changes —
so the Android examples re-render when the app returns to the foreground to keep both in sync.

## Structure

```
src/
  app/
    _layout.tsx         Stack navigator
    index.tsx           SwiftUI list of the iOS and universal examples
    index.android.tsx   Jetpack Compose list of the Android and universal examples
    [slug].tsx          Renders the example matching the route
    apple-zoom/         Route files owned by the Apple Zoom example
    mini-player/        Route files owned by the Tab Bar Mini Player example
  examples/
    registry.ts         One entry per example (slug, title, icons, screen, platform)
    <example>/
      index.tsx         The example's screen
      *.tsx             The example's components
```
