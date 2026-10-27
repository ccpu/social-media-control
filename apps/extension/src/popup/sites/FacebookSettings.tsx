import { VideoAutoplayMode } from '@internal/core';

import { AutoScrollSection } from '../components/AutoScrollSection';
import { PlaybackSection } from '../components/PlaybackSection';

// The settings tab for Facebook. Facebook keeps its own player, so there are no control settings.
export function FacebookSettings() {
  return (
    <>
      <PlaybackSection
        autoplayModes={[VideoAutoplayMode.muted, VideoAutoplayMode.unmuted]}
      />
      <AutoScrollSection />
    </>
  );
}
