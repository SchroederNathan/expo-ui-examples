import { useCallback, useEffect, useRef, useState } from 'react';

// How much of the remaining distance to close per frame. 0.3 keeps the content
// within a few frames of the finger during a drag while still taking ~250ms to
// glide through the sheet's settle.
const FOLLOW = 0.3;

/**
 * Eases a 0..1 progress value towards a target.
 *
 * The sheet reports its geometry on every frame while a finger is down, but not
 * during the settle after release — it goes straight to the final height in one
 * step (observed: the target jumps 0.33 -> 1.0 with nothing in between). Without
 * smoothing, the last stretch of the transition therefore snaps.
 *
 * Easing here rather than with an `animation()` modifier covers both phases with
 * one mechanism: during a drag the target moves smoothly and the follower stays
 * tight to it, and on release the target jumps while the follower glides.
 */
export function useMorph() {
  const [morph, setMorph] = useState(0);
  const target = useRef(0);
  const current = useRef(0);
  const frame = useRef<number | null>(null);

  const aim = useCallback((next: number) => {
    target.current = Math.min(1, Math.max(0, next));
    if (frame.current != null) {
      return;
    }
    const step = () => {
      const diff = target.current - current.current;
      if (Math.abs(diff) < 0.001) {
        current.current = target.current;
        setMorph(target.current);
        frame.current = null;
        return;
      }
      current.current += diff * FOLLOW;
      setMorph(current.current);
      frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    return () => {
      if (frame.current != null) {
        cancelAnimationFrame(frame.current);
      }
    };
  }, []);

  return { morph, aim };
}
