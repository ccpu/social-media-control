// Instagram content script. Runs in the isolated extension context, reads the settings and resources and forwards them
// to the page script (`page.ts`) via `window.postMessage`.

import { CommunicationManager } from './content/communicationManager';

const communicationManager = new CommunicationManager();
communicationManager.init().then();
