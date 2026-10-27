import type { SettingName, SettingsData } from '@internal/core';
import { Label } from '@pixpilot/shadcn';
import { Select } from '@pixpilot/shadcn-ui';
import { useId } from 'react';

import { translate } from '../translate';
import { useSettings } from '../useSettings';

export interface SettingSelectProps<N extends SettingName<string>> {
  // The setting to edit.
  name: N;
  // Locale key of the label.
  label: string;
  // Option values mapped to the locale key of their label. Only these values can be selected.
  options: Partial<Record<SettingsData[N], string>>;
}

// A labelled setting of the current site with a fixed set of choices.
export function SettingSelect<N extends SettingName<string>>(
  props: SettingSelectProps<N>,
) {
  const { name, label, options } = props;
  const settings = useSettings();
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5 py-1.5">
      <Label htmlFor={id}>{translate(label)}</Label>
      <Select
        id={id}
        className="w-full"
        position="popper"
        value={settings[name]}
        options={Object.entries<string | undefined>(options).map(
          ([optionValue, locale]) => ({
            value: optionValue,
            label: translate(locale ?? optionValue),
          }),
        )}
        onChange={(selected) => {
          // An empty value is only reported when cleared, which is disabled here.
          if (selected) settings.set(name, selected as SettingsData[N]);
        }}
      />
    </div>
  );
}
