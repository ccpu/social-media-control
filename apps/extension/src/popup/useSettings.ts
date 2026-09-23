import type { Settings } from '@internal/core';
import { useEffect, useReducer } from 'react';

// Re-renders the component whenever a setting changes, in the popup or elsewhere (e.g. storage sync).
export function useSettings(settings: Settings): Settings {
  const [, rerender] = useReducer((count: number) => count + 1, 0);

  useEffect(() => {
    settings.changed.subscribe(rerender);
    return () => settings.changed.unsubscribe(rerender);
  }, [settings]);

  return settings;
}
