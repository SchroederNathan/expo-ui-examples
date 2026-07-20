# Expo UI Examples

A collection of small, self-contained [`@expo/ui`](https://docs.expo.dev/versions/latest/sdk/ui/) demos (Expo SDK 57). The whole app is built with Expo UI — a native SwiftUI `List` links to each example.

## Examples

| Example | What it shows |
| --- | --- |
| [Animated Symbols](src/examples/animated-symbols) | Tap SF Symbols to play `symbolEffect` animations |
| [Numeric Transitions](src/examples/numeric-transitions) | Counter with `numericText` content transitions and glass buttons |
| [Swift Charts](src/examples/swift-charts) | Every native `Chart` type animating on one shared data set |

Each example lives in its own folder under `src/examples/` with all of its components, so a demo can be dropped into any Expo SDK 57 project as-is. New examples register themselves in [`src/examples/registry.ts`](src/examples/registry.ts).

> iOS only — the examples use `@expo/ui/swift-ui` (SF Symbols, Swift Charts, glass buttons). Requires iOS 17+.

## Get started

1. Install dependencies

   ```bash
   bun install
   ```

2. Start the app

   ```bash
   bunx expo start --ios
   ```

## Structure

```
src/
  app/
    _layout.tsx     Stack navigator
    index.tsx       Expo UI List of all examples
    [slug].tsx      Renders the example matching the route
  examples/
    registry.ts     One entry per example (slug, title, icon, screen)
    <example>/
      index.tsx     The example's screen
      *.tsx         The example's components
```
