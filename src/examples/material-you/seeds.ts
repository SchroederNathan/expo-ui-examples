export type Seed = {
  name: string;
  /**
   * The color the Material palette is generated from. `null` falls back to the
   * device wallpaper palette (Material You), available on Android 12+.
   */
  color: string | null;
};

export const SEEDS: Seed[] = [
  { name: 'Wallpaper', color: null },
  { name: 'Violet', color: '#8E24AA' },
  { name: 'Ocean', color: '#0061A4' },
  { name: 'Forest', color: '#2E7D32' },
  { name: 'Amber', color: '#E8590C' },
  { name: 'Rose', color: '#C2185B' },
];

/** Shared color transition so every themed surface morphs at the same rate. */
export const MORPH_DURATION = 450;
