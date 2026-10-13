# Android Hinge validation

Passed on 2026-10-13 with the Pixel Fold profile, Android API 36, Expo 58.0.6, and expo-hinge 58.0.1. The saved virtual device is `Expo_Hinge_Fold_API_36`.

The Android examples list opens the Hinge screen at `/hinge-android`. This screen uses live sensor events and shares the iOS demo's session hook.

Verified in the running native app:

- At 180°, the angle is `180.0°`, the system status is `Fully open`, and a new session starts with minimum and maximum at 180°.
- At 90°, the system status becomes `Partially open`, the minimum drops to 90°, the maximum remains 180°, and the event count increases.
- At 120.5°, the demo displays the fractional angle and preserves the accumulated minimum and maximum.
- At 0°, Android switches to the 1080 × 2092 cover display. The demo displays `0.0°` and `Unknown`, with minimum 0° and maximum 180°.
- Reopening at 180° restores `Fully open` and preserves the session's 0°–180° range.
- Scrolling exposes Reset session on the inner display. Pressing it at 75° sets both limits to 75° and the event count to zero.
- A subsequent 45° reading changes the minimum to 45°, keeps the maximum at 75°, and increments the event count to one.

The native Android build, TypeScript check, ESLint, and React Doctor pass. React Doctor reports 100/100. No JavaScript warnings or errors were captured during the connected debugger checks.

Validation used Argent screenshots and accessibility snapshots. The inspector sometimes retained an earlier snapshot after sensor or display changes; reconnecting the scoped Android inspection services produced fresh snapshots. The rendered readings continued to update.

See the [README emulator instructions](../../README.md#test-hinge-on-an-android-emulator) to repeat the checks. A passing emulator test does not establish whether a physical Fold 8 exposes the public hinge-angle sensor.
