// Instagram page script. Runs in the page's own JavaScript context (`MAIN` world) at `document_start`, so it can
// register the React DevTools hook before Instagram's React loads and detect video players as they are rendered.
// It has no access to extension APIs; settings and resources arrive from `content.ts` via `window.postMessage`.

import { VideoDetector } from './page/videoDetector';

const detector = new VideoDetector();
detector.init().then();
