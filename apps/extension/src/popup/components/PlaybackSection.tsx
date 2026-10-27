import type { VideoAutoplayMode } from '@internal/core';
import type { ReactNode } from 'react';

import { AutoplaySetting } from './AutoplaySetting';
import { SettingsSection } from './SettingsSection';
import { SettingSwitch } from './SettingSwitch';

export interface PlaybackSectionProps {
  // The autoplay modes the site supports. Without them, the site has no autoplay setting.
  autoplayModes?: VideoAutoplayMode[];
  // Further playback settings of the site.
  children?: ReactNode;
}

// Playback settings: autoplay, the site's own settings and mouse-wheel seeking.
export function PlaybackSection(props: PlaybackSectionProps) {
  const { autoplayModes, children } = props;

  return (
    <SettingsSection title="playback_settings">
      {autoplayModes && <AutoplaySetting modes={autoplayModes} />}
      {children}
      <SettingSwitch name="seekWithMouseWheel" label="option_seek_with_mouse_wheel" />
    </SettingsSection>
  );
}
