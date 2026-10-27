import { SettingsSection } from '../components/SettingsSection';
import { SettingSwitch } from '../components/SettingSwitch';

// The settings tab for YouTube. Only mouse-wheel seeking is added there.
export function YoutubeSettings() {
  return (
    <SettingsSection title="playback_settings">
      <SettingSwitch name="seekWithMouseWheel" label="option_seek_with_mouse_wheel" />
    </SettingsSection>
  );
}
