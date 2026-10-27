import { VideoAutoplayMode } from '@internal/core';

import { AutoplaySetting } from '../components/AutoplaySetting';
import { AutoScrollSection } from '../components/AutoScrollSection';
import { SettingsSection } from '../components/SettingsSection';
import { SettingSwitch } from '../components/SettingSwitch';

// The settings tab for Facebook. Facebook keeps its own player, so there are no control settings.
export function FacebookSettings() {
  return (
    <>
      <SettingsSection title="playback_settings">
        <AutoplaySetting modes={[VideoAutoplayMode.muted, VideoAutoplayMode.unmuted]} />
        <SettingSwitch name="seekWithMouseWheel" label="option_seek_with_mouse_wheel" />
      </SettingsSection>

      <AutoScrollSection />
    </>
  );
}
