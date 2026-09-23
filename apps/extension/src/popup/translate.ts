import { Browser } from '@internal/core';

// Translates a locale key from `_locales/<lang>/messages.json` into text.
export function translate(locale: string): string {
  switch (locale) {
    // Build in variables.
    case '__name__':
      return Browser.getManifest().name;
    case '__version__':
      return Browser.getManifest().version;

    // Try to translate other locales.
    default:
      return Browser.i18n.getMessage(locale) || locale;
  }
}
