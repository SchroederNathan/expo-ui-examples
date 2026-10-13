import { addHingeListener, getHinge, type Hinge } from 'expo-hinge';
import { useEffect, useState } from 'react';

export type HingeSession = {
  minimum: number | null;
  maximum: number | null;
  events: number;
};

function initialSession(hinge: Hinge | null): HingeSession {
  return { minimum: hinge?.angle ?? null, maximum: hinge?.angle ?? null, events: 0 };
}

export function useHingeSession() {
  const [session, setSession] = useState(() => initialSession(getHinge()));

  useEffect(() => {
    const subscription = addHingeListener(({ hinge }) => {
      setSession((previous) => ({
        minimum: hinge ? Math.min(previous.minimum ?? hinge.angle, hinge.angle) : previous.minimum,
        maximum: hinge ? Math.max(previous.maximum ?? hinge.angle, hinge.angle) : previous.maximum,
        events: previous.events + 1,
      }));
    });
    return () => subscription.remove();
  }, []);

  return { session, reset: () => setSession(initialSession(getHinge())) };
}
