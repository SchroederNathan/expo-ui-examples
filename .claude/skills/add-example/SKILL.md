---
name: add-example
description: Add a new example/demo screen to the expo-ui-examples app — scaffold the example folder, register it in the registry, build the UI with @expo/ui, and verify it in the iOS simulator. Use when asked to add, create, or scaffold a new example or demo in this repo.
---

# Add an example to expo-ui-examples

Every example is one folder under `src/examples/<slug>/` plus one entry in `src/examples/registry.ts`. The list row on the home screen and the `/[slug]` route come for free from the registry — never touch `src/app/` to add an example. All paths below are relative to the repo root.

## 1. Scaffold

```bash
node .claude/skills/add-example/scaffold.mjs <slug> "<Title>" "<Description>" [sf-symbol]
```

Example (verified):

```bash
node .claude/skills/add-example/scaffold.mjs gauges "Gauges" "Native SwiftUI gauge styles" gauge.with.needle
```

This creates `src/examples/<slug>/index.tsx` (a compiling placeholder screen) and inserts the registry import + entry. It refuses to run on an existing slug or from the wrong directory.

## 2. Build the example UI

Replace the placeholder in `src/examples/<slug>/index.tsx`; put extra components as sibling files in the same folder (see `src/examples/swift-charts/` for the pattern: `index.tsx` screen + `animated-chart.tsx` component).

Rules for this repo:

- **Entire UI is @expo/ui.** Pick one of three flavors and stay in it:
  - **iOS-only** — components from `@expo/ui/swift-ui`, modifiers from `@expo/ui/swift-ui/modifiers`. Omit `platform` in the registry.
  - **Android-only** — components from `@expo/ui/jetpack-compose`, modifiers from `.../modifiers`. Registry needs `platform: 'android'` + a `materialIcon`.
  - **Universal** — *every* import from the `@expo/ui` root, one tree for both platforms: no `.ios.tsx`/`.android.tsx`, no `Platform.OS`, no `modifiers` escape hatch. Registry needs `platform: 'universal'` plus both `systemImage` and `materialIcon`, and the example must be verified on an iOS simulator **and** an Android emulator.
- Never mix `@expo/ui/swift-ui` and `@expo/ui/jetpack-compose` in one file — importing either on the wrong platform crashes with "Unable to get view config".
- Keep the example **self-contained in its folder** so it can be dropped into any SDK 57 project as-is. That includes its icons: example-owned drawables go in `src/examples/<slug>/icons/`, and only the registry row icon lives in `assets/icons/`.
- Confirm APIs against the installed types — `node_modules/@expo/ui/build/<swift-ui|jetpack-compose|universal>/<Component>/index.d.ts` — and the versioned docs (https://docs.expo.dev/versions/v57.0.0/), per AGENTS.md.
- React Compiler is enabled: never name a component `Symbol`, and avoid `!` non-null assertions.

## 3. Verify

```bash
npx tsc --noEmit
```

Then check it in the iOS simulator via Expo Go (argent MCP tools):

1. Start the dev server with an **explicit free port** — `bunx expo start --port 8090`. Ports 8081/8082 are often held by the older sibling demo projects' Metro servers, and in a non-interactive shell expo's "use another port?" prompt is silently skipped, so without `--port` the server just doesn't start.
2. `open-url` → `exp://127.0.0.1:8090` on a booted simulator (Expo Go is installed).
3. `await-ui-element` for the new example's title, `describe` to get the row's coordinates, `gesture-tap` it, and confirm the screen renders with the right nav title.

A registry change alone is picked up by Fast Refresh — no reload needed.

## Removing an example

Delete `src/examples/<slug>/` and its import + entry in `registry.ts`. Safe even while that screen is open: `src/app/[slug].tsx` redirects unknown slugs back to the list (verified).

## Gotchas

- The scaffold inserts the import after the last `import` line and the entry before the closing `];` of `EXAMPLES` — keep `registry.ts` in that shape.
- List rows on the home screen are `Button`s with `buttonStyle('plain')`; without `plain`, everything inside a SwiftUI List button renders tint-blue. Already handled in `src/app/index.tsx` — new examples don't touch it.
- Typed routes: navigate with the object form `router.push({ pathname: '/[slug]', params: { slug } })`, not a template string.
- `debugger-reload-metro` can fail against this Expo Go setup ("CDP Page.reload unsupported… /reload 404"). Don't rely on it — Fast Refresh covers JS edits, and re-opening the `exp://` URL does a full reload.

Universal-layer gotchas (all verified against `@expo/ui@57.0.7`):

- **The universal type surface is the _web_ declaration.** `@expo/ui` maps to `build/universal/index.d.ts`, so TypeScript shows you the union of every platform's props — e.g. `Host` accepts `ignoreSafeArea` on Android, where it's a runtime no-op. Type-checking a universal prop proves nothing about whether it does anything; read the `.ios.tsx` / `.android.tsx` source.
- **`Text` in a `SectionHeader`/`SectionFooter` needs an explicit color.** Compose's `Host` provides no `Surface` and `MaterialTheme` doesn't set `LocalContentColor` (default: black), so slot text is black-on-black in Android dark mode. Text inside rows is fine — Material's `ListItem` supplies content colors.
- **A `FieldGroup` must be its `Host`'s only child** — it's a `LazyColumn` on Android, and an unweighted child of a Compose `Column` gets an infinite max-height constraint, which throws for a lazy list. Put titles inside it via a section header slot.
- **`<Spacer />` needs `flexible`** — it's flexible by default on iOS but 0dp on Android. It's also what makes a `Row` fill its width inside a Compose `ListItem`; `style={{ width: '100%' }}` silently doesn't translate on either platform.
- `Checkbox` renders a SwiftUI `Toggle` on iOS, identical to `Switch` — don't put them in the same section.
