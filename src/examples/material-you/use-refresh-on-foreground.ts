import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

// `useMaterialColors` reads the palette on each render but doesn't subscribe to
// system changes, so change your wallpaper and the JS-side colors would go stale
// while the Compose components retheme themselves. Re-rendering on foreground
// keeps both halves in sync after a trip to the wallpaper picker.
export function useRefreshOnForeground() {
  const [, refresh] = useState(0);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (status) => {
      if (status === 'active') {
        refresh((n) => n + 1);
      }
    });
    return () => sub.remove();
  }, []);
}
