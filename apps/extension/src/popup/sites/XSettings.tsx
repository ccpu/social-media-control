import { VideoAutoplayMode } from '@internal/core';

import { PlaybackSection } from '../components/PlaybackSection';

// The settings tab for X. X keeps its own player, so there are no control settings.
export function XSettings() {
  return (
    <PlaybackSection
      autoplayModes={[VideoAutoplayMode.muted, VideoAutoplayMode.unmuted]}
    />
  );
}
