import { SettingHint } from './SettingHint';
import { SettingsSection } from './SettingsSection';
import { SettingSwitch } from './SettingSwitch';

// Auto-scroll settings, the same for every site.
export function AutoScrollSection() {
  return (
    <SettingsSection title="auto_scroll_settings">
      <SettingSwitch name="advanceOnVideoEnd" label="option_advance_on_video_end" />
      <SettingHint text="option_advance_on_video_end_hint" />
    </SettingsSection>
  );
}
