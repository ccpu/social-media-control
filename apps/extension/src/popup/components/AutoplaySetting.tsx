import { Browser, VideoAutoplayMode } from '@internal/core';
import { Alert } from '@pixpilot/shadcn-ui';

import { translate } from '../translate';
import { useSettings } from '../useSettings';
import { SettingSelect } from './SettingSelect';

const autoplayModeLabels: Record<VideoAutoplayMode, string> = {
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

export interface AutoplaySettingProps {
  // The autoplay modes the site supports.
  modes: VideoAutoplayMode[];
}

// The autoplay mode of the current site, with the steps to allow autoplay with audio while that mode is selected.
export function AutoplaySetting(props: AutoplaySettingProps) {
  const settings = useSettings();
  const options = Object.fromEntries(
    props.modes.map((mode) => [mode, autoplayModeLabels[mode]]),
  );

  return (
    <>
      <SettingSelect name="autoplayMode" label="option_autoplay_mode" options={options} />
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
    </>
  );
}
