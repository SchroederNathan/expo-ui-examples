import { useSyncExternalStore } from 'react';

import { TRACKS } from './tracks';

type PlayerState = { trackIndex: number; playing: boolean };

let state: PlayerState = { trackIndex: 0, playing: true };
const listeners = new Set<() => void>();

function update(patch: Partial<PlayerState>) {
  state = { ...state, ...patch };
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Play state shared between the accessory (rendered inside the tab bar) and
// the player (a separate formSheet route) — the two live on different routes,
// so the state lives outside both.
export const player = {
  toggle: () => update({ playing: !state.playing }),
  next: () => update({ trackIndex: (state.trackIndex + 1) % TRACKS.length }),
  prev: () => update({ trackIndex: (state.trackIndex - 1 + TRACKS.length) % TRACKS.length }),
};

export function usePlayer(): PlayerState {
  return useSyncExternalStore(subscribe, () => state);
}
