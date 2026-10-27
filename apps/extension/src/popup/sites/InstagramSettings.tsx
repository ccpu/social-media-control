import { Browser, VideoAutoplayMode, VideoControlMode } from '@internal/core';

import { AutoScrollSection } from '../components/AutoScrollSection';
import { PlaybackSection } from '../components/PlaybackSection';
import { SettingSelect } from '../components/SettingSelect';
import { SettingsSection } from '../components/SettingsSection';
import { SettingSwitch } from '../components/SettingSwitch';

const videoControlModeOptions: Record<VideoControlMode, string> = {
  [VideoControlMode.custom]: 'option_use_custom_controls',
  [VideoControlMode.native]: 'option_use_browser_controls',
  [VideoControlMode.disabled]: 'option_do_not_use_controls',
};

// The settings tab for Instagram.
export function InstagramSettings() {
  return (
    <>
      <SettingsSection title="control_settings">
        <SettingSelect
          name="videoControlMode"
          label="option_video_control_mode"
          options={videoControlModeOptions}
        />
        <SettingSwitch name="autoHideControlBar" label="option_auto_hide_control_bar" />
        <SettingSwitch name="showTimeCodeText" label="option_show_time_code" />
        {Browser.isFullscreenSupported && (
          <SettingSwitch name="showFullscreenButton" label="option_show_fullscreen" />
        )}
        {Browser.isPictureInPictureSupported && (
          <SettingSwitch
            name="showPictureInPictureButton"
            label="option_show_picture_in_picture"
          />
        )}
        <SettingSwitch
          name="showPlaybackSpeedOption"
          label="option_show_playback_speed"
        />
        <SettingSwitch name="showDownloadButton" label="option_show_download" />
      </SettingsSection>

      <PlaybackSection autoplayModes={Object.values(VideoAutoplayMode)}>
        <SettingSwitch name="loopPlayback" label="option_loop_playback" />
      </PlaybackSection>

      <AutoScrollSection />
    </>
  );
}
