import { Easing, type WithTimingConfig } from 'react-native-reanimated';

// One ease-out for everything in the sheet — icons and height reveal move
// together, fast start, soft landing, no overshoot.
export const TIMING: WithTimingConfig = { duration: 400, easing: Easing.out(Easing.cubic) };
