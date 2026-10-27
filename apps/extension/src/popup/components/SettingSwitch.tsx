import type { SettingName } from '@internal/core';
import { Label, Switch } from '@pixpilot/shadcn';
import { useId } from 'react';

import { translate } from '../translate';
import { useSettings } from '../useSettings';

export interface SettingSwitchProps {
  // The on/off setting to edit.
  name: SettingName<boolean>;
  // Locale key of the label.
  label: string;
}

// A labelled on/off setting of the current site.
export function SettingSwitch(props: SettingSwitchProps) {
  const { name, label } = props;
  const settings = useSettings();
  const id = useId();

  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <Label htmlFor={id} className="cursor-pointer font-normal">
        {translate(label)}
      </Label>
      <Switch
        id={id}
        checked={settings[name]}
        onCheckedChange={(checked) => settings.set(name, checked)}
      />
    </div>
  );
}
