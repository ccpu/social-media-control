import type { Settings } from '@internal/core';
import { createContext, use, useEffect, useReducer } from 'react';

// The settings of the site whose tab is rendered.
export const SettingsContext = createContext<Settings | undefined>(undefined);

// Returns the settings of the current site tab. Re-renders the component whenever a setting changes, in the popup or
// elsewhere (e.g. storage sync).
export function useSettings(): Settings {
  const settings = use(SettingsContext);
  if (!settings) throw new Error('useSettings must be used inside a SettingsContext.');

  const [, rerender] = useReducer((count: number) => count + 1, 0);

  useEffect(() => {
    settings.changed.subscribe(rerender);
    return () => settings.changed.unsubscribe(rerender);
  }, [settings]);

  return settings;
}
