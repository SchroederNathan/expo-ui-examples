import { useNativeState, type ObservableState } from '@expo/ui/jetpack-compose';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * The install has two shapes of progress, and Material 3 has a loader for each:
 *
 * - `downloading` — bytes are arriving against a known total. Determinate.
 * - `verifying` — a final step with nothing to measure. Indeterminate.
 */
export type Stage = 'idle' | 'downloading' | 'verifying' | 'done';

// Don't drop the download much below this. Material 3 takes ~500ms to animate the wave
// amplitude in (see `FIRST_CHUNK`) and zeroes it again over 95%, so a very short download
// would spend most of its life either growing the wave or flattening it back out.
const DOWNLOAD_MS = 2600;
const VERIFY_MS = 900;

/**
 * Where the download starts, rather than a true zero.
 *
 * Material 3 flattens the wave entirely below 10% progress and animates the amplitude
 * back in over ~500ms — `WavyProgressIndicatorDefaults.indicatorAmplitude`, which isn't
 * exposed as a prop. Ramping from 0 therefore burns the first tenth of the download on a
 * dead flat bar before the wave even begins to grow, and the morph spends that same
 * stretch creeping through a tenth of one shape transition, so nothing appears to
 * happen on the tap.
 *
 * Opening just past the threshold means the wave and the morph are both moving on the
 * first frame — and a download that lands its first chunk at once is realistic anyway.
 */
const FIRST_CHUNK = 0.12;

export type Install = {
  stage: Stage;
  /** Whole percent, for the label and the wavy bar. */
  percent: number;
  /** Frame-accurate 0..1, for the morphing loader. */
  progress: ObservableState<number | null>;
  start: () => void;
  cancel: () => void;
};

export function useInstall(): Install {
  const [stage, setStage] = useState<Stage>('idle');
  const [percent, setPercent] = useState(0);

  // `LoadingIndicator` reads its progress through an ObservableState instead of a
  // plain prop, which is the whole reason this example splits the two values: the
  // shape morph is fed on the UI thread every frame, while React only re-renders
  // when the whole percent changes — under 90 times, however many frames that spans.
  const progress = useNativeState<number | null>(0);

  const frame = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownPercent = useRef(0);

  const clear = useCallback(() => {
    if (frame.current != null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    if (timer.current != null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => clear, [clear]);

  const download = useCallback(() => {
    setStage('downloading');
    const startedAt = Date.now();

    const step = () => {
      const elapsed = Math.min(1, (Date.now() - startedAt) / DOWNLOAD_MS);
      const value = Math.min(1, FIRST_CHUNK + (1 - FIRST_CHUNK) * elapsed);
      progress.set(value);

      const whole = Math.round(value * 100);
      if (whole !== shownPercent.current) {
        shownPercent.current = whole;
        setPercent(whole);
      }

      // Keyed off the clamped clock, not `value` — summing the floor back to exactly 1.0
      // isn't something binary floats guarantee, and a near-miss here would spin forever.
      if (elapsed < 1) {
        frame.current = requestAnimationFrame(step);
        return;
      }

      frame.current = null;
      setStage('verifying');
      timer.current = setTimeout(() => setStage('done'), VERIFY_MS);
    };

    frame.current = requestAnimationFrame(step);
  }, [progress]);

  const rewind = useCallback(() => {
    clear();
    progress.set(0);
    shownPercent.current = 0;
    setPercent(0);
  }, [clear, progress]);

  // Straight into the download — the bar and the morph both start moving on the
  // first frame after the tap rather than sitting on an indeterminate handshake.
  const start = useCallback(() => {
    rewind();
    download();
  }, [download, rewind]);

  const cancel = useCallback(() => {
    rewind();
    setStage('idle');
  }, [rewind]);

  return { stage, percent, progress, start, cancel };
}
