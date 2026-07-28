import { Asset } from 'expo-asset';
import { useEffect, useState } from 'react';

// SwiftUI's Image reads `uiImage` synchronously with Data(contentsOf:), so it
// needs a real file:// path. Under Expo Go the asset starts life as an http
// Metro URL, hence the downloadAsync() before handing over localUri.
export function useAlbumArt() {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const asset = Asset.fromModule(require('@/assets/images/blond.jpeg'));

    asset
      .downloadAsync()
      .then(() => {
        if (!cancelled) {
          setUri(asset.localUri ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUri(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return uri;
}
