import { Browser, VideoAutoplayMode, VideoControlMode } from '@internal/core';

import { AutoplaySetting } from '../components/AutoplaySetting';
import { AutoScrollSection } from '../components/AutoScrollSection';
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

      <SettingsSection title="playback_settings">
        <AutoplaySetting modes={Object.values(VideoAutoplayMode)} />
        <SettingSwitch name="loopPlayback" label="option_loop_playback" />
        <SettingSwitch name="seekWithMouseWheel" label="option_seek_with_mouse_wheel" />
      </SettingsSection>

      <AutoScrollSection />
    </>
  );
}
