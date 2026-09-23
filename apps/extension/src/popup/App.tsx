import type { Settings } from '@internal/core';
import { Browser, VideoAutoplayMode, VideoControlMode } from '@internal/core';
import { Separator } from '@pixpilot/shadcn';
import { Alert } from '@pixpilot/shadcn-ui';

import { SettingSelect } from './components/SettingSelect';
import { SettingsSection } from './components/SettingsSection';
import { SettingSwitch } from './components/SettingSwitch';
import { translate } from './translate';
import { useSettings } from './useSettings';

const videoControlModeOptions: Record<VideoControlMode, string> = {
  [VideoControlMode.custom]: 'option_use_custom_controls',
  [VideoControlMode.native]: 'option_use_browser_controls',
  [VideoControlMode.disabled]: 'option_do_not_use_controls',
};

const autoplayModeOptions: Record<VideoAutoplayMode, string> = {
  [VideoAutoplayMode.muted]: 'option_autoplay_muted',
  [VideoAutoplayMode.unmuted]: 'option_autoplay_unmuted',
  [VideoAutoplayMode.stopped]: 'option_autoplay_stopped',
};

// Browser specific steps to allow autoplay with audio.
const autoplaySteps = [
  'enable_autoplay_in_step_1',
  'enable_autoplay_in_step_2',
  ...(Browser.isFirefox() ? ['enable_autoplay_in_step_3_firefox'] : []),
  ...(Browser.isChrome()
    ? ['enable_autoplay_in_step_3_chrome', 'enable_autoplay_in_step_4_chrome']
    : []),
];

const links = [
  { href: 'https://github.com/ccpu/social-media-control', label: 'view_on_github' },
  {
    href: 'https://github.com/ccpu/social-media-control/issues/new',
    label: 'report_an_issue',
  },
];

export interface AppProps {
  settings: Settings;
}

// The settings menu in the extension icon.
export function App(props: AppProps) {
  const settings = useSettings(props.settings);

  return (
    <div className="w-100 px-4 py-3 text-sm">
      <header className="pb-2">
        <h1 className="text-base font-semibold">{translate('__name__')}</h1>
        <p className="text-muted-foreground text-xs">{translate('__version__')}</p>
      </header>

      <Separator />

      <SettingsSection title="control_settings">
        <SettingSelect
          label="option_video_control_mode"
          value={settings.videoControlMode}
          options={videoControlModeOptions}
          onChange={(value) => {
            settings.videoControlMode = value;
          }}
        />
        <SettingSwitch
          label="option_auto_hide_control_bar"
          checked={settings.autoHideControlBar}
          onCheckedChange={(checked) => {
            settings.autoHideControlBar = checked;
          }}
        />
        <SettingSwitch
          label="option_show_time_code"
          checked={settings.showTimeCodeText}
          onCheckedChange={(checked) => {
            settings.showTimeCodeText = checked;
          }}
        />
        {Browser.isFullscreenSupported && (
          <SettingSwitch
            label="option_show_fullscreen"
            checked={settings.showFullscreenButton}
            onCheckedChange={(checked) => {
              settings.showFullscreenButton = checked;
            }}
          />
        )}
        {Browser.isPictureInPictureSupported && (
          <SettingSwitch
            label="option_show_picture_in_picture"
            checked={settings.showPictureInPictureButton}
            onCheckedChange={(checked) => {
              settings.showPictureInPictureButton = checked;
            }}
          />
        )}
        <SettingSwitch
          label="option_show_playback_speed"
          checked={settings.showPlaybackSpeedOption}
          onCheckedChange={(checked) => {
            settings.showPlaybackSpeedOption = checked;
          }}
        />
        <SettingSwitch
          label="option_show_download"
          checked={settings.showDownloadButton}
          onCheckedChange={(checked) => {
            settings.showDownloadButton = checked;
          }}
        />
      </SettingsSection>

      <Separator />

      <SettingsSection title="playback_settings">
        <SettingSelect
          label="option_autoplay_mode"
          value={settings.autoplayMode}
          options={autoplayModeOptions}
          onChange={(value) => {
            settings.autoplayMode = value;
          }}
        />
        {settings.autoplayMode === VideoAutoplayMode.unmuted && (
          <Alert
            variant="warning"
            className="my-1.5"
            icon
            description={
              <>
                <p>{translate('option_auto_unmute_playback_hint')}</p>
                <ol className="mt-1 list-decimal space-y-0.5 pl-4">
                  {autoplaySteps.map((step) => (
                    <li key={step}>{translate(step)}</li>
                  ))}
                </ol>
              </>
            }
          />
        )}
        <SettingSwitch
          label="option_loop_playback"
          checked={settings.loopPlayback}
          onCheckedChange={(checked) => {
            settings.loopPlayback = checked;
          }}
        />
      </SettingsSection>

      <Separator />

      <SettingsSection title="auto_scroll_settings">
        <SettingSwitch
          label="option_advance_on_video_end"
          checked={settings.advanceOnVideoEnd}
          onCheckedChange={(checked) => {
            settings.advanceOnVideoEnd = checked;
          }}
        />
        <p className="text-muted-foreground text-xs">
          {translate('option_advance_on_video_end_hint')}
        </p>
      </SettingsSection>

      <Separator />

      <footer className="text-muted-foreground flex gap-3 pt-3 text-xs">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground hover:underline"
          >
            {translate(link.label)}
          </a>
        ))}
      </footer>
    </div>
  );
}
