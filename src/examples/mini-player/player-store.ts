import { useSyncExternalStore } from 'react';

import { TRACKS } from './tracks';

type PlayerState = { trackIndex: number; playing: boolean };

const TICK_SECONDS = 0.5;

let state: PlayerState = { trackIndex: 0, playing: true };
let elapsed = 0;
const listeners = new Set<() => void>();
// Kept apart from `listeners` so the tab layout, which only needs the track and
// play state, does not re-render on every tick.
const elapsedListeners = new Set<() => void>();
let ticker: ReturnType<typeof setInterval> | null = null;

function notify(set: Set<() => void>) {
  for (const listener of set) {
    listener();
  }
}

function update(patch: Partial<PlayerState>) {
  state = { ...state, ...patch };
  notify(listeners);
  syncTicker();
}

function setElapsed(value: number) {
  elapsed = value;
  notify(elapsedListeners);
}

function changeTrack(trackIndex: number) {
  setElapsed(0);
  update({ trackIndex });
}

function tick() {
  const next = elapsed + TICK_SECONDS;
  if (next >= TRACKS[state.trackIndex].duration) {
    player.next();
  } else {
    setElapsed(next);
  }
}

// The clock runs while a track is playing and some screen of the demo is
// mounted, so it stops when you leave the demo instead of ticking in the
// background for the rest of the session.
function syncTicker() {
  const shouldRun = state.playing && listeners.size + elapsedListeners.size > 0;
  if (shouldRun && ticker == null) {
    ticker = setInterval(tick, TICK_SECONDS * 1000);
  } else if (!shouldRun && ticker != null) {
    clearInterval(ticker);
    ticker = null;
  }
}

function subscribeTo(set: Set<() => void>) {
  return (listener: () => void) => {
    set.add(listener);
    syncTicker();
    return () => {
      set.delete(listener);
      syncTicker();
    };
  };
}

const subscribe = subscribeTo(listeners);
const subscribeElapsed = subscribeTo(elapsedListeners);

// Play state shared between the accessory (rendered inside the tab bar) and
// the player (a separate formSheet route) — the two live on different routes,
// so the state lives outside both. The elapsed time lives here too, so the
// scrubber keeps its place when the player sheet closes and opens again.
export const player = {
  toggle: () => update({ playing: !state.playing }),
  next: () => changeTrack((state.trackIndex + 1) % TRACKS.length),
  prev: () => changeTrack((state.trackIndex - 1 + TRACKS.length) % TRACKS.length),
};

export function usePlayer(): PlayerState {
  return useSyncExternalStore(subscribe, () => state);
}

/** Seconds into the current track. */
export function useElapsed(): number {
  return useSyncExternalStore(subscribeElapsed, () => elapsed);
}
