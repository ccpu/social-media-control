import { Settings } from '@internal/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './popup.css';

// Follow the OS color scheme; the Tailwind theme switches on the `.dark` class.
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
function applyColorScheme() {
  document.documentElement.classList.toggle('dark', darkQuery.matches);
}
applyColorScheme();
darkQuery.addEventListener('change', applyColorScheme);

// Wait until the html is loaded.
document.addEventListener(
  'DOMContentLoaded',
  () => {
    const container = document.getElementById('root');
    if (!container) return;

    // Load the settings before the first render so the controls show stored values.
    void Settings.shared.init().then(() => {
      createRoot(container).render(
        <StrictMode>
          <App settings={Settings.shared} />
        </StrictMode>,
      );
    });
  },
  false,
);
