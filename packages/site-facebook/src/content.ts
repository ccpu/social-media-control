// Facebook content script. Runs in the isolated extension context, so it can read the extension settings directly.
// Currently it only adds auto-scroll to the Reels viewer.

import { ReelAdvancer } from './reelAdvancer';

const reelAdvancer = new ReelAdvancer();
reelAdvancer.init().then();
